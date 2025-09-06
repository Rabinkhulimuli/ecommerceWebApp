import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {QueryClient, QueryClientProvider}  from "@tanstack/react-query"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { Providers } from "./provider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ModernStore - Premium E-commerce Experience",
  description: "Discover premium products with seamless shopping experience",
    generator: 'v0.dev'
}
const queryClient=new QueryClient()
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
           <Providers>
            <div className=" max-h-screen min-h-screen">
              <Header />
              <main className="px-4 py-4 md:px-10 md:py-6">{children}</main>
              <Footer />
            </div>
            <Toaster />
             </Providers>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
