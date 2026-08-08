import { prisma } from "@/lib/prisma";
import BookingsManager from "./BookingsManager";
import "./ftb.css";

export const dynamic = "force-dynamic";

function parseUsd(s: string): number {
  const m = String(s || "").match(/[\d,]+(?:\.\d+)?/);
  if (!m) return 0;
  return parseFloat(m[0].replace(/,/g, ""));
}

function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function lastDaysIso(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - (n - 1));
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const read = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");

  const [bookings, treks, tours] = await Promise.all([
    prisma.bookingSubmission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.trek.findMany({
      select: { id: true, title: true, slug: true, region: true, fixedSchedules: true },
    }),
    prisma.tour.findMany({
      select: { id: true, title: true, slug: true, destination: true, fixedSchedules: true },
    }),
  ]);

  const tripMeta = new Map<string, { title: string; url: string; country: string; fixedDate: string }>();
  for (const t of treks) {
    tripMeta.set(t.title.toLowerCase(), {
      title: t.title,
      url: t.slug ? `/trekking/${t.slug}` : "",
      country: t.region || "Nepal",
      fixedDate: t.fixedSchedules?.[0]?.dateRange || "",
    });
  }
  for (const t of tours) {
    tripMeta.set(t.title.toLowerCase(), {
      title: t.title,
      url: `/tour/${t.slug}`,
      country: t.destination || "Nepal",
      fixedDate: t.fixedSchedules?.[0]?.dateRange || "",
    });
  }

  const tripOptions = new Set<string>();
  for (const t of [...treks, ...tours]) tripOptions.add(t.title);
  const fixedTripTitles = new Set(
    [...treks.filter((t) => t.fixedSchedules.length > 0), ...tours.filter((t) => t.fixedSchedules.length > 0)].map((t) =>
      t.title.toLowerCase()
    )
  );

  const today = todayISO();
  const totalPrice = bookings
    .filter((b) => b.status !== "cancelled" && b.status !== "new")
    .reduce((acc, b) => acc + parseUsd(b.estimatedTotal), 0);

  const counts = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    today: bookings.filter((b) => b.travelDate === today).length,
    value: totalPrice,
  };

  // ---- apply filters ----
  const status = read("status");
  const tripFilter = read("trip_filter");
  const s = read("s").trim().toLowerCase();
  const dateFrom = read("date_from");
  const dateTo = read("date_to");

  const filtered = bookings.filter((b) => {
    if (status && b.status !== status) return false;
    if (tripFilter) {
      if (tripFilter === "__fixed__") {
        const meta = tripMeta.get(b.tripTitle.toLowerCase());
        if (!meta || !fixedTripTitles.has(b.tripTitle.toLowerCase())) return false;
      } else if (b.tripTitle.toLowerCase() !== tripFilter.toLowerCase()) return false;
    }
    if (s) {
      const hay = [b.fullName, b.email, b.phone, b.country, b.tripTitle].join(" ").toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (dateFrom && b.travelDate < dateFrom) return false;
    if (dateTo && b.travelDate > dateTo) return false;
    return true;
  });

  const rows = bookings.map((b) => {
      const meta = tripMeta.get(b.tripTitle.toLowerCase());
      const travellers = (b.adultMale || 0) + (b.adultFemale || 0) + (b.childMale || 0) + (b.childFemale || 0);
      const total = parseUsd(b.estimatedTotal);
      return {
        id: b.id,
        createdAt: b.createdAt.getTime(),
        tripTitle: b.tripTitle,
        country: meta?.country || b.country || "Country not set",
        detailUrl: meta?.url || "",
        groupSize: b.groupSize,
        fullName: b.fullName,
        email: b.email,
        phone: b.phone,
        travelDate: b.travelDate,
        fixedDate: meta?.fixedDate || "",
        travellers,
        breakdown: {
          M: b.adultMale || 0,
          F: b.adultFemale || 0,
          CM: b.childMale || 0,
          CF: b.childFemale || 0,
        },
        total,
        pp: travellers > 0 ? Math.round(total / travellers) : 0,
        status: b.status,
        notes: b.notes || "",
        adminNotes: b.adminNotes || "",
      };
    });

  return (
    <BookingsManager
      rows={rows}
      counts={counts}
      todayIso={today}
      last7={lastDaysIso(7)}
      firstOfMonth={`${today.slice(0, 8)}01`}
      tripOptions={Array.from(tripOptions)}
      fixedTripTitles={Array.from(fixedTripTitles)}
      params={{ s: read("s"), status, tripFilter, dateFrom, dateTo }}
      totalCount={bookings.length}
    />
  );
}