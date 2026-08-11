import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";
import { ensureRecurringInstances } from "@/lib/departures";

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET() {
  const unauthorized = await requireAdmin("departures", "view");
  if (unauthorized) return unauthorized;

  try {
    await ensureRecurringInstances();
    const departures = await prisma.departure.findMany({
      include: {
        trek: { select: { id: true, slug: true, title: true, heroImage: true, durationDays: true, price: true, discountedPrice: true, originalPrice: true } },
        tour: { select: { id: true, slug: true, title: true, heroImage: true, duration: true, price: true, discountedPrice: true, originalPrice: true } },
      },
      orderBy: { startDate: 'desc' },
    });
    return NextResponse.json({ success: true, data: departures });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("departures", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const tripType = body.tripType === 'tour' ? 'tour' : 'trek';
    const tripRef =
      tripType === 'trek'
        ? { trekId: body.trekId ?? null, tourId: null }
        : { tourId: body.tourId ?? null, trekId: null };

    const newDeparture = await prisma.departure.create({
      data: {
        tripType,
        ...tripRef,
        startDate: toDate(body.startDate) || new Date(),
        endDate: toDate(body.endDate),
        groupSize: body.groupSize || null,
        status: body.status || 'Guaranteed',
        seatsLeft: Number(body.seatsLeft) || 12,
        recurring: !!body.recurring,
        published: body.published ?? true,
      },
    });
    return NextResponse.json({ success: true, data: newDeparture }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
