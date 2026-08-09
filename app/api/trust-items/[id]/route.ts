import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin("trust-items", "edit");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.trustItem.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        iconName: body.iconName,
        order: Number(body.order) || 0,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin("trust-items", "delete");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await prisma.trustItem.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Trust item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
