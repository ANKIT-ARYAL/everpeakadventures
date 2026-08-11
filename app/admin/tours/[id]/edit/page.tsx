import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TourForm from "../../TourForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function EditTourPage({ params }: PageProps) {
  const { id } = await params;

  const [tour, categories] = await Promise.all([
    prisma.tour.findUnique({
      where: { id },
      include: {
        groupPrices: { orderBy: { id: 'asc' } },
        departures: { orderBy: { startDate: 'asc' } },
      },
    }),
    prisma.tourCategory.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  if (!tour) notFound();

  return <TourForm initialData={tour} isEditing={true} categories={categories} />;
}