import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { userId } = params;
    const body = await req.json();
    const validRoles: Array<'USER' | 'ADMIN'> = ['USER', 'ADMIN'];
    const { role } = body as { role: string };

    // Validate role
    if (!validRoles.includes(role as 'USER' | 'ADMIN') || role === 'SUPERADMIN') {
      return new Response(JSON.stringify({ error: 'Invalid role' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as Role },
      select: { id: true, name: true, email: true, role: true },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
