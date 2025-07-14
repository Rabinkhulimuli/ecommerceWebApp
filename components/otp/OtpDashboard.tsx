"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type OTPVerificationPageProps = {
  data: FormData | null
}

export default function OTPVerificationPage({ data }: OTPVerificationPageProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!data) throw new Error("Form data is missing")

      const otpCode = otp.join("") // no spaces
      if (otpCode.length !== 6) throw new Error("Please enter a 6-digit OTP code")

      data.append("otp", otpCode)

      const response = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST",
        body: data, 
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "OTP verification failed")
      }

      toast({
        title: "Success!",
        description: "Your account has been verified.",
      })

      router.push("/")

    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Verify Your Email
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit code to {email}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((value, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-12 h-14 text-2xl text-center font-semibold focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </Button>

              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      toast({
                        title: "Code Resent",
                        description: "A new verification code has been sent.",
                      })
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link
                href="/auth/sign-in"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Return to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
