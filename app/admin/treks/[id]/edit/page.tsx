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
  });

  if (!trek) notFound();

  return <TrekForm initialData={trek} isEditing={true} />;
}