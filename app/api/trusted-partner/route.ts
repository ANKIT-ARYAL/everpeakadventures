import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("why-choose-us", "view");
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.trustedPartnerContent.findFirst();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin("why-choose-us", "edit");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.trustedPartnerContent.findFirst();

    const data = {
      mainTitle: body.mainTitle,
      description: body.description,
      badgeTitle: body.badgeTitle,
      badgeSubtitle: body.badgeSubtitle,
      reviewCountText: body.reviewCountText,
      storyTitle: body.storyTitle,
      storyDescription: body.storyDescription,
      storyImage: body.storyImage,
      bgHeroImage: body.bgHeroImage,
    };

    const content = existing
      ? await prisma.trustedPartnerContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.trustedPartnerContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
