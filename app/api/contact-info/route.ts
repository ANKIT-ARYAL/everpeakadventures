import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  // Public GET: contact info is intended to be publicly visible on the Contact page.
  try {
    const [content, settings] = await Promise.all([
      prisma.contactInfo.findFirst({ where: { published: true } }),
      prisma.siteSettings.findFirst(),
    ]);
    return NextResponse.json({ success: true, data: content ? { ...content, whatsapp: settings?.whatsapp?.trim() || "" } : null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin("contact-info", "edit");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.contactInfo.findFirst();

    const data = {
      address: body.address,
      phone: body.phone,
      email: body.email,
      mapUrl: body.mapUrl,
    };

    const settings = await prisma.siteSettings.findFirst();
    const writes = [existing
      ? prisma.contactInfo.update({ where: { id: existing.id }, data })
      : prisma.contactInfo.create({ data })];
    const [content] = await prisma.$transaction([
      ...writes,
      ...(typeof body.whatsapp === 'string' ? [settings
        ? prisma.siteSettings.update({ where: { id: settings.id }, data: { whatsapp: body.whatsapp.trim() } })
        : prisma.siteSettings.create({ data: { whatsapp: body.whatsapp.trim() } })] : []),
    ]);

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
