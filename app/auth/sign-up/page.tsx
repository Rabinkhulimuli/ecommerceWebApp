"use client"

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Upload, User } from "lucide-react"
import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import OTPVerificationPage from "@/components/otp/OtpDashboard"
import { useRouter } from "next/navigation"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  otp:z.string().optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  avatar: z.instanceof(File, { message: "Profile image is required" })
    .refine(file => file.size <= MAX_FILE_SIZE, "Max image size is 5MB")
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png and .webp formats are supported")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setloading] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showOtpDashboard,setShowOtpDashboard]= useState(false)
  
  const [pendingUserData, setPendingUserData] = useState<FormData | null>(null);

  const { toast } = useToast()
  const router= useRouter()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: new File([], ""),
  
    }
  })

  useEffect(()=> {
    console.log("form error ",form.formState.errors)
  },[form.formState.errors])
  const onSubmit = async (data: SignUpFormValues) => {
    console.log("form submitting")
    try {
      setloading(true)
      const formData= new FormData()
      formData.append("email",data.email)
    
      const userDataRers= await fetch("http://localhost:3000/api/send-otp",{
        method:"POST",
        body:formData
      })
      if(!userDataRers.ok){
        const errorData= await userDataRers.json()
        console.log(errorData)
      }
      if(userDataRers.ok){
      formData.append("name",data.name)
      formData.append("password",data.password)
      formData.append("avatar",data.avatar)
      setPendingUserData(formData)
        setShowOtpDashboard(true)
      }
      
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      })
    }
    finally{
      setloading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("avatar", file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  console.log(showOtpDashboard)
  return (
    <>
    {!showOtpDashboard? 
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Get started with our service
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4"
              >
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <div className="relative">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Profile preview"
                        width={96}
                        height={96}
                        className="rounded-full w-24 h-24 object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="rounded-full w-24 h-24 bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Profile Picture
                  </Button>
                  {form.formState.errors.avatar && (
                    <p className="text-xs font-medium text-destructive">
                      {form.formState.errors.avatar.message}
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="focus-visible:ring-2 focus-visible:ring-offset-2"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="focus-visible:ring-2 focus-visible:ring-offset-2"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...field}
                            className="focus-visible:ring-2 focus-visible:ring-offset-2"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            className="focus-visible:ring-2 focus-visible:ring-offset-2"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-2"
                  
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ||loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    :
    <OTPVerificationPage data={pendingUserData}/>}
    </>
    
  )
}