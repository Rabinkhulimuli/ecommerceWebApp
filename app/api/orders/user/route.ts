import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const total = await prisma.order.count({
      where: {
        userId: session.user.id,
      },
    });
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderItems: { include: { product: { include: { images: true } } } },
        payment: true,
        shipping: true,
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip,
    });

    return NextResponse.json({
      data: orders,
      meta: {
        page,
        pageSize,
        total,
        TotalPage: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
