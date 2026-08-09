import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/lib/require-admin';

export async function GET() {
  const unauthorized = await requireAdmin("about-content", "view");
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.aboutPageContent.findFirst();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin("about-content", "edit");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.aboutPageContent.findFirst();

    const data = {
      title: body.title,
      featuredImage: body.featuredImage,
      happyTravelers: body.happyTravelers,
      yearsExperience: body.yearsExperience,
      successfulTrips: body.successfulTrips,
      expertGuides: body.expertGuides,
      paragraph1: body.paragraph1,
      paragraph2: body.paragraph2,
      paragraph3: body.paragraph3,
      paragraph4: body.paragraph4,
      cultureTitle: body.cultureTitle,
      cultureText: body.cultureText,
      missionText: body.missionText,
      visionText: body.visionText,
      goalsText: body.goalsText,
    };

    const content = existing
      ? await prisma.aboutPageContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.aboutPageContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}