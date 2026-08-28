import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("blogs", "view");
  if (unauthorized) return unauthorized;

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("blogs", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const generatedSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPost = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug || generatedSlug,
        content: body.content || '',
        excerpt: body.excerpt || '',
        image: body.image || '',
        category: body.category || 'Trekking / Hiking',
        tags: body.tags || [],
        date: body.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        seoTitle: body.seoTitle || '',
        metaDescription: body.metaDescription || '',
        focusKeyphrase: body.focusKeyphrase || '',
        faqs: body.faqs || [],
        order: Number(body.order) || 0,
      }
    });

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}