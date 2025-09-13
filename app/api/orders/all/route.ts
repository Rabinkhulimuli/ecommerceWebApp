import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const session = await getServerSession(authOptions);
    const userRole = session?.user.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }
    const total = await prisma.order.count();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        shipping: true,
        payment: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      take: pageSize,
      skip,
    });

    return NextResponse.json(
      {
        data: orders,
        meta: {
          page,
          pageSize,
          total,
          TotalPages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
