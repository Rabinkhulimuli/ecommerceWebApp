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
    const shopId = searchParams.get('shopId');
    const pageSize = Number(searchParams.get('size')) || 10;
    const skip = (page - 1) * pageSize;
    if (!shopId) {
      return NextResponse.json({ error: 'shop is undefined' }, { status: 404 });
    }
    const total = await prisma.product.count({
      where: {
        shopId,
      },
    });
    const product = await prisma.product.findMany({
      where: {
        shopId,
      },
      orderBy: {
        name: 'asc',
      },
      take: pageSize,
      skip,
    });
  } catch (err) {}
}
