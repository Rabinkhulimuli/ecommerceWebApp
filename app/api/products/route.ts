import { NextResponse } from "next/server"
import { getProducts } from "@/lib/products"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include:{
        images:true,
        category:true
      }
    })
    console.log("products",products)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
