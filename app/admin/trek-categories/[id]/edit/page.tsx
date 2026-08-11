import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "../../../components/CategoryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTrekCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await prisma.trekCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <CategoryForm
      title="Edit Trekking Category"
      subtitle={`Editing "${category.name}"`}
      backHref="/admin/trek-categories"
      createUrl="/api/trek-categories"
      updateUrl={`/api/trek-categories/${category.id}`}
      initialData={category}
      isEditing
    />
  );
}