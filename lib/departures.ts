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

// Parse a price string like "US$ 2,499" into a number (2499).
export function parsePrice(s?: string | null): number {
  const n = Number(String(s ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// Parse a pax range like "2 - 4 Pax" / "10+ Pax" / "1-12" into { min, max }.
function paxRange(s?: string | null): { min: number; max: number | null } | null {
  if (!s) return null;
  const str = String(s);
  const plus = str.match(/(\d+)\s*\+/);
  if (plus) return { min: Number(plus[1]), max: null };
  const dash = str.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (dash) return { min: Number(dash[1]), max: Number(dash[2]) };
  const single = str.match(/\d+/);
  if (single) return { min: Number(single[0]), max: Number(single[0]) };
  return null;
}

function normalizeKey(s?: string | null): string {
  return String(s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

// Resolve the display price for a departure:
// 1) an explicit price override, 2) the matching group-size tier, 3) the trip's price.
function resolveDeparturePrice(d: any): number {
  const override = parsePrice(d.price);
  if (override > 0) return override;

  const trip = d.trek || d.tour;
  if (!trip) return 0;

  const groupPrices = (trip.groupPrices || []) as any[];
  const depRange = paxRange(d.groupSize);
  if (depRange && groupPrices.length > 0) {
    const exact = groupPrices.find((g: any) => normalizeKey(g.groupSize) === normalizeKey(d.groupSize));
    if (exact) {
      const p = parsePrice(exact.price);
      if (p > 0) return p;
    }
    const matched = groupPrices.find((g: any) => {
      const gr = paxRange(g.groupSize);
      if (!gr) return false;
      return depRange.min >= gr.min && (gr.max == null || depRange.min <= gr.max);
    });
    if (matched) {
      const p = parsePrice(matched.price);
      if (p > 0) return p;
    }
  }

  return trip.price || trip.discountedPrice || 0;
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
    price?: string;
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
        price: source.price || undefined,
      });
    }

    // Keep already-materialized instances in sync with the template's price override.
    if (source.price) {
      const siblings = await prisma.departure.findMany({
        where: { tripType, ...tripRef, recurring: true, id: { not: source.id } },
        select: { id: true, startDate: true },
      });
      const ids = siblings
        .filter(
          (s) =>
            s.startDate.getMonth() === source.startDate.getMonth() &&
            s.startDate.getDate() === source.startDate.getDate()
        )
        .map((s) => s.id);
      if (ids.length > 0) {
        await prisma.departure.updateMany({
          where: { id: { in: ids } },
          data: { price: source.price },
        });
      }
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
    price: resolveDeparturePrice(d),
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
          groupPrices: true,
        },
      },
      tour: {
        select: {
          id: true, slug: true, title: true, heroImage: true, duration: true,
          price: true, discountedPrice: true, originalPrice: true,
          groupPrices: true,
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
