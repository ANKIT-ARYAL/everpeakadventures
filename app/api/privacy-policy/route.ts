import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/lib/require-admin';

export async function GET() {
  const unauthorized = await requireAdmin("privacy-policy", "view");
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.privacyPolicyContent.findFirst();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin("privacy-policy", "edit");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.privacyPolicyContent.findFirst();

    const data = {
      title: body.title,
      subtitle: body.subtitle,
      contentHtml: body.contentHtml,
    };

    const content = existing
      ? await prisma.privacyPolicyContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.privacyPolicyContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}