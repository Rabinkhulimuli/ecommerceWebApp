export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    // Get query parameters
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 5000;
    const categoryName = searchParams.get("category");
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    // Build the where clause
    const where:  { price: { gte: number; lte: number }; categoryId?: string }  = {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    // Add category filter if provided
    if (categoryName) {
      const category = await prisma.category.findFirst({
        where: {
          name: {
            equals: categoryName,
            mode: "insensitive", // case-insensitive search
          },
        },
      });

      if (category) {
        where.categoryId = category.id;
      } else {
        // Return empty result if category doesn't exist
        return NextResponse.json(
          {
            data: [],
            meta: {
              page,
              pageSize: PAGE_SIZE,
              total: 0,
              totalPages: 0,
            },
          },
          { status: 200 }
        );
      }
    }

    // Fetch products and total count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          category: true,
        },
        take: PAGE_SIZE,
        skip,
      }),
      prisma.product.count({ where }),
    ]);
  const serializedProducts = products.map((p) => ({
      ...p,
      price: p.price.toNumber(),
      discount: p.discount?.toNumber() ?? 0,
    }))
    return NextResponse.json(
      {
        data: serializedProducts,
        meta: {
          page,
          pageSize: PAGE_SIZE,
          total,
          totalPages: Math.ceil(total / PAGE_SIZE),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error filtering products:", err);
    return NextResponse.json(
      { error: "Failed to filter products" },
      { status: 500 }
    );
  }
}
