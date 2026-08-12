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

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Edit Tour
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update the details, pricing, and departures for this tour.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
        <TourForm initialData={tour} isEditing={true} categories={categories} />
      </div>
    </main>
  );
}