import { prisma } from "@/lib/prisma";
import type { Departure } from "@prisma/client";

export const DEPARTURE_WINDOW_YEARS = 2;

// Accepts ISO strings or date-only "YYYY-MM-DD" (kept at local noon to avoid TZ day-shifts).
export function parseDepartureDate(v?: string | null): Date | null {
  if (!v) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T12:00:00`) : new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

// Visibility window: [today, today + 2 years). Only departures inside it show on the frontend.
export function departureWindow(today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + DEPARTURE_WINDOW_YEARS);
  end.setDate(end.getDate() - 1);
  return { start, end };
}

function fmt(date: Date | null | undefined) {
  if (!date) return undefined;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// For every recurring departure, materialize dated instances for the next 2 years
// so bookings can target a concrete stored date (e.g. Mar 15 -> 2027 & 2028 rows).
export async function ensureRecurringInstances() {
  const { end } = departureWindow();
  const recurring = await prisma.departure.findMany({ where: { recurring: true } });

  const templates = new Map<
    string,
    { tripType: string; tripId: string; source: Departure }
  >();
  for (const d of recurring) {
    const tripId = d.trekId || d.tourId;
    if (!tripId) continue;
    const key = `${d.tripType}:${tripId}:${d.startDate.getMonth()}:${d.startDate.getDate()}`;
    if (!templates.has(key)) templates.set(key, { tripType: d.tripType, tripId, source: d });
  }

  const toCreate: {
    tripType: string;
    trekId?: string;
    tourId?: string;
    startDate: Date;
    endDate?: Date;
    groupSize?: string;
    status: string;
    seatsLeft: number;
    recurring: boolean;
    published: boolean;
  }[] = [];

  for (const { tripType, tripId, source } of templates.values()) {
    const tripRef = tripType === "trek" ? { trekId: tripId } : { tourId: tripId };
    const endYear = end.getFullYear();
    const startYear = source.startDate.getFullYear();
    const existing = await prisma.departure.findMany({
      where: { tripType, ...tripRef, startDate: { gte: source.startDate } },
      select: { startDate: true },
    });
    const existingDates = new Set(existing.map((e) => e.startDate.toDateString()));

    for (let year = startYear; year <= endYear; year++) {
      const candidate = new Date(year, source.startDate.getMonth(), source.startDate.getDate());
      if (candidate.getTime() < Date.now() || candidate > end) continue;
      if (existingDates.has(candidate.toDateString())) continue;
      toCreate.push({
        tripType,
        ...tripRef,
        startDate: candidate,
        endDate: source.endDate
          ? new Date(year, source.endDate.getMonth(), source.endDate.getDate())
          : undefined,
        groupSize: source.groupSize || undefined,
        status: source.status,
        seatsLeft: source.seatsLeft,
        recurring: true,
        published: source.published,
      });
    }
  }

  if (toCreate.length > 0) {
    await prisma.departure.createMany({ data: toCreate });
  }
}

export interface DepartureShape {
  id: string;
  departureId: string;
  trip_id: string;
  tripType: string;
  slug?: string | null;
  title: string;
  heroImage: string;
  durationDays: string;
  startDate: string;
  endDate?: string;
  status: string;
  seatsLeft: number;
  price: number;
  originalPrice: number | null;
}

export function shapeDeparture(d: any): DepartureShape | null {
  const trip = d.trek || d.tour;
  if (!trip) return null;
  return {
    id: d.id,
    departureId: d.id,
    trip_id: trip.id,
    tripType: d.tripType,
    slug: trip.slug,
    title: trip.title,
    heroImage: trip.heroImage,
    durationDays: d.tripType === "trek" ? trip.durationDays : trip.duration,
    startDate: fmt(d.startDate) as string,
    endDate: fmt(d.endDate),
    status: d.status,
    seatsLeft: d.seatsLeft,
    price: trip.discountedPrice ?? trip.price,
    originalPrice: trip.originalPrice ?? null,
  };
}

// Departures for the frontend, shaped for the departures table component.
export async function getFrontendDepartures(publishedOnly = true) {
  await ensureRecurringInstances();
  const { start, end } = departureWindow();
  const departures = await prisma.departure.findMany({
    where: {
      ...(publishedOnly ? { published: true } : {}),
      startDate: { gte: start, lte: end },
    },
    include: {
      trek: {
        select: {
          id: true, slug: true, title: true, heroImage: true, durationDays: true,
          price: true, discountedPrice: true, originalPrice: true,
        },
      },
      tour: {
        select: {
          id: true, slug: true, title: true, heroImage: true, duration: true,
          price: true, discountedPrice: true, originalPrice: true,
        },
      },
    },
    orderBy: { startDate: "asc" },
  });
  return departures.map(shapeDeparture).filter(Boolean) as DepartureShape[];
}

// All departures (window + past), with trip info, for the admin.
export async function getAdminDepartures() {
  await ensureRecurringInstances();
  return prisma.departure.findMany({
    include: {
      trek: { select: { id: true, slug: true, title: true, heroImage: true, durationDays: true, price: true, discountedPrice: true, originalPrice: true } },
      tour: { select: { id: true, slug: true, title: true, heroImage: true, duration: true, price: true, discountedPrice: true, originalPrice: true } },
    },
    orderBy: [{ startDate: "desc" }],
  });
}

export function tripOf(d: any) {
  return d.trek || d.tour;
}
