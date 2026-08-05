import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DepartureForm from "../../DepartureForm";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTourPage({ params }: PageProps) {
  const { id } = await params;

  const departure = await prisma.fixedDeparture.findUnique({
    where: { id },
  });

  if (!departure) notFound();

  return <DepartureForm initialData={departure} isEditing={true} />;
}