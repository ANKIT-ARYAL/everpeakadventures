import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("site-settings", "view");
  if (unauthorized) return unauthorized;

  try {
    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: unknown) {
    if (error instanceof Error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin("site-settings", "edit");
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
      newsletterTitle: body.newsletterTitle,
      loginHeroImage: body.loginHeroImage,
      footerColumns: body.footerColumns,
      footerLogos: body.footerLogos,
      smtpHost: body.smtpHost,
      smtpPort: body.smtpPort ? parseInt(body.smtpPort) : null,
      smtpUser: body.smtpUser,
      smtpPassword: body.smtpPassword,
      facebookUrl: body.facebookUrl,
      instagramUrl: body.instagramUrl,
      youtubeUrl: body.youtubeUrl,
    };

    const settings = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.siteSettings.create({ data });

    return NextResponse.json({ success: true, data: settings });
  } catch (error: unknown) {
    if (error instanceof Error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
  }
}
