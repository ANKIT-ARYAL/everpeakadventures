import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const newMember = await prisma.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        image: body.image || '',
        bio: body.bio || '',
        order: Number(body.order) || 0,
      }
    });

    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
