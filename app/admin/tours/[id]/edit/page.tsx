import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TourForm from "../../TourForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTourPage({ params }: PageProps) {
  const { id } = await params;

  const tour = await prisma.tour.findUnique({
    where: { id },
  });

  if (!tour) notFound();

  return <TourForm initialData={tour} isEditing={true} />;
}