import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageForm from "../../PageForm";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: { sections: { orderBy: { order: 'asc' } } },
  });
  if (!page) notFound();
  return <PageForm initialData={page} isEditing={true} />;
}
