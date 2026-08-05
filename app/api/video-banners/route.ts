import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.videoBannerContent.findFirst();
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
    const existing = await prisma.videoBannerContent.findFirst();

    const data = {
      title: body.title,
      subtitle: body.subtitle,
      buttonText: body.buttonText,
      buttonLink: body.buttonLink,
      videoUrl: body.videoUrl,
      backgroundImages: body.backgroundImages || [],
    };

    const content = existing
      ? await prisma.videoBannerContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.videoBannerContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
