import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
  /*   const session = await getServerSession(authOptions);
    if (session?.user.id) {
      return NextResponse.json({ error: "Unauthorize" }, { status: 401 });
    } */
    const { userId,productId, quantity } = await request.json();
    if (!userId||!productId) {
      return NextResponse.json(
        { error: "Invalid product data " },
        { status: 400 }
      );
    }
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      return NextResponse.json(
        { error: "product not found " },
        { status: 404 }
      );
    }
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: existing.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }
    return NextResponse.json({ message: "Added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
