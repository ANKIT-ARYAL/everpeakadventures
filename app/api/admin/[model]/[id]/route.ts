import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const modelMap: Record<string, any> = {
  treks: prisma.trek,
  tours: prisma.tour,
  blogs: prisma.blogPost,
  testimonials: prisma.clientReview,
  faqs: prisma.fAQ,
  team: prisma.teamMember,
  'legal-documents': prisma.legalDocument,
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  const { model, id } = await params;
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
  const { model, id } = await params;
  const delegate = modelMap[model];

  if (!delegate) return NextResponse.json({ error: 'Invalid model' }, { status: 400 });

  try {
    await delegate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}