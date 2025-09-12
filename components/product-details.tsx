'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ProductType } from '@/lib/types';
import { useAddToCart } from '@/services/cart.service';
import { useSession } from 'next-auth/react';
import Share from './AllSocialSharing/SocialSharing';
import CircularImageSelector from './productsubImages/CircleImage';
import { useRouter } from 'next/navigation';
import CarouselModel from './products/CarouselModel';
import { useRecommendation } from '@/hooks/useRecommendation';
import { WishlistButton } from './wishlist/WishListButton';
import UserRecommendationList from './products/recommendation/components/UserRecommend';

interface ProductDetailsProps {
  product: ProductType;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0].url);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data: session } = useSession();
  const userId = session?.user.id;
  const { toast } = useToast();
  const { addCartItem } = useAddToCart();
  const router = useRouter();
  const { recommendations, loading, error } = useRecommendation(product.id);

  const handleAddToCart = async () => {
    if (!userId) {
      toast({
        title: 'You must login first',
        description: `User not found. Please login again`,
      });
      router.push('/auth/sign-in');
      return;
    }
    addCartItem({ userId, productId: product.id, quantity });
    toast({
      title: 'Added to cart',
      description: `${quantity} ${
        product.name.length > 40 ? product.name.slice(0, 40) + '...' : product.name
      }
(s) added to your cart.`,
    });
  };

  return (
    <div>
      <div className='grid gap-8 lg:grid-cols-2 xl:gap-12'>
        {/* Product Images */}
        <div className='relative flex flex-col items-center'>
          <div className='aspect-square w-full max-w-md overflow-hidden rounded-lg bg-gray-100 md:max-w-lg'>
            <Image
              src={selectedImage || '/placeholder.svg?height=600&width=600'}
              alt={product.name}
              width={600}
              height={600}
              className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
            />
          </div>

          {/* Thumbnail Scrollable Row */}
          <div className='scrollbar-hide flex w-full items-end justify-center overflow-x-auto pt-1'>
            <CircularImageSelector setSelectedImage={setSelectedImage} images={product.images} />
          </div>
        </div>
        {/* Product Info */}
        <div className='space-y-6'>
          {/* Category + Name */}
          <div>
            <div className='mb-3 flex flex-wrap items-center gap-2'>
              <Badge variant='secondary'>{product.category}</Badge>
              <Badge variant='outline'>No brand</Badge>
            </div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900 sm:text-3xl'>{product.name}</h1>

            {/* Ratings */}
            <div className='mb-4 flex items-center gap-2'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-current text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className='text-sm text-gray-600'>({product.reviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className='mb-6 flex flex-wrap items-center gap-3'>
              <span className='text-3xl font-bold text-gray-900'>
                ${Number(product.price).toFixed(2)}
              </span>
              {product.price && (
                <>
                  <span className='text-lg text-gray-500 line-through'>
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <Badge className='bg-red-500 text-white'>
                    Save $
                    {(
                      Number(product.price) -
                      (Number(product.price) * Number(product.discount)) / 100
                    ).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <p
                className={`overflow-hidden text-sm leading-relaxed text-gray-700 transition-all duration-300 ${
                  isExpanded ? 'h-auto' : 'h-24'
                }`}
              >
                {product.description}
              </p>
              {product?.description && product?.description.length > 200 && (
                <Button
                  variant='link'
                  size='sm'
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='mt-1 p-0 text-blue-600'
                >
                  {isExpanded ? 'View Less' : 'View All'}
                </Button>
              )}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <label className='font-medium'>Quantity:</label>
              <div className='flex items-center rounded-md border'>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='px-3 py-2 hover:bg-gray-100'
                >
                  -
                </button>
                <span className='border-x px-4 py-2'>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className='px-3 py-2 hover:bg-gray-100'
                >
                  +
                </button>
              </div>
            </div>

            <div className='flex gap-1 sm:gap-4'>
              <Button
                onClick={handleAddToCart}
                className='flex w-full items-center gap-2 sm:w-fit'
                size='lg'
                disabled={!(product.stock > 0)}
              >
                <ShoppingCart className='h-5 w-5' />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              <WishlistButton productId={product.id} userId={userId} />

              <Share />
            </div>
          </div>

          {/* Shipping Info */}
          <div className='grid grid-cols-1 gap-6 border-t pt-6 sm:grid-cols-3'>
            <div className='text-center'>
              <Truck className='mx-auto mb-2 h-8 w-8 text-blue-600' />
              <div className='text-sm font-medium'>Free Shipping</div>
              <div className='text-xs text-gray-600'>On orders over $50</div>
            </div>
            <div className='text-center'>
              <Shield className='mx-auto mb-2 h-8 w-8 text-green-600' />
              <div className='text-sm font-medium'>2 Year Warranty</div>
              <div className='text-xs text-gray-600'>Full coverage</div>
            </div>
            <div className='text-center'>
              <RotateCcw className='mx-auto mb-2 h-8 w-8 text-orange-600' />
              <div className='text-sm font-medium'>30 Day Returns</div>
              <div className='text-xs text-gray-600'>No questions asked</div>
            </div>
          </div>
        </div>
      </div>

      {/* carousel */}
      {!loading ? (
        <div>
          <h2 className='text-2xl font-semibold py-4'>Similar Products</h2>
          <CarouselModel products={recommendations} loading={loading} error={error} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {/* user recommendation */}
      <UserRecommendationList userId={userId ?? ''} />
    </div>
  );
}
