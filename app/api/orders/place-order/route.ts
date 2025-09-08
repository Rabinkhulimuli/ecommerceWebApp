import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse incoming body
    const body = await req.json();
    const { items, shippingId } = body;

    if (!items ) {
      return new Response(
        JSON.stringify({ error: "No order items provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if( !Array.isArray(items) || items.length === 0){
         return new Response(
        JSON.stringify({ error: "order items is not a array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
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
        shippingId:shippingId||null,
        orderItems: {
          create: items.map((item: any) => ({
            
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: { product: { include: { images: true } } },
        },
        shipping: true,
      },
    });

    return new Response(JSON.stringify(order), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create order" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
