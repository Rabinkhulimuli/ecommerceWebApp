'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, Wallet } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Esewa from '@/components/esewa/Esewa';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const total = searchParams.get('price')
  const productCode= searchParams.get('product')
  const router= useRouter()
  if(!total||Number(total)<=0||!productCode){
    return router.push("/")
  }
  return (
    <div className='container mx-auto max-w-2xl px-4 py-16 space-y-6 text-center'>
      <div className='mb-8'>
        <CheckCircle className='mx-auto mb-6 h-24 w-24 text-green-600' />
        <h1 className='mb-4 text-3xl font-bold text-gray-900'>Order Placed Successfully!</h1>
        <p className='text-lg text-gray-600'>
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
      </div>

      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between'>
            <span>Order Number:</span>
            <span className='font-semibold'>
              #MS-{productCode}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Estimated Delivery:</span>
            <span className='font-semibold'>5-7 business days</span>
          </div>
          <div className='flex justify-between'>
            <span>Total Amount:</span>
            <span className='text-lg font-semibold'>{total} </span>
          </div>
        </CardContent>
      </Card>

      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        <Card>
          <CardContent className='p-6 text-center'>
            <Package className='mx-auto mb-4 h-12 w-12 text-blue-600' />
            <h3 className='mb-2 font-semibold'>Order Confirmation</h3>
            <p className='text-sm text-gray-600'>
              You'll receive an email confirmation with your order details shortly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6 text-center'>
            <Truck className='mx-auto mb-4 h-12 w-12 text-green-600' />
            <h3 className='mb-2 font-semibold'>Shipping Updates</h3>
            <p className='text-sm text-gray-600'>
              We'll send you tracking information once your order ships.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col justify-center gap-4 sm:flex-row'>
        <Link href='/products'>
          <Button size='lg'>Continue Shopping</Button>
        </Link>
        <Link href='/orders'>
          <Button variant='outline' size='lg'>
            View Orders
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
         <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
             <span>Pay with eSewa</span>
           </CardTitle>
       </CardHeader>
         <CardContent>
           <Esewa total_amount={Number(total) ?? 0} productCode={productCode} />
        </CardContent>
       </Card>
    </div>
  );
}
