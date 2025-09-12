'use server'
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]/route';
export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function submitContact(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get('name') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const subject = (formData.get('subject') || '').toString().trim();
  const message = (formData.get('message') || '').toString().trim();
  const company = (formData.get('company') || '').toString().trim(); // honeypot
  const session= await getServerSession(authOptions)
  const userId = session?.user.id
  if (!userId) {
    return {
      ok: false,
      message: 'You must login first',
    };
  }
  const errors: Record<string, string> = {};

  if (company) {
    return {
      ok: false,
      message: 'Blocked as spam. If this is a mistake, please email us directly.',
    };
  }

  if (!name) errors['name'] = 'Please enter your name.';
  if (!email) {
    errors['email'] = 'Please enter your email.';
  } else {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) errors['email'] = 'Please enter a valid email.';
  }
  if (!subject) errors['subject'] = 'Please enter a subject.';
  if (!message || message.length < 10) {
    errors['message'] = 'Please enter at least 10 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: 'Please fix the errors below and try again.',
      errors,
    };
  }

  await prisma.feedback.create({
    data: {
      name,
      email,
      subject,
      message,
      userId,
    },
  });

  console.log('New contact submission -> sending to khulimulirabin@gmail.com', {
    name,
    from: email,
    subject,
    message,
  });

  return {
    ok: true,
    message:
      "Thanks for reaching out! We've received your message and will get back to you within 1–2 business days.",
  };
}
