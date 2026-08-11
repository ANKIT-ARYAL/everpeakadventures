import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("pages", "view");
  if (unauthorized) return unauthorized;

  const pages = await prisma.contentPage.findMany({
    orderBy: { order: 'asc' },
    include: { category: true },
  });
  return NextResponse.json({ success: true, pages });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("pages", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const generatedSlug = body.slug
      || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const page = await prisma.contentPage.create({
      data: {
        title: body.title,
        slug: generatedSlug,
        subtitle: body.subtitle || null,
        heroImage: body.heroImage || null,
        content: body.content || null,
        categoryId: body.categoryId || null,
        order: Number(body.order) || 0,
        published: body.published ?? true,
      },
    });
    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create page:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}