import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.contactInfo.findFirst();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.contactInfo.findFirst();

    const data = {
      address: body.address,
      phone: body.phone,
      email: body.email,
      mapUrl: body.mapUrl,
    };

    const content = existing
      ? await prisma.contactInfo.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.contactInfo.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
