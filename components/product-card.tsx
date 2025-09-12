'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ProductType } from '@/lib/types';
import { useAddToCart } from '@/services/cart.service';
import { useSession } from 'next-auth/react';
import { WishlistButton } from './wishlist/WishListButton';

export interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { addCartItem, isLoading, error } = useAddToCart();
  const handleAddToCart = () => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must login first',
        variant: 'destructive',
      });
      return;
    }
    addCartItem({ userId: userId, productId: product.id, quantity: 1 });
    toast({
      title: 'Added to cart',
      description: `${
        product.name.length > 40 ? product.name.slice(0, 40) + '...' : product.name
      } has been added to your cart.`,
    });
  };
  return (
    <Card className='product-card-hover group overflow-hidden'>
      <div className='relative aspect-square overflow-hidden'>
        <Link href={`/products/${product.id}`}>
          <Image
            src={product?.images?.[0]?.url ?? '/placeholder.svg?height=300&width=300'}
            alt={product.name}
            fill
            className='rounded-md object-cover p-2 drop-shadow-xl transition-transform duration-300 group-hover:scale-105 sm:p-6'
          />
        </Link>
        {product.discount && (
          <Badge className='absolute left-2 top-2 bg-red-500'>
            -{product.discount.toString()}%
          </Badge>
        )}
        <div className='absolute right-2 top-2 sm:opacity-0 transition-opacity group-hover:opacity-100 '>
          <WishlistButton productId={product.id} userId={userId} />
        </div>
      </div>

      <CardContent className='p-4'>
        <Link href={`/products/${product.id}`}>
          <h3 className='line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600'>
            {product.name}
          </h3>
        </Link>
        <p className='mt-1 line-clamp-2 text-sm text-gray-600'>{product.description}</p>
        <div className='mt-3 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <span className='text-lg font-bold text-gray-900'>
              $
              {(
                Number(product.price) -
                (Number(product.price) * Number(product.discount)) / 100
              ).toFixed(2)}
            </span>
            {<span className='text-sm text-gray-500 line-through'>{Number(product.price)}</span>}
          </div>
          <div className='flex items-center space-x-1'>
            <div className='flex text-yellow-400'>
              {'★'.repeat(Math.floor(product.rating || 5))}
            </div>
            <span className='text-sm text-gray-600'>({product.reviews || 0})</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='p-4 pt-0'>
        <Button onClick={handleAddToCart} className='group w-full' disabled={product.stock < 1}>
          <ShoppingCart className='mr-2 h-4 w-4 group-hover:animate-bounce' />
          {product.stock > 0 ? (isLoading ? 'Adding...' : 'Add to Cart') : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
