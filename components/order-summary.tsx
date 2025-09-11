'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItemResponsetype } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type OrderSummaryProps = {
  items: CartItemResponsetype;
  total: number;
};

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const tax = total * 0.08;
  const shipping = 0;
  const finalTotal = total + tax + shipping;
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          {items.map(item => (
            <div
              onClick={() => router.push(`/products/${item.product.id}`)}
              key={item.id}
              className='flex items-center space-x-3'
            >
              <div className='relative h-12 w-12 overflow-hidden rounded-md'>
                <Image
                  src={item.product.images[0]?.url || '/placeholder.svg?height=48&width=48'}
                  alt={item.product.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='max-w-32 truncate text-sm font-medium md:max-w-xs'>
                  {item.product.name}
                </p>
                <p className='text-xs text-gray-600'>Qty: {item.quantity}</p>
              </div>
              <p className='text-sm font-medium'>
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${Number(shipping).toFixed(2)}`}</span>
          </div>
          <div className='flex justify-between'>
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className='flex justify-between text-lg font-bold'>
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
