import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const tours = await prisma.tour.findMany({
      orderBy: { order: 'asc' },
      include: {
        groupPrices: true,
        fixedSchedules: true,
      },
    });
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    // Generate a URL-friendly slug from the title if one isn't provided
    const generatedSlug = body.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTour = await prisma.tour.create({
      data: {
        title: body.title,
        slug: body.slug || generatedSlug,
        description: body.description,
        overview: body.overview,
        heroImage: body.heroImage || body.image || '',
        gallery: body.gallery || [],
        duration: body.duration,
        price: Number(body.price) || 0,
        discountedPrice: body.discountedPrice ? Number(body.discountedPrice) : null,
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        priceRange: body.priceRange || null,
        isAllInclusive: body.isAllInclusive ?? false,
        bestTime: body.bestTime,
        destination: body.destination || 'nepal',
        primaryDestination: body.primaryDestination || null,
        grade: body.grade || 'Easy / Moderate',
        maxAltitude: body.maxAltitude || '1,350 m',
        startPoint: body.startPoint || 'Kathmandu',
        endPoint: body.endPoint || 'Kathmandu',
        meals: body.meals || 'B.B.',
        activity: body.activity || null,
        groupSize: body.groupSize || null,
        transport: body.transport || null,
        mapUrl: body.mapUrl || null,
        mapImage: body.mapImage || null,
        routeMap: body.routeMap ?? null,
        regions: body.regions || [],
        videoUrl: body.videoUrl || null,
        videoType: body.videoType || null,
        focusKeyphrase: body.focusKeyphrase || null,
        seoTitle: body.seoTitle || null,
        metaDescription: body.metaDescription || null,
        highlights: body.highlights || null,
        inclusions: body.inclusions || null,
        exclusions: body.exclusions || null,
        packingList: body.packingList || null,
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
        fixedSchedules: {
          create: (body.fixedSchedules || []).map((s: any) => ({
            groupSize: s.groupSize,
            dateRange: s.dateRange,
            status: s.status,
          })),
        },
      },
    });
    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tour package', details: String(error) }, { status: 500 });
  }
}