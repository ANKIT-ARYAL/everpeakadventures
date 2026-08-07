import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrekForm from "../../TrekForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTrekPage({ params }: PageProps) {
  const { id } = await params;

  const trek = await prisma.trek.findUnique({
    where: { id },
    include: {
      groupPrices: { orderBy: { id: 'asc' } },
      fixedSchedules: { orderBy: { id: 'asc' } },
    },
  });

  if (!trek) notFound();

  return <TrekForm initialData={trek} isEditing={true} />;
}