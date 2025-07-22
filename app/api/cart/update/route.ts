import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateCartSchema = z.object({
  userId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().min(1),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const parsed = updateCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, productId, quantity } = parsed.data;

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json(
      { message: "Cart updated successfully", data: updatedCartItem },
      { status: 200 }
    );
  } catch (err) {
    console.error("Cart update error:", err);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}
