import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FaqForm from "../../FaqForm";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) notFound();
  return <FaqForm initialData={faq} isEditing={true} />;
}
