import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/lib/require-admin';

export async function GET() {
  const unauthorized = await requireAdmin("director-message", "view");
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.directorMessageContent.findFirst();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin("director-message", "edit");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.directorMessageContent.findFirst();

    const data = {
      contentHtml: body.contentHtml,
      founderName: body.founderName,
      founderTitle: body.founderTitle,
      founderEmail: body.founderEmail,
      founderImage: body.founderImage,
    };

    const content = existing
      ? await prisma.directorMessageContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.directorMessageContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}