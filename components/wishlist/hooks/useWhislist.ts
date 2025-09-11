'use client';

import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useWishlist = (userId: string) => {
  const { toast } = useToast();
  if (!userId) {
    toast({
      title: 'Required Sign in',
      description: 'You must login first',
      variant: 'destructive',
    });
    return {
      wishlist: [],
      isLoading: false,
      toggleWishlist: () => {},
      removeFromWishlist: () => {},
    };
  }
  const queryClient = useQueryClient();
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      const res = await fetch(`/api/products/wishlist?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      return res.json();
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch('/api/products/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      if (!res.ok) throw new Error('Failed to add to wishlist');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product WishListed',
        description: 'Product WishListed Successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch('/api/products/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      if (!res.ok) throw new Error('Failed to remove from wishlist');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product removed',
        description: 'Product removed successfully',
        variant: 'destructive',
      });
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    },
  });

  const toggleWishlist = async (productId: string) => {
    const alreadyInWishlist = wishlist?.some((w: any) => w.productId === productId);
    if (alreadyInWishlist) {
      return removeMutation.mutate(productId);
    } else {
      return addMutation.mutate(productId);
    }
  };

  return {
    wishlist,
    isLoading,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    toggleWishlist,
  };
};
