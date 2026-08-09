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

export async function GET() {
  const unauthorized = await requireAdmin("users", "view");
  if (unauthorized) return unauthorized;

  try {
    const users = await prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("users", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.username || typeof body.username !== "string") {
      return NextResponse.json(
        { success: false, error: "Username is required." },
        { status: 400 }
      );
    }

    if (!body.roleId) {
      return NextResponse.json(
        { success: false, error: "Role is required." },
        { status: 400 }
      );
    }

    const generatedPassword = typeof body.password === "string" && body.password
      ? null
      : generatePassword(12);

    const user = await prisma.user.create({
      data: {
        username: body.username.trim(),
        passwordHash: await hashPassword(body.password || generatedPassword || ""),
        name: body.name || null,
        roleId: body.roleId,
        active: body.active !== false,
      },
      select: USER_SELECT,
    });

    return NextResponse.json(
      { success: true, data: user, generatedPassword: generatedPassword ?? null },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}