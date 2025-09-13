import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { error } from 'console';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const PageSize = 10;
    const skip = (page - 1) * PageSize;
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const total = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
      take: PageSize,
      skip,
    });

    return NextResponse.json(
      {
        data: users,
        meta: {
          page,
          pageSize: PageSize,
          total,
          totalPages: Math.ceil(total / PageSize),
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
