import { hashPassword } from '@/lib/auth-util';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
export const dynamic = 'force-dynamic';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_PROFILE_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_USER_PROFILE_API_KEY,
  api_secret: process.env.CLOUDINARY_USER_PROFILE_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Extract form data
    const email = formData.get('email')?.toString();
    const name = formData.get('name')?.toString();
    const password = formData.get('password')?.toString();
    const otp = formData.get('otp')?.toString();
    const imageFile = formData.get('avatar') as File | null;

    // Validate required fields
    /* if (!email || !name || !password || !otp) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    } */
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
    }

    // Validate OTP
    const otpEntry = await prisma.oTP.findFirst({
      where: { email, code: otp },
    });

    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Upload image to Cloudinary if exists
    let imageUrl = null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert to base64 for Cloudinary upload
      const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: 'user-avatars',
        format: 'webp', // Convert to webp for better performance
        quality: 'auto',
      });

      imageUrl = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in transaction
    const [_, newUser] = await prisma.$transaction([
      prisma.oTP.delete({ where: { id: otpEntry.id } }),
      prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          image: imageUrl
            ? {
                create: {
                  url: imageUrl.url,
                  publicId: imageUrl.publicId,
                },
              }
            : undefined,
        },
      }),
    ]);

    return NextResponse.json(
      { user: { id: newUser.id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
