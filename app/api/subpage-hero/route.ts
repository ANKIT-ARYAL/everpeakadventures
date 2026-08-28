import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("subpage-hero", "view");
  if (unauthorized) return unauthorized;

  try {
    const heroes = await prisma.subpageHero.findMany({
      orderBy: { slug: 'asc' },
    });
    return NextResponse.json({ success: true, data: heroes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("subpage-hero", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const newHero = await prisma.subpageHero.create({
      data: {
        slug: body.slug,
        title: body.title || '',
        subtitle: body.subtitle || null,
        image: body.image || null,
      },
    });

    return NextResponse.json({ success: true, data: newHero }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
