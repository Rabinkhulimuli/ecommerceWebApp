import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchparmas = url.searchParams;
    const productId = searchparmas.get("id");
    const PAGE = Math.max(Number(searchparmas.get("page")) || 1, 1);
    const PAGE_SIZE = 5;
    const skip = (PAGE - 1) * PAGE_SIZE;
    if (!productId) {
      NextResponse.json(
        { error: "product is  not a valid product" },
        { status: 404 }
      );
      return;
    }
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    const recommendedProduct = await prisma.product.findMany({
      where: {
        categoryId: product?.categoryId,
        id: {
          not: product?.id,
        },
      },
      take: PAGE_SIZE,
      skip,
    });
    NextResponse.json(
      {
        data: recommendedProduct,
        meta: {
          page: PAGE,
          pageSize: PAGE_SIZE,
          totalPages: Math.ceil(recommendedProduct.length / PAGE_SIZE),
        },
      },
      { status: 200 }
    );
    return;
  } catch (err) {
    NextResponse.json({ error: "error getting product" }, { status: 404 });
    return;
  }
}
