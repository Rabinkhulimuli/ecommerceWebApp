"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import type { CartItemResponsetype, Product } from "@/lib/types";
import { useEffect, useState } from "react";
import { useRemoveFromCart, useUpdateCart } from "@/services/cart.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function CartItem({ item }: { item: CartItemResponsetype[0] }) {
  const [count, setCount] = useState(1);
  const [countChanged, setCountChanged] = useState(false);
  const { updateCartItem, isLoading, error } = useUpdateCart();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router= useRouter()
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
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div onClick={()=> router.push(`/products/${item.product.id}`)} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={
                item.product.images[0].url ||
                "/placeholder.svg?height=80&width=80"
              }
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>

          <div onClick={()=> router.push(`/products/${item.product.id}`)} className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate max-w-xs">
              {item.product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.product?.description}
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ${Number(item.product.price).toFixed(2)}
            </p>
          </div>

          <div className="flex  w-full justify-between sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 ">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                disabled={count < 2}
                className=""
                onClick={() => {
                  setCount((prev) => prev - 1);
                  setCountChanged(true);
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-5 text-center">
                {count > 9 ? count : `0${count}`}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setCount((prev) => prev + 1);
                  setCountChanged(true);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right flex items-center">
              <p className="font-bold text-lg">
                ${(Number(item.product.price) * count).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 "
              >
                <Trash2 className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:block">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
