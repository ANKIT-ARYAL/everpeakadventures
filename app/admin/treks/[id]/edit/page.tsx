import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrekForm from "../../TrekForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function EditTrekPage({ params }: PageProps) {
  const { id } = await params;

  const [trek, categories] = await Promise.all([
    prisma.trek.findUnique({
      where: { id },
      include: {
        groupPrices: { orderBy: { id: 'asc' } },
        departures: { orderBy: { startDate: 'asc' } },
      },
    }),
    prisma.trekCategory.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  if (!trek) notFound();

  return <TrekForm initialData={trek} isEditing={true} categories={categories} />;
}