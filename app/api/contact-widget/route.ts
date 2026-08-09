import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin("contact-widget", "view");
  if (unauthorized) return unauthorized;

  try {
    const settings = await prisma.contactWidgetSettings.findFirst();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin("contact-widget", "edit");
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await prisma.contactWidgetSettings.findFirst();

    const data = {
      enabled: body.enabled !== undefined ? Boolean(body.enabled) : true,
      whatsapp: body.whatsapp,
      viber: body.viber,
      phone: body.phone,
      email: body.email,
    };

    const settings = existing
      ? await prisma.contactWidgetSettings.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.contactWidgetSettings.create({ data });

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
