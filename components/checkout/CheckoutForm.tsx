'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Truck, Package, Wallet } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Address, CartItemResponsetype } from '@/lib/types';
import { useGetUser } from '@/services/user.service';
import FormSkeleton from './UserForm';
import { useRouter } from 'next/navigation';
import { useClearCart } from '@/services/cart.service';
import { useSession } from 'next-auth/react';

interface CheckoutFormProps {
  step: 'shipping' | 'payment' | 'review';
  onNext?: () => void;
  total?: number;
  cartItems?: CartItemResponsetype;
}

export function CheckoutForm({ step, onNext, total, cartItems }: CheckoutFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { userData, isLoading } = useGetUser();
  const { clearCartItems } = useClearCart();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { handleSubmit, register, setValue } = useForm<Address>({
    defaultValues: {
      firstName: session?.user.name || '',
      lastName: '',
      email: session?.user.email || '',
      phone: '',
      postalCode: '',
      country: '',
      street: '',
      city: '',
      shippingId: '',
    },
  });

  const [isPrimary, setIsPrimary] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem('paymentMethod') || 'CASH_ON_DELIVERY'
  );
  useEffect(() => {
    if (!userData) return;

    const nameSplit = userData.name?.split(' ') ?? [];
    setValue('firstName', nameSplit[0] || '');
    setValue('lastName', nameSplit[1] || '');
    setValue('email', userData.email || '');

    let addressToUse: (typeof userData.addresses)[0] | undefined;

    if (isPrimary) {
      addressToUse = userData.addresses.find(addr => addr.isPrimary);
    } else {
      addressToUse =
        userData.addresses.find(addr => !addr.isPrimary) ||
        userData.addresses.find(addr => addr.isPrimary);
    }

    if (addressToUse) {
      setValue('postalCode', addressToUse.postalCode || '');
      setValue('country', addressToUse.country || '');
      setValue('street', addressToUse.street || '');
      setValue('city', addressToUse.city || '');
      setIsPrimary(addressToUse.isPrimary);
      setValue('shippingId', addressToUse.id);
    }
  }, [userData, isPrimary, setValue]);

  const onSubmit: SubmitHandler<Address> = async data => {
    if (step === 'payment') {
      localStorage.setItem('paymentMethod', paymentMethod);
    }
    if (step === 'shipping') {
      if (!userData) return;

      // Determine which address is being used
      const addressToCompare = isPrimary
        ? userData.addresses.find(addr => addr.isPrimary)
        : userData.addresses.find(addr => !addr.isPrimary);

      const hasChanged =
        !addressToCompare ||
        addressToCompare.city !== data.city ||
        addressToCompare.country !== data.country ||
        addressToCompare.postalCode !== data.postalCode ||
        addressToCompare.street !== data.street;

      if (hasChanged) {
        try {
          const res = await fetch('/api/user/update-address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: data }),
          });

          if (!res.ok) {
            throw new Error('Failed to update address');
          }

          const result = await res.json();
          console.log('address resp', result);
          toast({
            title: 'Address updated!',
            description: 'Your shipping address has been saved.',
          });

          setValue('city', result.address.city);
          setValue('country', result.address.country);
          setValue('street', result.address.street);
          setValue('postalCode', result.address.postalCode);
          setValue('shippingId', result.address.id);
        } catch (error) {
          console.error(error);
          toast({
            title: 'Address update failed',
            description: 'Please try again.',
            variant: 'destructive',
          });
          return;
        }
      }
    }
    if (step === 'review') {
      setIsProcessing(true);
      if (!data.shippingId) {
        setIsProcessing(false);
        return;
      }
      const payMethod = localStorage.getItem('paymentMethod');
      try {
        const res = await fetch('/api/orders/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            shippingId: data.shippingId,
            paymentMethod: payMethod || paymentMethod,
          }),
        });
        if (res.ok) {
          toast({
            title: 'Order placed successfully!',
            description:
              "Thank you for your purchase. You'll receive a confirmation email shortly.",
          });
          const orderData = await res.json();
          console.log('orderId from place order', orderData);
          if (userId) clearCartItems(userId);
          localStorage.removeItem('paymentMethod');
          setIsProcessing(false);
          router.push(`/orders/order-success?price=${total}&product=${orderData.id}`);
        } else {
          toast({
            title: 'Order failed place',
            description: 'Please try again after 5 minutes.',
            variant: 'destructive',
          });
          setIsProcessing(false);
        }
      } catch (err) {
        console.log(err);
        toast({
          title: 'Order failed place',
          description: 'Please try again after 5 minutes.',
          variant: 'destructive',
        });
        setIsProcessing(false);
      }
    }

    onNext?.();
  };

  if (step === 'shipping') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex flex-col gap-2'>
            <span className='flex gap-1'>
              <Truck className='hidden h-5 w-5 sm:block' />
              <span className='text-nowrap tracking-tight'>Shipping Information</span>
            </span>
            <div className='flex w-fit items-center gap-1 rounded-md border text-xl font-semibold shadow-md'>
              <button
                onClick={() => setIsPrimary(true)}
                className={`w-fit rounded-md px-4 py-1 ${isPrimary ? 'bg-rose-200' : ''}`}
              >
                Primary Address
              </button>
              {userData && userData.addresses.length > 1 && (
                <button
                  onClick={() => setIsPrimary(false)}
                  className={`w-fit rounded-md px-4 py-1 ${isPrimary ? '' : 'bg-rose-200'}`}
                >
                  Secondary Address
                </button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input id='firstName' required {...register('firstName')} disabled />
                </div>
                <div>
                  <Label htmlFor='lastName'>Last Name</Label>
                  <Input id='lastName' required {...register('lastName')} disabled />
                </div>
              </div>

              <div>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' required {...register('email')} disabled />
              </div>

              <div className='text-capitalize grid gap-4 md:grid-cols-3'>
                <div>
                  <Label htmlFor='city'>City</Label>
                  <Input id='city' required {...register('city')} />
                </div>
                <div>
                  <Label htmlFor='street'>Street</Label>
                  <Input id='street' required {...register('street')} />
                </div>
                <div>
                  <Label htmlFor='postalCode'>Postal Code</Label>
                  <Input id='postalCode' required {...register('postalCode')} />
                </div>
              </div>

              <div>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input id='phone' type='tel' {...register('phone')} />
              </div>

              <Button type='submit' className='w-full'>
                Continue to Payment
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    );
  }

  if (step === 'payment') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <CreditCard className='h-5 w-5' />
            <span>Select Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className='flex items-center space-x-2 rounded-lg border p-3'>
                <RadioGroupItem value='CASH_ON_DELIVERY' id='cod' />
                <Label htmlFor='cod'>Cash on Delivery</Label>
              </div>
              <div className='flex items-center space-x-2 rounded-lg border p-3'>
                <RadioGroupItem value='CREDIT_CARD' id='card' />
                <Label htmlFor='card'>Credit / Debit Card</Label>
              </div>
              <div className='flex items-center space-x-2 rounded-lg border p-3'>
                <RadioGroupItem value='BANK_TRANSFER' id='banktransfer' />
                <Label htmlFor='card'>Bank transfer</Label>
              </div>
              <div className='flex items-center space-x-2 rounded-lg border p-3'>
                <RadioGroupItem value='PAYPAL' id='paypal' />
                <Label htmlFor='card'>Paypal</Label>
              </div>
              <div className='flex items-center space-x-2 rounded-lg border p-3'>
                <RadioGroupItem value='ESEWA' id='esewa' />
                <Label htmlFor='esewa'>eSewa (will be processed after order)</Label>
              </div>
            </RadioGroup>
            <Button type='submit' className='w-full'>
              Continue to Review
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Package className='h-5 w-5' />
          <span>Review Your Order</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div>
            <h3 className='mb-2 font-semibold'>Shipping Address</h3>
            <div className='text-sm capitalize text-gray-600'>
              <p>{userData?.name || 'John Doe'}</p>
              <p>{userData?.addresses[0]?.street || '123 Main'} Street</p>
              <p>
                {userData?.addresses[0]?.city || 'New York'},{' '}
                {userData?.addresses[0]?.postalCode || '00000'}
              </p>
            </div>
          </div>

          <div>
            <h3 className='mb-2 font-semibold'>Payment Method</h3>
            <p className='text-sm text-gray-600'>
              {localStorage.getItem('paymentMethod') || paymentMethod}{' '}
            </p>
          </div>

          <div className='mt-4 flex justify-between'>
            <span className='text-sm'>Total:</span>
            <span className='text-lg font-semibold'>{total}</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Button type='submit' className='w-full' size='lg' disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
