import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const PageSize = 10;
    const skip = (page - 1) * PageSize;
    if (!userId) {
      return NextResponse.json({ error: 'user or product not found' }, { status: 400 });
    }
    const total = await prisma.cartItem.count({
      where: {
        userId,
      },
    });
    const cartItem = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            images: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: PageSize,
      skip,
    });
    if (!cartItem) {
      return NextResponse.json({ error: 'cart item is empty' });
    }
    // Transform data to include image URLs
    const responseData = cartItem.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        discount: 0,
        images: item.product.images.map(image => ({
          id: image.id,
          url: image.url, // Assuming your Image model has a 'url' field
          thumbnailUrl: image.url?.replace('/upload/', '/upload/w_200,h_200,c_fill/'),
          altText: `${item.product.name} image`,
        })),
        category: item.product.category.name,
      },
    }));

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        meta: {
          page,
          pageSize: PageSize,
          total,
          TotalPages: Math.ceil(total / PageSize),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'error getting cart items' }, { status: 400 });
  }
}
