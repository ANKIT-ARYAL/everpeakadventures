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
  departures: prisma.departure,
  'trust-items': prisma.trustItem,
};

// Map URL slugs to permission resources
const resourceByModel: Record<string, string> = {
  treks: 'treks',
  tours: 'tours',
  blogs: 'blogs',
  testimonials: 'testimonials',
  faqs: 'faqs',
  team: 'team',
  'legal-documents': 'legal-documents',
  'why-choose-us-items': 'why-choose-us',
  'why-choose-us-features': 'why-choose-us',
  'welcome-features': 'welcome-features',
  'subpage-heroes': 'subpage-hero',
  departures: 'departures',
  'trust-items': 'trust-items',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  const { model } = await params;
  const unauthorized = await requireAdmin(resourceByModel[model], "view");
  if (unauthorized) return unauthorized;

  const delegate = modelMap[model];

  if (!delegate) {
    return NextResponse.json({ error: 'Invalid model endpoint' }, { status: 400 });
  }

  try {
    // 'subpage-heroes' has no `order` column — fall back to updatedAt
    const hasOrder = ['subpage-heroes'].includes(model);
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
  const { model } = await params;
  const unauthorized = await requireAdmin(resourceByModel[model], "create");
  if (unauthorized) return unauthorized;

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