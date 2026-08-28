import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ActivityForm from "../../ActivityForm";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hero = await prisma.activity.findUnique({ where: { id } });
  if (!hero) notFound();
  return <ActivityForm initialData={hero} isEditing={true} />;
}
