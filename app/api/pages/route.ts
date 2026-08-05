import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { sections: true } } },
    });
    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const generatedSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPage = await prisma.page.create({
      data: {
        slug: body.slug || generatedSlug,
        title: body.title,
        subtitle: body.subtitle || '',
        heroImage: body.heroImage || '',
        content: body.content || '',
        ...(Array.isArray(body.sections)
          ? {
              sections: {
                create: body.sections.map((s: any) => ({
                  title: s.title || '',
                  description: s.description || '',
                  image: s.image || '',
                  icon: s.icon || '',
                  order: Number(s.order) || 0,
                })),
              },
            }
          : {}),
      },
    });

    return NextResponse.json({ success: true, data: newPage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
