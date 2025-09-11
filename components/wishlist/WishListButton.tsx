'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from './hooks/useWhislist';
import { useToast } from '@/hooks/use-toast';
import { debounce } from '@/lib/debounce';
import { WishlistItemType } from './Wishlist';

interface WishlistButtonProps {
  productId: string;
  userId: string | undefined;
  initialLiked?: boolean;
}

export function WishlistButton({ productId, userId, initialLiked = false }: WishlistButtonProps) {
  const { toast } = useToast();
  const { toggleWishlist, wishlist = [] } = useWishlist(userId ?? '');
  const [isLiked, setIsLiked] = useState(initialLiked);

  useEffect(() => {
    const liked = wishlist.some((item: WishlistItemType) => item.product.id === productId);
    setIsLiked(liked);
  }, [wishlist, productId]);

  const handleToggle = useCallback(
    debounce(() => {
      if (!userId) {
        toast({
          title: 'Sign in required',
          description: 'You must login first',
          variant: 'destructive',
        });
        return;
      }
      toggleWishlist(productId);
      setIsLiked(prev => !prev);
    }, 300),
    [productId, userId, toggleWishlist]
  );

  return (
    <button
      onClick={handleToggle}
      className='rounded-full bg-white/80 p-1 transition-colors hover:bg-white'
    >
      <Heart
        className={`h-5 w-5 transform cursor-pointer transition-transform duration-150 ${
          isLiked ? 'scale-110 fill-red-500 text-red-500' : 'text-gray-400'
        }`}
      />
    </button>
  );
}
