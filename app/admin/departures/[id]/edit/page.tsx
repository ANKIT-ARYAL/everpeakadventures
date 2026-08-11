import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DepartureForm from "../../DepartureForm";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDeparturePage({ params }: PageProps) {
  const { id } = await params;

  const [departure, treks, tours] = await Promise.all([
    prisma.departure.findUnique({ where: { id } }),
    prisma.trek.findMany({
      select: { id: true, title: true, groupPrices: { select: { groupSize: true } } },
      orderBy: { title: 'asc' },
    }),
    prisma.tour.findMany({
      select: { id: true, title: true, groupPrices: { select: { groupSize: true } } },
      orderBy: { title: 'asc' },
    }),
  ]);

  if (!departure) notFound();

  const mapTrips = (trips: any[]): { id: string; title: string; groupSizes: string[] }[] =>
    trips.map((t: any) => ({
      id: t.id,
      title: t.title,
      groupSizes: Array.from(new Set((t.groupPrices || []).map((g: any) => g.groupSize as string).filter(Boolean))) as string[],
    }));

  return <DepartureForm initialData={departure} isEditing={true} treks={mapTrips(treks)} tours={mapTrips(tours)} />;
}
