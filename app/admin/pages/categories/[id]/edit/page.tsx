import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageCategoryForm from "../../../../components/PageCategoryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditPageCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const [category, parents] = await Promise.all([
    prisma.pageCategory.findUnique({ where: { id } }),
    prisma.pageCategory.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
    }),
  ]);

  if (!category) notFound();

  return <PageCategoryForm parents={parents} initialData={category} isEditing />;
}