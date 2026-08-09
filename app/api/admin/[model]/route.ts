import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

// Map URL slugs to actual Prisma delegate models
const modelMap: Record<string, any> = {
  treks: prisma.trek,
  tours: prisma.tour,
  blogs: prisma.blogPost,
  testimonials: prisma.clientReview,
  faqs: prisma.fAQ,
  team: prisma.teamMember,
  'legal-documents': prisma.legalDocument,
  'why-choose-us-items': prisma.whyChooseUsItem,
  'why-choose-us-features': prisma.whyChooseUsFeature,
  'welcome-features': prisma.welcomeFeature,
  'subpage-heroes': prisma.subpageHero,
  departures: prisma.fixedDeparture,
  pages: prisma.page,
  'trust-items': prisma.trustItem,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { model } = await params;
  const delegate = modelMap[model];

  if (!delegate) {
    return NextResponse.json({ error: 'Invalid model endpoint' }, { status: 400 });
  }

  try {
    // 'subpage-heroes' and 'pages' have no `order` column — fall back to updatedAt
    const hasOrder = ['subpage-heroes', 'pages'].includes(model);
    const items = await delegate.findMany({
      orderBy: hasOrder ? { updatedAt: 'asc' } : { order: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { model } = await params;
  const delegate = modelMap[model];

  if (!delegate) {
    return NextResponse.json({ error: 'Invalid model endpoint' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const newItem = await delegate.create({ data: body });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create record', details: String(error) }, { status: 500 });
  }
}