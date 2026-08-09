import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";
import { hashPassword, generatePassword } from "@/lib/password";

const USER_SELECT = {
  id: true,
  username: true,
  name: true,
  roleId: true,
  active: true,
  lastLoginAt: true,
  createdAt: true,
  role: { select: { id: true, name: true } },
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("users", "edit");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};

    if (typeof body.username === "string" && body.username.trim()) {
      data.username = body.username.trim();
    }
    if (typeof body.name === "string") {
      data.name = body.name || null;
    }
    if (typeof body.roleId === "string" && body.roleId) {
      data.roleId = body.roleId;
    }
    if (typeof body.active === "boolean") {
      data.active = body.active;
    }
    let generatedPassword: string | null = null;

    if (body.password) {
      data.passwordHash = await hashPassword(body.password);
    } else if (body.resetPassword) {
      generatedPassword = generatePassword(12);
      data.passwordHash = await hashPassword(generatedPassword);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });

    return NextResponse.json({
      success: true,
      data: user,
      generatedPassword: generatedPassword ?? null,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("users", "delete");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}