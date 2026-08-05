import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
        region: body.region,
        difficulty: body.difficulty,
        maxAltitude: body.maxAltitude,
        bestSeason: body.bestSeason,
        accommodation: body.accommodation,
        meals: body.meals,
        groupSize: body.groupSize,
        transport: body.transport,
        highlights: body.highlights || [],
        inclusions: body.inclusions || [],
        exclusions: body.exclusions || [],
        packingList: body.packingList || [],
        itinerary: body.itinerary || [],
        mapUrl: body.mapUrl,
        isBestSeller: body.isBestSeller || false,
        order: Number(body.order) || 0,
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