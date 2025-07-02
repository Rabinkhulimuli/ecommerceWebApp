"use client"

import { useContext } from "react"
import { CartContext } from "@/components/cart-provider"

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return {
    items: context.state.items,
    total: context.state.total,
    addItem: context.addItem,
    removeItem: context.removeItem,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
  }
}
