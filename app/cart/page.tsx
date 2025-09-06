"use client"
import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useClearCart, useGetCartItems } from "@/services/cart.service"
import { useSession } from "next-auth/react"
import { CartItemResponsetype } from "@/lib/types"
import { useEffect, useState } from "react"

export default function CartPage() {
  const{clearCartItems,isLoading:deleteLoading}= useClearCart()
  const [items,setItems]= useState<CartItemResponsetype>()
  const {data:session}= useSession()
  const userId= session?.user.id
  const {cartItems,isLoading}=useGetCartItems(userId||"")
  useEffect(()=> {
    if(!userId) return 
    if(!cartItems) return 
    setItems(cartItems)
  },[cartItems])
 if(isLoading) return <div>loading...</div>
  
  if (!items||items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    )
  }
const calculatedTotal= items.reduce((acc,item)=> acc+item.product.price *item.quantity,0)
const handleClearCart=()=> {
      if(userId)
        clearCartItems(userId)
      }
  return (
    <div className="container mx-auto sm:px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={handleClearCart}>
              Clear Cart
            </Button>
            <Link href="/products">
              <Button variant="ghost">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculatedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(calculatedTotal * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(calculatedTotal * 1.08).toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
