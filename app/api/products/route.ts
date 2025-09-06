import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
    })

    // Convert Decimal values
    const serializedProducts = products.map((p) => ({
      ...p,
      price: p.price.toNumber(),
      discount: p.discount?.toNumber() ?? 0,
    }))

    return NextResponse.json(serializedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
