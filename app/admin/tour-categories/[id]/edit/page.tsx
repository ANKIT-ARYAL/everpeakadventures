import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "../../../components/CategoryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTourCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await prisma.tourCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <CategoryForm
      title="Edit Tour Category"
      subtitle={`Editing "${category.name}"`}
      backHref="/admin/tour-categories"
      createUrl="/api/tour-categories"
      updateUrl={`/api/tour-categories/${category.id}`}
      initialData={category}
      isEditing
    />
  );
}