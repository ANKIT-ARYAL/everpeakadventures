import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/lib/require-admin';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.responsibleTravelContent.findFirst();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.responsibleTravelContent.findFirst();

    const data = {
      title: body.title,
      subtitle: body.subtitle,
      contentHtml: body.contentHtml,
    };

    const content = existing
      ? await prisma.responsibleTravelContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.responsibleTravelContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}