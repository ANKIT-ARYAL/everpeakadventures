import { prisma } from "@/lib/prisma";
import CategoryList from "../components/CategoryList";

export const dynamic = 'force-dynamic';

export default async function AdminTrekCategoriesPage() {
  const [categories, treks] = await Promise.all([
    prisma.trekCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.trek.findMany({
      select: { id: true, title: true, published: true, regions: true },
      orderBy: { title: 'asc' },
    }),
  ]);

  const childrenByItem: Record<string, { id: string; label: string; href: string; published?: boolean }[]> = {};
  for (const cat of categories) {
    const assigned = treks
      .filter((t) => t.regions.includes(cat.name))
      .map((t) => ({
        id: t.id,
        label: t.title,
        href: `/admin/treks/${t.id}/edit`,
        published: t.published,
      }));
    childrenByItem[cat.id] = assigned;
  }

  return (
    <CategoryList
      title="Trekking Categories"
      description="Add new trekking categories, edit and remove them with a description for each."
      addLabel="Add New Trekking Category"
      addHref="/admin/trek-categories/new"
      emptyLabel="No trekking categories found. Add your first category."
      model="trek-categories"
      resource="trek-categories"
      items={categories}
      viewPrefix="/trekking-category"
      childrenLabel="Treks"
      childrenByItem={childrenByItem}
    />
  );
}