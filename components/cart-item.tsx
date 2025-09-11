'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItemResponsetype} from '@/lib/types';
import { useEffect, useState } from 'react';
import { useRemoveFromCart, useUpdateCart } from '@/services/cart.service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function CartItem({ item }: { item: CartItemResponsetype[0] }) {
  const [count, setCount] = useState(1);
  const [countChanged, setCountChanged] = useState(false);
  const { updateCartItem, isLoading, error } = useUpdateCart();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();
  const { removeCartItem } = useRemoveFromCart();
  useEffect(() => {
    if (!userId) return;
    if (!countChanged) return;
    const timeout = setTimeout(() => {
      const params = {
        userId: userId,
        productId: item.product.id,
        quantity: count,
      };
      updateCartItem(params);
      setCountChanged(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [countChanged, count]);
  useEffect(() => {
    if (item) {
      setCount(item.quantity);
    }
  }, [item]);
  const handleRemoveCart = () => {
    if (!userId) return;
    removeCartItem({ userId, productId: item.product.id });
  };
  return (
    <Card>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0'>
          <div
            onClick={() => router.push(`/products/${item.product.id}`)}
            className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24'
          >
            <Image
              src={item.product.images[0].url || '/placeholder.svg?height=80&width=80'}
              alt={item.product.name}
              fill
              className='object-cover'
            />
          </div>

          <div onClick={() => router.push(`/products/${item.product.id}`)} className=''>
            <h3 className='max-w-[200px] truncate font-semibold text-gray-900 sm:max-w-xs'>
              {item.product.name}
            </h3>
            <p className='line-clamp-2 max-w-[200px] text-sm text-gray-600 sm:max-w-xs'>
              {item.product?.description}
            </p>
            <p className='mt-1 text-sm font-bold text-gray-900'>
              ${Number(item.product.price).toFixed(2)}
            </p>
          </div>

          <div className='flex w-full flex-col justify-between gap-2 space-y-2 sm:flex-row sm:items-center sm:justify-around sm:gap-2 sm:space-y-0'>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                disabled={count < 2}
                className=''
                onClick={() => {
                  setCount(prev => prev - 1);
                  setCountChanged(true);
                }}
              >
                <Minus className='h-4 w-4' />
              </Button>
              <div className='w-5 text-center'>{count > 9 ? count : `0${count}`}</div>
              <Button
                variant='outline'
                size='icon'
                onClick={() => {
                  setCount(prev => prev + 1);
                  setCountChanged(true);
                }}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            <div className='flex items-center justify-between text-right'>
              <p className='font-bold sm:text-lg'>
                <span className='sm:hidden'>Total: </span>$
                {(Number(item.product.price) * count).toFixed(2)}
              </p>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleRemoveCart}
                className='text-red-600 hover:bg-red-50 hover:text-red-700'
              >
                <Trash2 className='h-4 w-4 sm:mr-1' />
                <span className=''>Remove</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
