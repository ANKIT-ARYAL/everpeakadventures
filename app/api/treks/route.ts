import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";
import { parseDepartureDate } from "@/lib/departures";

export async function GET() {
  const unauthorized = await requireAdmin("treks", "view");
  if (unauthorized) return unauthorized;

  try {
    const treks = await prisma.trek.findMany({
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json({ success: true, treks });
  } catch (error: any) {
    console.error("Failed to fetch treks:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("treks", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    // Generate a URL-friendly slug from the title if one isn't provided
    const generatedSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTrek = await prisma.trek.create({
      data: {
        title: body.title,
        slug: body.slug || generatedSlug,
        description: body.description,
        overview: body.overview,
        heroImage: body.heroImage || '',
        gallery: body.gallery || [],
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
        startPoint: body.startPoint,
        endPoint: body.endPoint,
        rate: body.rate ? Number(body.rate) : null,
        rating: body.rating ? Number(body.rating) : null,
        altitudeData: body.altitudeData || [],
        highlights: body.highlights || null,
        inclusions: body.inclusions || null,
        exclusions: body.exclusions || null,
        packingList: body.packingList || null,
        itinerary: body.itinerary || [],
        mapUrl: body.mapUrl,
        mapImage: body.mapImage || null,
        routeMap: body.routeMap ?? null,
        videoUrl: body.videoUrl || null,
        videoType: body.videoType || null,
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
            tripType: 'trek',
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

    return NextResponse.json({ success: true, trek: newTrek }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create trek:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}