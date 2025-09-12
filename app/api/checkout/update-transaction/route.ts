import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function UPDATE(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, orderId } = body;
    await prisma.payment.update({
      where: { orderId: orderId },
      data: {
        transactionId: transactionId,
        status: 'COMPLETED',
      },
    });
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ status: false, message: err }, { status: 500 });
  }
}
