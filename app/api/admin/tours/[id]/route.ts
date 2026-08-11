import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";
import { parseDepartureDate } from "@/lib/departures";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("tours", "view");
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        groupPrices: true,
        departures: true,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tour item' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("tours", "edit");
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const body = await request.json();
    delete body.id; // Prevent updating ID field

    const updatedTour = await prisma.$transaction(async (tx) => {
      await tx.tourGroupPrice.deleteMany({ where: { tourId: id } });
      await tx.departure.deleteMany({ where: { tourId: id } });

      return tx.tour.update({
        where: { id },
        data: {
          title: body.title,
          slug: body.slug,
          description: body.description,
          overview: body.overview,
          heroImage: body.heroImage || body.image,
          gallery: body.gallery || [],
          duration: body.duration,
          price: Number(body.price) || 0,
          discountedPrice: body.discountedPrice ? Number(body.discountedPrice) : null,
          originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
          priceRange: body.priceRange || null,
          isAllInclusive: body.isAllInclusive ?? false,
          bestTime: body.bestTime,
          destination: body.destination,
          primaryDestination: body.primaryDestination || null,
          grade: body.grade,
          maxAltitude: body.maxAltitude,
          startPoint: body.startPoint,
          endPoint: body.endPoint,
          meals: body.meals,
          activity: body.activity || null,
          groupSize: body.groupSize || null,
          transport: body.transport || null,
          rate: body.rate ? Number(body.rate) : null,
          rating: body.rating ? Number(body.rating) : null,
          altitudeData: body.altitudeData || [],
          mapUrl: body.mapUrl || null,
          mapImage: body.mapImage || null,
          routeMap: body.routeMap ?? null,
          regions: body.regions || [],
          videoUrl: body.videoUrl || null,
          videoType: body.videoType || null,
          focusKeyphrase: body.focusKeyphrase || null,
          seoTitle: body.seoTitle || null,
          metaDescription: body.metaDescription || null,
          highlights: body.highlights,
          inclusions: body.inclusions,
          exclusions: body.exclusions,
          packingList: body.packingList,
          itinerary: body.itinerary || [],
          isBestSeller: body.isBestSeller || false,
          order: Number(body.order) || 0,
          groupPrices: {
            create: (body.groupPrices || []).map((g: any) => ({
              groupSize: g.groupSize,
              groupType: g.groupType,
              price: g.price,
            })),
          },
          departures: {
            create: (body.departures || []).map((s: any) => ({
              tripType: 'tour',
              startDate: parseDepartureDate(s.startDate) || new Date(),
              endDate: parseDepartureDate(s.endDate),
              groupSize: s.groupSize || null,
              status: s.status || 'Guaranteed',
              seatsLeft: Number(s.seatsLeft) || 12,
              recurring: !!s.recurring,
            })),
          },
        },
      });
    });

    return NextResponse.json(updatedTour);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tour record', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("tours", "delete");
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    await prisma.tour.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tour record' }, { status: 500 });
  }
}