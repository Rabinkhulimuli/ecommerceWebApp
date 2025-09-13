import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user || user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorize' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const userId = searchParams.get('shopId');
    const pageSize = Number(searchParams.get('size')) || 10;
    const skip = (page - 1) * pageSize;
    if (!userId) {
      return NextResponse.json({ error: 'shop is undefined' }, { status: 404 });
    }
     const shop = await prisma.shop.findUnique({
          where: {
            ownerId: userId,
          },
        });
        if (!shop) {
          return NextResponse.json({ error: 'You must open a shop first' }, { status: 401 });
        }
    const total = await prisma.product.count({
      where: {
        shopId:shop.id,
      },
    });
    const product = await prisma.product.findMany({
      where: {
        shopId:shop.id,
      },
      select:{
        id:true,
        name:true,
        price:true,
        stock:true,
        category:true,
        discount:true
      },

      orderBy: {
        name: 'asc',
      },
      take: pageSize,
      skip,
    });
    return NextResponse.json({data:product,meta:{
      page,
      pageSize,
      total,
      totalPage:Math.ceil(total/pageSize)
    }},{status:200})
  } catch (err) {
    console.log(err)
    return NextResponse.json({error:"something went wrong"},{status:500})
  }
}
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user || user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, price, stock, categoryId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(categoryId && { categoryId }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user || user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}