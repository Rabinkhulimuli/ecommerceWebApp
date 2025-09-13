'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

type FormValues = {
  name: string;
  street?: string;
  city: string;
  country: string;
  postalCode: string;
};

export default function ShopForm() {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<(FormValues & { id: string }) | null>(null);

  const { data: session } = useSession();
  const userId = session?.user.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues & { id: string }>({
    defaultValues: {
      name: '',
      street: '',
      city: '',
      country: '',
      postalCode: '',
      id: '',
    },
  });

  useEffect(() => {
    const fetchShop = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/admin/shop?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data?.data) {
          const formData = {
            id: data.data.id,
            name: data.data.name,
            street: data.data.address?.street || '',
            city: data.data.address?.city || '',
            country: data.data.address?.country || '',
            postalCode: data.data.address?.postalCode || '',
          };

          setInitialData(formData);
          reset(formData);
        }
      } catch (err) {
        console.error('Failed to fetch shop data', err);
      }
    };
    fetchShop();
  }, [userId, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!data.name) {
      toast({ title: 'Shop name is required', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const url = initialData ? `/api/admin/shop?shopId=${initialData.id}` : '/api/admin/shop';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData ? data : { ...data, ownerId: userId }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({ title: result.error || 'Something went wrong', variant: 'destructive' });
      } else {
        toast({ title: initialData ? 'Shop updated successfully!' : 'Shop created successfully!' });
      }
    } catch (err) {
      toast({
        title: initialData ? 'Failed to update shop' : 'Failed to create shop',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto mt-10 max-w-3xl px-4'>
      <Card className='rounded-2xl shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>
            {initialData ? 'Update Your Shop' : 'Create Your Shop'}
          </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-6'>
          <div className='grid gap-1'>
            <Label htmlFor='name'>Shop Name</Label>
            <Input
              id='name'
              {...register('name', { required: 'Shop name is required' })}
              placeholder='Enter your shop name'
            />
            {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
          </div>

          <div className='grid gap-1'>
            <Label htmlFor='street'>Street (Optional)</Label>
            <Input id='street' {...register('street')} placeholder='Street' />
          </div>

          <div className='grid gap-1'>
            <Label htmlFor='city'>City*</Label>
            <Input
              id='city'
              {...register('city', { required: 'City is required' })}
              placeholder='City'
            />
            {errors.city && <p className='text-sm text-red-500'>{errors.city.message}</p>}
          </div>

          <div className='grid gap-1'>
            <Label htmlFor='country'>Country*</Label>
            <Input
              id='country'
              {...register('country', { required: 'Country is required' })}
              placeholder='Country'
            />
            {errors.country && <p className='text-sm text-red-500'>{errors.country.message}</p>}
          </div>

          <div className='grid gap-1'>
            <Label htmlFor='postalCode'>Postal Code*</Label>
            <Input
              id='postalCode'
              {...register('postalCode', { required: 'Postal code is required' })}
              placeholder='Postal Code'
            />
            {errors.postalCode && (
              <p className='text-sm text-red-500'>{errors.postalCode.message}</p>
            )}
          </div>

          <Button onClick={handleSubmit(onSubmit)} disabled={loading} className='mt-4'>
            {loading
              ? initialData
                ? 'Updating...'
                : 'Creating...'
              : initialData
                ? 'Update Shop'
                : 'Create Shop'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
