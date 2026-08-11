import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin("departures", "edit");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const tripType = body.tripType === 'tour' ? 'tour' : 'trek';
    const tripRef =
      tripType === 'trek'
        ? { trekId: body.trekId ?? null, tourId: null }
        : { tourId: body.tourId ?? null, trekId: null };

    const updated = await prisma.departure.update({
      where: { id },
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
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin("departures", "delete");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await prisma.departure.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
