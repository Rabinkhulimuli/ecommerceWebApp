"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { useAddToCart } from "@/services/cart.service";
import { useSession } from "next-auth/react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const{addItem}= useCart()
  const { toast } = useToast();
  const {data:session}= useSession()
  const userId= session?.user.id
  const {addCartItem,isLoading,error}= useAddToCart()
  const handleAddToCart = () => {
    if(!userId) {
      toast({
        title:"Error",
        description:"You must login first",
        variant:"destructive"
      })
      return
    }
    addItem(product)
    addCartItem({userId:userId,productId:product.id})
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group product-card-hover overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={
              product?.images?.[0]?.url ?? "/placeholder.svg?height=300&width=300"
            }
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            -{product.discount}%
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {
              <span className="text-sm text-gray-500 line-through">
                original price
              </span>
            }
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {"★".repeat(Math.floor(product.rating || 5))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviews || 0})
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full group"
          disabled={product.stock < 1}
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover:animate-bounce" />
          {product.stock > 0 ? isLoading?"Adding...": "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
