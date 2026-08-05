import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrustItemForm from "../../TrustItemForm";

export default async function EditTrustItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.trustItem.findUnique({ where: { id } });
  if (!item) notFound();
  return <TrustItemForm initialData={item} isEditing={true} />;
}
