import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/app/lib/rate-limit';

export async function POST(request: Request) {
  const limited = await rateLimit(request, { windowMs: 60 * 1000, max: 5, keyPrefix: "newsletter" });
  if (limited) return limited;

  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const email = String(body.email || '').trim();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Please enter your email.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, name: email.split('@')[0] },
    });

    return NextResponse.json({ success: true, data: subscriber }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to subscribe:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}