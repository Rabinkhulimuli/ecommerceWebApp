"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Truck, Package } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Address, CartItemResponsetype } from "@/lib/types"
import { useGetUser } from "@/services/user.service"
import FormSkeleton from "./UserForm"
import Esewa from "../esewa/Esewa"
import { useRouter } from "next/navigation"
import { useClearCart } from "@/services/cart.service"
import { useSession } from "next-auth/react"

interface CheckoutFormProps {
  step: "shipping" | "payment" | "review"
  onNext?: () => void
  total?: number
  cartItems?:CartItemResponsetype
}

export function CheckoutForm({ step, onNext, total ,cartItems}: CheckoutFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const { userData, isLoading } = useGetUser()
  const { clearCartItems } = useClearCart()
  const { data: session } = useSession()
  const userId = session?.user.id

  const { handleSubmit, register, setValue } = useForm<Address>({
    defaultValues: {
      firstName:session?.user.name|| "",
      lastName: "",
      email:session?.user.email|| "",
      phone: "",
      postalCode: "",
      country: "",
      street: "",
      city: "",
    },
  })

  useEffect(() => {
    if (userData) {
      const nameSplit = userData.name?.split(" ") ?? []
      setValue("firstName", nameSplit[0] || "")
      setValue("lastName", nameSplit[1] || "")
      setValue("email", userData.email || "")
      setValue("postalCode", userData.addresses?.[0]?.postalCode || "")
      setValue("country", userData.addresses?.[0]?.country || "")
      setValue("street", userData.addresses?.[0]?.street || "")
      setValue("city", userData.addresses?.[0]?.city || "")
    }
  }, [userData, setValue])

  const onSubmit: SubmitHandler<Address> = async () => {
    if (step === "review") {
      setIsProcessing(true)
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      try{
        
      const data= await fetch("/api/orders/place-order",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            items:cartItems
        })
      })
      if(data.ok){

        toast({
          title: "Order placed successfully!",
          description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
        })
  
        if (userId) clearCartItems(userId)
        setIsProcessing(false)
        router.push(`/order-success?price=${total}`)
      }else{
          toast({
          title: "Order failed place",
          description: "Please try again after 5 minutes.",
          variant:"destructive"
        })
         setIsProcessing(false)
      }
      }catch(err){
        console.log(err)
         toast({
          title: "Order failed place",
          description: "Please try again after 5 minutes.",
          variant:"destructive"
        })
        setIsProcessing(false)
      }
    } else {
      onNext?.()
    }
  }

  if (step === "shipping") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5 hidden sm:block" />
            <span className="text-nowrap tracking-tight ">Shipping Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required {...register("firstName")} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required {...register("lastName")} />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required {...register("email")} />
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-capitalize">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required {...register("city")} />
                </div>
                <div>
                  <Label htmlFor="street">Street</Label>
                  <Input id="street" required {...register("street")} />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" required {...register("postalCode")} />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" {...register("phone")} />
              </div>

              <Button type="submit" className="w-full">
                Continue to Payment
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    )
  }

  if (step === "payment") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Replace with your Esewa integration */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Esewa total_amount={total ?? 0} />
            <Button type="submit" className="w-full mt-4">
              Review Order
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Review Your Order</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-600 capitalize">
              <p>{userData?.name || "John Doe"}</p>
              <p>{userData?.addresses[0]?.street || "123 Main"} Street</p>
              <p>
                {userData?.addresses[0]?.city || "New York"},{" "}
                {userData?.addresses[0]?.postalCode || "00000"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <p className="text-sm text-gray-600">eSewa</p>
          </div>

          <div className="flex justify-between mt-4">
            <span className="text-sm">Total:</span>
            <span className="font-semibold text-lg">{total}</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
