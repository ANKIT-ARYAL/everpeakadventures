import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

const VALID_STATUSES = ['new', 'pending', 'confirmed', 'cancelled', 'completed'];

// GET /api/admin/bookings/[id] — single booking detail
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("bookings", "view");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const booking = await prisma.bookingSubmission.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  return NextResponse.json(booking);
}

// PATCH /api/admin/bookings/[id] — update status and/or admin notes
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("bookings", "edit");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const booking = await prisma.bookingSubmission.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const data: Record<string, string> = {};
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.adminNotes !== undefined) {
    data.adminNotes = typeof body.adminNotes === 'string' ? body.adminNotes : '';
  }

  const updated = await prisma.bookingSubmission.update({
    where: { id },
    data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/admin/bookings/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin("bookings", "delete");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const booking = await prisma.bookingSubmission.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  await prisma.bookingSubmission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}