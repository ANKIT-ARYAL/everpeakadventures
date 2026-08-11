import { prisma } from "@/lib/prisma";
import ContentPageForm from "../../components/ContentPageForm";

export const dynamic = 'force-dynamic';

export default async function NewContentPagePage() {
  const categories = await prisma.pageCategory.findMany({
    orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
  });

  const depthById = new Map<string, number>();
  for (const c of categories) {
    depthById.set(c.id, c.parentId ? (depthById.get(c.parentId) ?? 0) + 1 : 0);
  }

  const options = categories.map((c) => ({
    id: c.id,
    name: c.name,
    depth: depthById.get(c.id) ?? 0,
  }));

  return <ContentPageForm categories={options} />;
}