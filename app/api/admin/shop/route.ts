import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('userId');
    if (!shopId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const shop = await prisma.shop.findUnique({
      where: {
        ownerId: shopId,
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json({ data: shop }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to get shop' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const { name, ownerId, street, city, country, postalCode } = body;
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorize' }, { status: 401 });
    }
    if (user?.id !== ownerId) {
      return NextResponse.json({ error: 'field mismatch' }, { status: 400 });
    }
    if (!name || !ownerId || !city || !country || !postalCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const shop = await prisma.shop.create({
      data: {
        name: name,
        ownerId,
        address: {
          create: {
            userId: ownerId,
            street,
            city,
            country,
            postalCode,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(shop, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create shop' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, street, city, country, postalCode, id } = body;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorize' }, { status: 401 });
    }
    if (!name || !city || !country || !postalCode || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const shop = await prisma.shop.update({
      where: { id },
      data: {
        name: name,
        address: {
          update: {
            street,
            city,
            country,
            postalCode,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(shop, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update shop' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('userId');
    if (!shopId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (user?.role !== 'ADMIN' || user.id !== shopId) {
      return NextResponse.json({ error: 'Unauthorize' }, { status: 401 });
    }

    await prisma.shop.delete({
      where: {
        ownerId: shopId,
      },
    });
    return NextResponse.json({ message: 'successfully deleted shop' }, { status: 200 });
  } catch (err) {
    console.log(err);

    return NextResponse.json({ error: 'Failed to delete shop' }, { status: 500 });
  }
}
