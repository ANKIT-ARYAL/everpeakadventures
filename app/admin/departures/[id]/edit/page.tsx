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
    prisma.trek.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
    prisma.tour.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
  ]);

  if (!departure) notFound();

  return <DepartureForm initialData={departure} isEditing={true} treks={treks} tours={tours} />;
}
