import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { address } = body; // expect { street, city, country, postalCode }

    if (!address || !address.city || !address.country || !address.postalCode) {
      return NextResponse.json(
        { error: 'Address must include city, country, and postalCode' },
        { status: 400 }
      );
    }

    // Get existing addresses
    const existingAddresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isPrimary: 'desc' },
    });

    if (existingAddresses.length === 0) {
      const newAddress = await prisma.address.create({
        data: {
          ...address,
          userId,
          isPrimary: true,
        },
      });
      return NextResponse.json({ success: true, address: newAddress });
    }

    if (existingAddresses.length === 1) {
      // Only primary exists, create secondary
      const newAddress = await prisma.address.create({
        data: {
          ...address,
          userId,
          isPrimary: false,
        },
      });
      return NextResponse.json({ success: true, address: newAddress });
    }

    if (existingAddresses.length >= 2) {
      // Update secondary address (keep primary intact)
      const secondaryAddress = existingAddresses.find(addr => !addr.isPrimary);
      const updatedAddress = await prisma.address.update({
        where: { id: secondaryAddress!.id },
        data: {
          street: address.street,
          city: address.city,
          country: address.country,
          postalCode: address.postalCode,
        },
      });
      return NextResponse.json({ success: true, address: updatedAddress });
    }

    // Fallback
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}
