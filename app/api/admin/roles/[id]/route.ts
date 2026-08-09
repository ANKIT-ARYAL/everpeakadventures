import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("roles", "edit");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { success: false, error: "Role name is required." },
        { status: 400 }
      );
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        name: body.name.trim(),
        description: body.description || null,
        permissions: Array.isArray(body.permissions) ? body.permissions : [],
      },
    });

    return NextResponse.json({ success: true, data: role });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("roles", "delete");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;

    const userCount = await prisma.user.count({ where: { roleId: id } });
    if (userCount > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete a role that has users assigned." },
        { status: 400 }
      );
    }

    await prisma.role.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}