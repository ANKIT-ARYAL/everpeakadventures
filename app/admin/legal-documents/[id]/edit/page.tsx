import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LegalDocumentForm from "../../LegalDocumentForm";

export default async function EditLegalDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await prisma.legalDocument.findUnique({ where: { id } });
  if (!document) notFound();
  return <LegalDocumentForm initialData={document} isEditing={true} />;
}
