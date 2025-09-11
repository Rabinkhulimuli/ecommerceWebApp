import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 8;
  const productsPerCategory = Number(searchParams.get('products')) || 4;

  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          take: productsPerCategory,
          include: {
            images: true,
            category: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      where: {
        products: {
          some: {},
        },
      },
      take: limit,
    });

    const result = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      products: cat.products,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
