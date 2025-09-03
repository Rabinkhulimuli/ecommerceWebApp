"use client"

import { useState } from "react"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Truck, CreditCard } from "lucide-react"
import { useGetCartItems } from "@/services/cart.service"
import { useSession } from "next-auth/react"
import CheckoutSkeleton from "./CheckoutSkeleton"

export default function CheckoutPage() {

  const {data:session}= useSession()
  const userId= session?.user.id
  const{cartItems:items,isLoading}= useGetCartItems(userId||"")
  const [currentStep, setCurrentStep] = useState("shipping")
  if(isLoading){
    return <CheckoutSkeleton/>
  }

  if (!items||items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No items in cart</h1>
        <p className="text-gray-600">Add some items to your cart before checking out</p>
      </div>
    )
  }
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={currentStep} onValueChange={setCurrentStep}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shipping" className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Shipping</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Payment</span>
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Review</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="mt-6">
              <CheckoutForm step="shipping" onNext={() => setCurrentStep("payment")} />
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <CheckoutForm total={total} step="payment" onNext={() => setCurrentStep("review")} />
            </TabsContent>

            <TabsContent value="review" className="mt-6">
              <CheckoutForm step="review" total={total} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary items={items} total={total} />
        </div>
      </div>
    </div>
  )
}
