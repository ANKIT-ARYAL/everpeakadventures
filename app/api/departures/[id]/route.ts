import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await prisma.fixedDeparture.update({
      where: { id },
      data: {
        title: body.title,
        heroImage: body.heroImage,
        durationDays: body.durationDays,
        startDate: body.startDate,
        endDate: body.endDate || null,
        status: body.status,
        seatsLeft: Number(body.seatsLeft),
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        order: Number(body.order) || 0,
      }
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.fixedDeparture.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}