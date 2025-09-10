"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "./hooks/useWhislist";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "@/lib/debounce";
import { WishlistItemType } from "./Wishlist";

interface WishlistButtonProps {
  productId: string;
  userId: string | undefined;
  initialLiked?: boolean;
}

export function WishlistButton({ productId, userId, initialLiked = false }: WishlistButtonProps) {
  const { toast } = useToast();
  const { toggleWishlist, wishlist = [] } = useWishlist(userId ?? "");
  const [isLiked, setIsLiked] = useState(initialLiked);

  useEffect(() => {
    const liked = wishlist.some((item:WishlistItemType) => item.product.id === productId);
    setIsLiked(liked);
  }, [wishlist, productId]);

  const handleToggle = useCallback(
    debounce(() => {
      if (!userId) {
        toast({
          title: "Sign in required",
          description: "You must login first",
          variant: "destructive",
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
      className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
    >
      <Heart
  className={`h-5 w-5 cursor-pointer transition-transform duration-150 transform ${
    isLiked ? "text-red-500 fill-red-500 scale-110" : "text-gray-400"
  }`}
/>
    </button>
  );
}
