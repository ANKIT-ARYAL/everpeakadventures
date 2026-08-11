import { prisma } from "@/lib/prisma";
import TourForm from '../TourForm';

export const dynamic = 'force-dynamic';

export default async function NewTourPage() {
  const categories = await prisma.tourCategory.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });
  return <TourForm isEditing={false} categories={categories} />;
}