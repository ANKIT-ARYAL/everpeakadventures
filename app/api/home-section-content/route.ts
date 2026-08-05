import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.homeSectionContent.findFirst();
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
    const existing = await prisma.homeSectionContent.findFirst();

    const data = {
      featuredTreksLabel: body.featuredTreksLabel,
      featuredTreksTitle: body.featuredTreksTitle,
      bestSellersWatermark: body.bestSellersWatermark,
      bestSellersTitle: body.bestSellersTitle,
      bestSellersSubtitle: body.bestSellersSubtitle,
      fixedDeparturesLabel: body.fixedDeparturesLabel,
      fixedDeparturesTitle: body.fixedDeparturesTitle,
      popularToursWatermark: body.popularToursWatermark,
      popularToursTitle: body.popularToursTitle,
      popularToursSubtitle: body.popularToursSubtitle,
      exploreBlogsWatermark: body.exploreBlogsWatermark,
      exploreBlogsTitle: body.exploreBlogsTitle,
      exploreBlogsSubtitle: body.exploreBlogsSubtitle,
      whyChooseUsBadge: body.whyChooseUsBadge,
      whyChooseUsTitle: body.whyChooseUsTitle,
      whyChooseUsTitleHighlight: body.whyChooseUsTitleHighlight,
      whyChooseUsSubtitle: body.whyChooseUsSubtitle,
    };

    const content = existing
      ? await prisma.homeSectionContent.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.homeSectionContent.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
