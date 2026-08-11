import { prisma } from "@/lib/prisma";
import PageCategoryForm from "../../../components/PageCategoryForm";

export const dynamic = 'force-dynamic';

export default async function NewPageCategoryPage() {
  const parents = await prisma.pageCategory.findMany({
    where: { parentId: null },
    orderBy: { order: 'asc' },
  });

  return <PageCategoryForm parents={parents} />;
}