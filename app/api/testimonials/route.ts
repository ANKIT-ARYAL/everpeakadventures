import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("testimonials", "view");
  if (unauthorized) return unauthorized;

  try {
    const reviews = await prisma.clientReview.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("testimonials", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const newReview = await prisma.clientReview.create({
      data: {
        quote: body.quote || '',
        name: body.name || '',
        location: body.location || '',
        avatar: body.avatar || '',
        order: Number(body.order) || 0,
      }
    });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
