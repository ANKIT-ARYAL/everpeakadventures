import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

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
  'trust-items': prisma.trustItem,
};

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  const { model } = await params;
  const unauthorized = await requireAdmin(resourceByModel[model], "edit");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const delegate = modelMap[model];

  if (!delegate) return NextResponse.json({ error: 'Invalid model' }, { status: 400 });

  try {
    const body = await request.json();
    delete body.id; // Prevent updating ID
    const updated = await delegate.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  const { model } = await params;
  const unauthorized = await requireAdmin(resourceByModel[model], "delete");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const delegate = modelMap[model];

  if (!delegate) return NextResponse.json({ error: 'Invalid model' }, { status: 400 });

  try {
    await delegate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}