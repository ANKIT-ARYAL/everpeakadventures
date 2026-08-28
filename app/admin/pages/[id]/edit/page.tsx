import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ContentPageForm from "../../../components/ContentPageForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditContentPagePage({ params }: PageProps) {
  const { id } = await params;

  const [page, categories] = await Promise.all([
    prisma.contentPage.findUnique({ where: { id } }),
    prisma.pageCategory.findMany({
      orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
    }),
  ]);

  if (!page) notFound();

  const depthById = new Map<string, number>();
  for (const c of categories) {
    depthById.set(c.id, c.parentId ? (depthById.get(c.parentId) ?? 0) + 1 : 0);
  }

  const options = categories.map((c) => ({
    id: c.id,
    name: c.name,
    depth: depthById.get(c.id) ?? 0,
  }));

  return <ContentPageForm categories={options} initialData={page} isEditing />;
}