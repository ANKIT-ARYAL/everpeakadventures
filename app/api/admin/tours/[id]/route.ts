import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const tour = await prisma.tour.findUnique({
      where: { id },
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
  const { id } = await params;

  try {
    const body = await request.json();
    delete body.id; // Prevent updating ID field

    const updatedTour = await prisma.tour.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        image: body.image,
        duration: body.duration,
        bestTime: body.bestTime,
        destination: body.destination,
        grade: body.grade,
        gallery: body.gallery || [],
        maxAltitude: body.maxAltitude,
        startPoint: body.startPoint,
        endPoint: body.endPoint,
        meals: body.meals,
        overview: body.overview,
        highlights: body.highlights || [],
        itinerary: body.itinerary || [],
        inclusions: body.inclusions || [],
        exclusions: body.exclusions || [],
        price: Number(body.price) || 0,
        order: Number(body.order) || 0,
      },
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