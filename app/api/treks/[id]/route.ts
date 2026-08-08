import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();

    const updatedTrek = await prisma.$transaction(async (tx) => {
      await tx.trekGroupPrice.deleteMany({ where: { trekId: id } });
      await tx.trekSchedule.deleteMany({ where: { trekId: id } });

      return tx.trek.update({
        where: { id },
        data: {
          title: body.title,
          slug: body.slug,
          description: body.description,
          overview: body.overview,
          heroImage: body.heroImage,
          gallery: body.gallery,
          durationDays: body.durationDays,
          price: Number(body.price),
          discountedPrice: body.discountedPrice ? Number(body.discountedPrice) : null,
          originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
          priceRange: body.priceRange || null,
          isAllInclusive: body.isAllInclusive ?? false,
          region: body.region,
          regions: body.regions || [],
          difficulty: body.difficulty,
          maxAltitude: body.maxAltitude,
          bestSeason: body.bestSeason,
          accommodation: body.accommodation,
          meals: body.meals,
          groupSize: body.groupSize,
          transport: body.transport,
          activity: body.activity,
          highlights: body.highlights,
          inclusions: body.inclusions,
          exclusions: body.exclusions,
          packingList: body.packingList,
          itinerary: body.itinerary,
          mapUrl: body.mapUrl,
          videoUrl: body.videoUrl || null,
          videoType: body.videoType || null,
          order: Number(body.order),
          groupPrices: {
            create: (body.groupPrices || []).map((g: any) => ({
              groupSize: g.groupSize,
              groupType: g.groupType,
              price: g.price,
            })),
          },
          fixedSchedules: {
            create: (body.fixedSchedules || []).map((s: any) => ({
              groupSize: s.groupSize,
              dateRange: s.dateRange,
              status: s.status,
            })),
          },
        },
      });
    });

    return NextResponse.json({ success: true, trek: updatedTrek });
  } catch (error: any) {
    console.error("Failed to update trek:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;

    await prisma.trek.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Trek deleted successfully' });
  } catch (error: any) {
    console.error("Failed to delete trek:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}