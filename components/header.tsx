"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VscLoading } from "react-icons/vsc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminComponent from "./admin/AdminComponent";
import {useSession,signOut} from "next-auth/react"
import Image from "next/image";
import { sessionUsertype } from "@/lib/types";
import { useGetCartItems } from "@/services/cart.service";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {data,status}= useSession()
  const[user,setUser]= useState<sessionUsertype>(null)
  
  const{cartItems,isLoading}= useGetCartItems(user?.id??"")
  useEffect(()=> {
      const user= data?.user
    if(!user) return
    setUser(user)
  },[data])

const handleMenuOpen=()=> {
  setIsMenuOpen(!isMenuOpen)
}
const itemCounts= useCallback(()=> {
  if(cartItems){
     const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return itemCount
  }
   return null
},[cartItems])
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600" />
              <span className="text-xl font-bold text-gray-900">
                XCLUSIVE
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            {user?.role==="ADMIN"&& <AdminComponent/>}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCounts()!==null && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {itemCounts()}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              status!="loading"?
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className=" relative rounded-full w-10 h-10">
                    {user.image?<Image src={user.image} className=" rounded-full object-cover  object-top" alt="profile image" sizes="25px" fill />:
                    <User className="h-5 w-5" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=> signOut({callbackUrl:"/auth/sign-in"})}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>: <div className="animate-spin ease-in-out"> <VscLoading/></div>
            ) : (
              <Link href="/auth/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {user?.role==="ADMIN"&&<AdminComponent/>}
              <Link
                href="/products"
                onClick={handleMenuOpen}
                className="text-gray-700 hover:text-blue-600"
              >
                Products
              </Link>
              <Link
                href="/categories"
                onClick={handleMenuOpen}
                className="text-gray-700 hover:text-blue-600"
              >
                Categories
              </Link>
              <Link onClick={handleMenuOpen} href="/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link
                href="/contact"
                onClick={handleMenuOpen}
                className="text-gray-700 hover:text-blue-600"
              >
                Contact
              </Link>
             
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
