import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("departures", "view");
  if (unauthorized) return unauthorized;

  try {
    const departures = await prisma.fixedDeparture.findMany({
      orderBy: { order: 'asc' },
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
    const newDeparture = await prisma.fixedDeparture.create({
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
    return NextResponse.json({ success: true, data: newDeparture });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}