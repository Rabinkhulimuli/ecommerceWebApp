"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Truck, Package } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Address } from "@/lib/types"
import { useGetUser } from "@/services/user.service"
import FormSkeleton from "./checkout/UserForm"
import Esewa from "./esewa/Esewa"
import { useRouter } from "next/navigation"
import { useClearCart } from "@/services/cart.service"
import { useSession } from "next-auth/react"
import EsewaPayButton from "./esewa/PayButton"

interface CheckoutFormProps {
  step: "shipping" | "payment" | "review"
  onNext?: () => void
  total?:number
}

export function CheckoutForm({ step, onNext ,total}: CheckoutFormProps) {
  const { toast } = useToast()
  const router= useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const {userData,isLoading}= useGetUser()
  const{clearCartItems}= useClearCart()
  const {data:session}= useSession()
  const userId= session?.user.id

  const {handleSubmit,formState:{errors},register,setValue}= useForm<Address>({
    defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    country: "",
    street: "",
    city: "",
  }
  })
  
 /*  useEffect(()=> {
      if (userData) {
    const nameSplit = userData.name?.split(" ") ?? []
    reset({
      firstName: nameSplit[0] || "",
      lastName: nameSplit[1] || "",
      email: userData.email || "",
      phone: "",
      postalCode: userData.addresses?.[0]?.postalCode || "",
      country: userData.addresses?.[0]?.country || "",
      street: userData.addresses?.[0]?.street || "",
      city: userData.addresses?.[0]?.city || "",
    })
  }
  },[userData,reset,isLoading]) */
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

  const onSubmit:SubmitHandler<Address> = async (data) => {
   

    if (step === "review") {
      setIsProcessing(true)
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      })
      if(userId)
      clearCartItems(userId)
      setIsProcessing(false)
      // Redirect to success page
      router.push(`/order-success?price=${total}`)
    } else {
      onNext?.()
    }
  }

  if (step === "shipping") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Shipping Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading? <FormSkeleton/>: <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" required {...register("firstName")}  />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" required {...register("lastName")}/>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required {...register("email")} />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
            </div>

            <div className="grid grid-cols-3 gap-4 text-capitalize">
              <div>
                <Label htmlFor="city">City</Label>
                <Input className="text-capitalize"  id="city" required {...register("city")} />
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
              <Input id="phone" type="tel" />
            </div>

            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </form>}
        </CardContent>
      </Card>
    )
  }

  if (step === "payment") {
    // return <EsewaPayButton
    // totalAmount={total??0}
    
    // />
    return <Esewa total_amount={total??0}/> 
   /*  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <RadioGroup defaultValue="card">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
            </RadioGroup>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" required />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" required />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="billing" />
              <Label htmlFor="billing" className="text-sm">
                Billing address same as shipping address
              </Label>
            </div>

            <Button type="submit" className="w-full">
              Review Order
            </Button>
          </form>
        </CardContent>
      </Card>
    ) */
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
              <p>{userData?.name||"John Doe"} </p>
              <p>{userData?.addresses[0].street||"123 Main"} Street</p>
              <p>{userData?.addresses[0].city||"New York"}, {userData?.addresses[0].street||""} {userData?.addresses[0].postalCode||""}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="text-sm text-gray-600">
              <p> e-sewa</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Delivery Options</h3>
            <RadioGroup defaultValue="standard">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard Delivery (5-7 days)</Label>
                </div>
                <span className="text-sm">Free</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express">Express Delivery (2-3 days)</Label>
                </div>
                <span className="text-sm">$9.99</span>
              </div>
            </RadioGroup>
            <div className="flex justify-between mt-4">
              <span className="text-sm">Total:</span>
              <span className="font-semibold text-lg">{total} </span>
            </div>
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
