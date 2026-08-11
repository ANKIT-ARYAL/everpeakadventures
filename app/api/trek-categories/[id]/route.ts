import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("trek-categories", "edit");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();

  try {
    const category = await prisma.trekCategory.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug || undefined,
        description: body.description ?? undefined,
        image: body.image ?? undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
        published: body.published ?? undefined,
      },
    });
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Failed to update trek category:", error);
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
  const unauthorized = await requireAdmin("trek-categories", "delete");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.trekCategory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}