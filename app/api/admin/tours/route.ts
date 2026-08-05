import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTour = await prisma.tour.create({
      data: {
        title: body.title,
        slug: body.slug,
        image: body.image,
        duration: body.duration,
        bestTime: body.bestTime,
        destination: body.destination || 'nepal',
        grade: body.grade || 'Easy / Moderate',
        maxAltitude: body.maxAltitude || '1,350 m',
        startPoint: body.startPoint || 'Kathmandu',
        endPoint: body.endPoint || 'Kathmandu',
        meals: body.meals || 'B.B.',
        overview: body.overview || '',
        highlights: body.highlights || [],
        itinerary: body.itinerary || [],
        inclusions: body.inclusions || [],
        gallery: body.gallery || [],
        exclusions: body.exclusions || [],
        price: Number(body.price) || 0,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tour package', details: String(error) }, { status: 500 });
  }
}