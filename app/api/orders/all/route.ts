import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }
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
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
