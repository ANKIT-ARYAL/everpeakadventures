import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("video-banners", "view");
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.ctaBannerContent.findFirst();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin("video-banners", "edit");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.ctaBannerContent.findFirst();

    const data = {
      title: body.title,
      subtitle: body.subtitle,
      bgImage: body.bgImage,
      primaryLink: body.primaryLink,
      secondaryLink: body.secondaryLink,
    };

    const content = existing
      ? await prisma.ctaBannerContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.ctaBannerContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
