import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import nodemailer from 'nodemailer';
import OrderConfirmationEmail from '@/components/order/email/orderConformation';
import { render } from '@react-email/components';
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { items, shippingId, paymentMethod, transactionId } = body;
    if (!shippingId) {
      return new Response(JSON.stringify({ error: 'No order address provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!items) {
      return new Response(JSON.stringify({ error: 'No order items provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'order items is not a array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate total price
    const totalPrice = items.reduce(
      (acc: number, item: any) => acc + Number(item.product.price) * Number(item.quantity),
      0
    );

    // Create order and order items in a transaction

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalPrice,
        shippingId: shippingId,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
        payment: {
          create: {
            method: paymentMethod || 'CASH_ON_DELIVERY',
            transactionId: transactionId || null,
            status: 'PENDING',
          },
        },
      },

      include: {
        orderItems: {
          include: { product: { include: { images: true } } },
        },
        shipping: true,
        payment: true,
      },
    });

    //send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    if (!session.user.email) {
      return new Response(JSON.stringify({ error: 'email required' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const emailHtml = await render(
      OrderConfirmationEmail({
        orderId: order.id,
        customerName: session.user.name || '',
        total: Number(order.totalPrice),
        items: order.orderItems.map(i => ({
          name: i.product.name,
          quantity: i.quantity,
          price: Number(i.price),
          image: i.product.images[0]?.url || undefined,
        })),
      })
    );
    await transporter.sendMail({
      from: `"PRIVE" <khulimulirabin@gmail.com>`,
      to: session.user.email,
      subject: `Order Confirmation #${order.id}`,
      html: emailHtml,
    });
    return new Response(JSON.stringify(order), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
