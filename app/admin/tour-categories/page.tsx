import { prisma } from "@/lib/prisma";
import CategoryList from "../components/CategoryList";

export const dynamic = 'force-dynamic';

export default async function AdminTourCategoriesPage() {
  const categories = await prisma.tourCategory.findMany({ orderBy: { order: 'asc' } });

  return (
    <CategoryList
      title="Tour Categories"
      description="Add new tour categories, edit and remove them with a description for each."
      addLabel="Add New Tour Category"
      addHref="/admin/tour-categories/new"
      emptyLabel="No tour categories found. Add your first category."
      model="tour-categories"
      resource="tour-categories"
      items={categories}
      viewPrefix="/tour-category"
    />
  );
}