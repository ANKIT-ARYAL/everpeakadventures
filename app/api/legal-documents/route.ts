import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("legal-documents", "view");
  if (unauthorized) return unauthorized;

  try {
    const documents = await prisma.legalDocument.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: documents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin("legal-documents", "create");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const newDocument = await prisma.legalDocument.create({
      data: {
        title: body.title,
        image: body.image || '',
        documentUrl: body.documentUrl || '',
        order: Number(body.order) || 0,
      }
    });

    return NextResponse.json({ success: true, data: newDocument }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
