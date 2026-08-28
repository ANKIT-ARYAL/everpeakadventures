import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("tour-categories", "view");
  if (unauthorized) return unauthorized;

  const categories = await prisma.tourCategory.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ success: true, categories });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("tour-categories", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const generatedSlug = body.slug
      || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await prisma.tourCategory.create({
      data: {
        name: body.name,
        slug: generatedSlug,
        description: body.description || null,
        image: body.image || null,
        order: Number(body.order) || 0,
        published: body.published ?? true,
      },
    });
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create tour category:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}