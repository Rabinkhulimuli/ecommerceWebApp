import nodemailer from 'nodemailer';
import { generateOTP } from './otp';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  if (!email) {
    return NextResponse.json({ error: 'email not found' }, { status: 400 });
  }
  const userExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (userExist) {
    return NextResponse.json(
      { message: `user with the ${email} already existed` },
      { status: 200 }
    );
  }
  const otp = generateOTP();

  await prisma.oTP.create({
    data: {
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 100 * 60 * 1000),
    },
  });
  //configure transporter

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: `<p>Your OTP is <strong>${otp}</strong>.It expires in 5 minutes.</p>`,
  });
  return NextResponse.json({ message: 'OTP sent' });
}
