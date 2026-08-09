import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

export const dynamic = 'force-dynamic';

// GET /api/admin/bookings — list all booking submissions (for the admin panel)
export async function GET() {
  const unauthorized = await requireAdmin("bookings", "view");
  if (unauthorized) return unauthorized;

  const bookings = await prisma.bookingSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ bookings });
}