import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import WhyChooseUsItemForm from "../../WhyChooseUsItemForm";

export const dynamic = 'force-dynamic';

export default async function EditWhyChooseUsItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.whyChooseUsItem.findUnique({ where: { id } });
  if (!item) notFound();
  return <WhyChooseUsItemForm initialData={item} isEditing={true} />;
}
