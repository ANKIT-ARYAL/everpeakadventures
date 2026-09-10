import { prisma } from "@/lib/prisma";
import TrekForm from "../TrekForm";

export const dynamic = 'force-dynamic';

export default async function NewTrekPage() {
  const [categories, activities] = await Promise.all([
    prisma.trekCategory.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    prisma.activity.findMany({
      select: { slug: true, title: true },
      orderBy: { title: 'asc' },
    }),
  ]);

  return <TrekForm isEditing={false} categories={categories} activities={activities} />;
}