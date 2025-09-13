'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingBag, Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useWishlist } from './hooks/useWhislist';
import { useAddToCart } from '@/services/cart.service';
import Link from 'next/link';

export type WishlistItemType = {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
    }>;
  };
};

export default function WishlistPage() {
  const { data } = useSession();
  const userId = data?.user.id;
  const { isLoading: loading, wishlist, removeFromWishlist } = useWishlist(userId ?? '');
  const { addCartItem, isLoading } = useAddToCart();
  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {[...Array(8)].map((_, i) => (
              <Card key={i} className='animate-pulse overflow-hidden'>
                <div className='aspect-square bg-muted' />
                <CardContent className='p-4'>
                  <div className='mb-2 h-4 rounded bg-muted' />
                  <div className='h-4 w-2/3 rounded bg-muted' />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header Section */}
      <div className='border-b border-border bg-gradient-to-r from-primary/5 to-accent/5'>
        <div className='container mx-auto px-4 py-12 text-center'>
          <div className='mb-4 flex items-center justify-center gap-3'>
            <Heart className='h-8 w-8 fill-primary text-primary' />
            <h1 className='text-4xl font-bold text-foreground'>Your Wishlist</h1>
          </div>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            {wishlist && wishlist.data.length > 0
              ? `${wishlist.data.length} item${wishlist.data.length === 1 ? '' : 's'} waiting for you`
              : "Your wishlist is empty, but your dreams don't have to be"}
          </p>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        {wishlist && wishlist.data.length === 0 ? (
          <div className='py-16 text-center'>
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted'>
              <Heart className='h-12 w-12 text-muted-foreground' />
            </div>
            <h2 className='mb-4 text-2xl font-semibold text-foreground'>Your wishlist is empty</h2>
            <p className='mx-auto mb-8 max-w-md text-muted-foreground'>
              Start adding products you love to keep track of them and never miss out on your
              favorites.
            </p>
            <Button size='lg' className='gap-2'>
              <ShoppingBag className='h-5 w-5' />
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {wishlist &&
                Array.isArray(wishlist.data) &&
                wishlist.data.map((item: WishlistItemType) => (
                  <Card
                    key={item.id}
                    className='group overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg'
                  >
                    <div className='relative aspect-square overflow-hidden bg-muted'>
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0].url || '/placeholder.svg'}
                          alt={item.product.images[0].alt || item.product.name}
                          fill
                          className='object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center bg-muted'>
                          <ShoppingBag className='h-16 w-16 text-muted-foreground' />
                        </div>
                      )}

                      {/* Remove Button */}
                      <Button
                        size='sm'
                        variant='destructive'
                        className='absolute right-3 top-3 h-8 w-8 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                        onClick={() => removeFromWishlist(item.product.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>

                      {/* Wishlist Badge */}
                      <div className='absolute left-3 top-3'>
                        <div className='flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground'>
                          <Heart className='h-3 w-3 fill-current' />
                          Saved
                        </div>
                      </div>
                    </div>

                    <CardContent className='p-4'>
                      <h3 className='mb-2 line-clamp-2 font-semibold leading-tight text-card-foreground'>
                        {item.product.name}
                      </h3>
                      <div className='flex items-center justify-between'>
                        <p className='text-xl font-bold text-primary'>
                          ${Number(item.product.price).toFixed(2)}
                        </p>
                        <div className='flex items-center gap-1 text-muted-foreground'>
                          <Star className='h-4 w-4 fill-current text-yellow-400' />
                          <span className='text-sm'>4.5</span>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          addCartItem({
                            userId: userId ?? '',
                            productId: item.product.id,
                          })
                        }
                        className='group w-full'
                        disabled={item.product.stock < 1}
                      >
                        <ShoppingCart className='mr-2 h-4 w-4 group-hover:animate-bounce' />
                        {item.product?.stock > 0
                          ? isLoading
                            ? 'Adding...'
                            : 'Add to Cart'
                          : 'Out of Stock'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Call-to-Action Section */}
            <div className='border-t border-border py-8 text-center'>
              <h2 className='mb-4 text-2xl font-semibold text-foreground'>Ready for more?</h2>
              <p className='mx-auto mb-6 max-w-md text-muted-foreground'>
                Discover more amazing products and add them to your wishlist.
              </p>
              <Link href={'/products'}>
                <Button size='lg' variant='outline' className='gap-2 bg-transparent'>
                  <ShoppingBag className='h-5 w-5' />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
