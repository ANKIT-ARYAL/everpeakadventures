import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("faqs", "view");
  if (unauthorized) return unauthorized;

  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("faqs", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    // Check if bulk creation
    const items = Array.isArray(body) ? body : (Array.isArray(body.items) ? body.items : null);

    if (items && items.length > 0) {
      const createdFaqs = await prisma.$transaction(
        items.map((item: any) =>
          prisma.fAQ.create({
            data: {
              question: item.question,
              answer: item.answer,
              order: Number(item.order) || 0,
              relatedType: item.relatedType || null,
              relatedSlug: item.relatedSlug || null,
            },
          })
        )
      );
      return NextResponse.json({ success: true, count: createdFaqs.length, data: createdFaqs }, { status: 201 });
    }

    // Single creation
    const newFaq = await prisma.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        order: Number(body.order) || 0,
        relatedType: body.relatedType || null,
        relatedSlug: body.relatedSlug || null,
      }
    });

    return NextResponse.json({ success: true, data: newFaq }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
