import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const content = await prisma.systemSetting.findFirst();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const devSecret = request.headers.get("x-dev-secret");
  if (!process.env.DEV_SECRET || devSecret !== process.env.DEV_SECRET) {
    return NextResponse.json(
      { success: false, error: "Forbidden: dev secret required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const existing = await prisma.systemSetting.findFirst();

    const data = {
      clientExpiry: body.clientExpiry,
      packageType: body.packageType,
      databaseStatus: body.databaseStatus,
      daysLeft: body.daysLeft,
    };

    const content = existing
      ? await prisma.systemSetting.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.systemSetting.create({ data });

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
