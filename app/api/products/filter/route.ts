export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define types based on your Prisma schema
interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  productId: string | null; // Matches your Prisma schema
}

interface ProductCategory {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: Prisma.Decimal;
  discount: Prisma.Decimal | null;
  stock: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImage[];
  category: ProductCategory;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Get query parameters
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice'));
    const categoryName = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const isSuggestion = searchParams.get('suggest') === 'true';
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const PAGE_SIZE = isSuggestion ? 5 : 10;
    const skip = isSuggestion ? 0 : (page - 1) * PAGE_SIZE;

    // Build the where clause with proper typing
    const where: Prisma.ProductWhereInput = {
      price: {
        gte: minPrice,
          ...(maxPrice ? { lte: maxPrice } : {}),
      },
    };

    // Add search filter if provided
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Add category filter if provided
    if (categoryName) {
      const category = await prisma.category.findFirst({
        where: {
          name: {
            equals: categoryName,
            mode: 'insensitive',
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

    // Use Prisma's generated types instead of custom interfaces
    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
      },
      take: PAGE_SIZE,
      skip,
    });

    // Then fetch total count if not a suggestion
    const total = isSuggestion ? products.length : await prisma.product.count({ where });

    // Serialize products (convert Decimal to number)
    const serializedProducts = products.map(p => ({
      ...p,
      price: p.price.toNumber(),
      discount: p.discount?.toNumber() ?? 0,
    }));

    return NextResponse.json(
      {
        data: serializedProducts,
        meta: isSuggestion
          ? null
          : {
              page,
              pageSize: PAGE_SIZE,
              total,
              totalPages: Math.ceil(total / PAGE_SIZE),
            },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error filtering products:', err);
    return NextResponse.json({ error: 'Failed to filter products' }, { status: 500 });
  }
}
