import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const features = await prisma.welcomeFeature.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: features });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const newFeature = await prisma.welcomeFeature.create({
      data: {
        title: body.title,
        description: body.description || '',
        order: Number(body.order) || 0,
      }
    });

    return NextResponse.json({ success: true, data: newFeature }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
