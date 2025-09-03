import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "user id not found" }, { status: 400 });
    }

    // Delete all cart items of that user
    const deleted = await prisma.cartItem.deleteMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(
      { message: "All cart items deleted", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
