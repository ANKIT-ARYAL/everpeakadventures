import { prisma } from "@/lib/prisma";
import DepartureForm from "../DepartureForm";

export const dynamic = 'force-dynamic';

export default async function NewDeparturePage() {
  const [treks, tours] = await Promise.all([
    prisma.trek.findMany({
      select: { id: true, title: true, groupPrices: { select: { groupSize: true } } },
      orderBy: { title: 'asc' },
    }),
    prisma.tour.findMany({
      select: { id: true, title: true, groupPrices: { select: { groupSize: true } } },
      orderBy: { title: 'asc' },
    }),
  ]);

  const mapTrips = (trips: any[]): { id: string; title: string; groupSizes: string[] }[] =>
    trips.map((t: any) => ({
      id: t.id,
      title: t.title,
      groupSizes: Array.from(new Set((t.groupPrices || []).map((g: any) => g.groupSize as string).filter(Boolean))) as string[],
    }));

  return <DepartureForm isEditing={false} treks={mapTrips(treks)} tours={mapTrips(tours)} />;
}
