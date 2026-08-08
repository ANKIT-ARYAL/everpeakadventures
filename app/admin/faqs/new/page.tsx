import { prisma } from "@/lib/prisma";
import FaqForm from "../FaqForm";

export const dynamic = 'force-dynamic';

export default async function NewFaqPage() {
  const [treks, tours, blogs] = await Promise.all([
    prisma.trek.findMany({ select: { slug: true, title: true }, orderBy: { title: 'asc' } }),
    prisma.tour.findMany({ select: { slug: true, title: true }, orderBy: { title: 'asc' } }),
    prisma.blogPost.findMany({ select: { slug: true, title: true }, orderBy: { title: 'asc' } }),
  ]);

  const relatedPages = [
    ...treks.filter(t => t.slug).map(t => ({ type: 'trek' as const, slug: t.slug as string, title: t.title })),
    ...tours.map(t => ({ type: 'tour' as const, slug: t.slug, title: t.title })),
    ...blogs.map(b => ({ type: 'blog' as const, slug: b.slug, title: b.title })),
  ];

  return <FaqForm isEditing={false} relatedPages={relatedPages} />;
}
