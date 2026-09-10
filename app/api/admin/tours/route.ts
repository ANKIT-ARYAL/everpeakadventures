import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";
import { parseDepartureDate } from "@/lib/departures";

const toSafeString = (value: unknown) => value == null ? '' : String(value).trim();

const normalizeGroupPrice = (groupPrice: any) => ({
  groupSize: toSafeString(groupPrice?.groupSize),
  groupType: toSafeString(groupPrice?.groupType) || 'Best Value',
  price: toSafeString(groupPrice?.price),
});

const normalizeDeparture = (departure: any) => ({
  tripType: 'tour',
  startDate: parseDepartureDate(departure?.startDate) || new Date(),
  endDate: parseDepartureDate(departure?.endDate),
  groupSize: toSafeString(departure?.groupSize),
  status: toSafeString(departure?.status) || 'Guaranteed',
  seatsLeft: Number(departure?.seatsLeft) || 12,
  recurring: Boolean(departure?.recurring),
});

export async function GET() {  const unauthorized = await requireAdmin("tours", "view");
  if (unauthorized) return unauthorized;

  try {
    const tours = await prisma.tour.findMany({
      orderBy: { order: 'asc' },
      include: {
        groupPrices: true,
        departures: true,
      },
    });
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("tours", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const cleanGroupPrices = Array.isArray(body.groupPrices)
      ? body.groupPrices.filter((groupPrice: any) => toSafeString(groupPrice?.groupSize) !== '' || toSafeString(groupPrice?.price) !== '')
      : [];
    const cleanDepartures = Array.isArray(body.departures)
      ? body.departures.filter((departure: any) => toSafeString(departure?.startDate) !== '')
      : [];

    const generatedSlug = toSafeString(body.title)
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTour = await prisma.tour.create({
      data: {
        title: toSafeString(body.title) || 'Untitled Tour',
        slug: toSafeString(body.slug) || generatedSlug || `tour-${Date.now()}`,
        description: body.description,
        overview: body.overview,
        heroImage: toSafeString(body.heroImage || body.image) || '',
        gallery: Array.isArray(body.gallery) ? body.gallery.filter((item: unknown) => toSafeString(item) !== '') : [],
        duration: toSafeString(body.duration),
        price: Number(body.price) || 0,
        discountedPrice: body.discountedPrice ? Number(body.discountedPrice) : null,
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        priceRange: body.priceRange || null,
        isAllInclusive: body.isAllInclusive ?? false,
        bestTime: body.bestTime,
        destination: toSafeString(body.destination) || 'nepal',
        primaryDestination: toSafeString(body.primaryDestination) || null,
        grade: toSafeString(body.grade) || 'Easy / Moderate',
        maxAltitude: toSafeString(body.maxAltitude) || '1,350 m',
        startPoint: toSafeString(body.startPoint) || 'Kathmandu',
        endPoint: toSafeString(body.endPoint) || 'Kathmandu',
        meals: toSafeString(body.meals) || 'B.B.',
        activity: toSafeString(body.activity) || null,
        groupSize: toSafeString(body.groupSize) || null,
        transport: toSafeString(body.transport) || null,
        rate: body.rate ? Number(body.rate) : null,
        rating: body.rating ? Number(body.rating) : null,
        altitudeData: body.altitudeData || [],
        mapUrl: toSafeString(body.mapUrl) || null,
        mapImage: toSafeString(body.mapImage) || null,
        routeMap: body.routeMap ?? null,
        regions: Array.isArray(body.regions) ? body.regions : [],
        videoUrl: toSafeString(body.videoUrl) || null,
        videoType: toSafeString(body.videoType) || null,
        focusKeyphrase: toSafeString(body.focusKeyphrase) || null,
        seoTitle: toSafeString(body.seoTitle) || null,
        metaDescription: toSafeString(body.metaDescription) || null,
        reviews: Array.isArray(body.reviews) ? body.reviews : undefined,
        highlights: body.highlights || null,
        inclusions: body.inclusions || null,
        exclusions: body.exclusions || null,
        packingItems: {
          connect: (Array.isArray(body.packingItemIds) ? body.packingItemIds : [])
            .filter(Boolean)
            .map((id: string) => ({ id })),
        },
        itinerary: body.itinerary || [],
        isBestSeller: body.isBestSeller || false,
        order: Number(body.order) || 0,
        groupPrices: {
          create: cleanGroupPrices.map(normalizeGroupPrice),
        },
        departures: {
          create: cleanDepartures.map(normalizeDeparture),
        },
      },
    });
    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to create tour package', details: message }, { status: 500 });
  }
}