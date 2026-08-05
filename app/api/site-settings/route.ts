import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.siteSettings.findFirst();

    const data = {
      logoImage: body.logoImage,
      emergencyLabel: body.emergencyLabel,
      emergencyLandline: body.emergencyLandline,
      emergencyPhone: body.emergencyPhone,
      whatsapp: body.whatsapp,
      email: body.email,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      addressMapUrl: body.addressMapUrl,
      footerBgImage: body.footerBgImage,
      copyrightText: body.copyrightText,
    };

    const settings = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.siteSettings.create({ data });

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
