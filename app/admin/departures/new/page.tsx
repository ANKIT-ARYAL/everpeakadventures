import { prisma } from "@/lib/prisma";
import DepartureForm from "../DepartureForm";

export const dynamic = 'force-dynamic';

export default async function NewDeparturePage() {
  const [treks, tours] = await Promise.all([
    prisma.trek.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
    prisma.tour.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
  ]);

  return <DepartureForm isEditing={false} treks={treks} tours={tours} />;
}
