import { prisma } from "@/lib/prisma";
import TrekForm from "../TrekForm";

export const dynamic = 'force-dynamic';

export default async function NewTrekPage() {
  const categories = await prisma.trekCategory.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });
  return <TrekForm isEditing={false} categories={categories} />;
}