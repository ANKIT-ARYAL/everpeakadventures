import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("pages", "edit");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();

  try {
    const page = await prisma.contentPage.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug || undefined,
        subtitle: body.subtitle ?? undefined,
        heroImage: body.heroImage ?? undefined,
        content: body.content ?? undefined,
        categoryId: body.categoryId ?? undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
        published: body.published ?? undefined,
      },
    });
    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error("Failed to update page:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("pages", "delete");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.contentPage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}