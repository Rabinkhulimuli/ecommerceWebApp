import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        user: true,
        orderItems: { include: { product: true } },
        payment: true,
        shipping: true,
      },
    });

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }

    return Response.json(order);
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PATCH - update order status
export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }
    const body = await req.json();
    const { status } = body;

    const updated = await prisma.order.update({
      where: { id: params.orderId },
      data: { status },
    });

    return Response.json(updated);
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { orderId: string } }) {
  try {
    await prisma.order.delete({
      where: { id: params.orderId },
    });

    return new Response(JSON.stringify({ message: 'Order deleted successfully' }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
