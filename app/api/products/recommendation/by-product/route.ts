import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const productId = searchParams.get('id');
    const PAGE = Math.max(Number(searchParams.get('page')) || 1, 1);
    const PAGE_SIZE = 5;
    const skip = (PAGE - 1) * PAGE_SIZE;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is missing or invalid' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const [recommendedProduct, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        include: {
          images: true,
        },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
        },
      }),
    ]);
    const serializedProducts = recommendedProduct.map(p => ({
      ...p,
      price: p.price.toNumber(),
      discount: p.discount?.toNumber() ?? 0,
    }));
    return NextResponse.json(
      {
        data: serializedProducts,
        meta: {
          page: PAGE,
          pageSize: PAGE_SIZE,
          totalPages: Math.ceil(totalCount / PAGE_SIZE),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Recommendation API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
