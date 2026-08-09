import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.heroContent.findFirst();
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
    const existing = await prisma.heroContent.findFirst();

    const data = {
      topLabel: body.topLabel,
      mainHeading: body.mainHeading,
      subtext: body.subtext,
      heroMediaType: body.heroMediaType,
      heroMediaUrl: body.heroMediaUrl,
      youtubeVideoId: body.youtubeVideoId,
      searchPlaceholder: body.searchPlaceholder,
      primaryButtonText: body.primaryButtonText,
      primaryButtonLink: body.primaryButtonLink,
      secondaryButtonText: body.secondaryButtonText,
      secondaryButtonLink: body.secondaryButtonLink,
    };

    const content = existing
      ? await prisma.heroContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.heroContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
