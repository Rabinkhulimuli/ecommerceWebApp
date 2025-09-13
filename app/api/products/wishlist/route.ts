import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Add to wishlist
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }

    const wishlistItem = await prisma.wishList.upsert({
      where: {
        userId_productId: { userId, productId }, // unique constraint
      },
      update: {},
      create: { userId, productId },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// Get wishlist for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const PageSize = 10;
  const skip = (page - 1) * PageSize;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  const total = await prisma.wishList.count({
    where: {
      userId,
    },
  });
  const wishlist = await prisma.wishList.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          images: true,
        },
      },
    }, // fetch product details
    take: PageSize,
    skip,
  });

  return NextResponse.json({
    data: wishlist,
    meta: {
      page,
      pageSize: PageSize,
      total,
      TotalPages: Math.ceil(total / PageSize),
    },
  });
}

// Remove from wishlist
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }

    await prisma.wishList.delete({
      where: { userId_productId: { userId, productId } },
    });

    return NextResponse.json({ message: 'Removed from wishlist' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
