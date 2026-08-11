import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryLanding from "@/app/components/pages/CategoryLanding";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function TourCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const category = await prisma.tourCategory.findFirst({
    where: { slug, published: true },
  });

  if (!category) notFound();

  const tours = await prisma.tour.findMany({
    where: { published: true, regions: { has: category.name } },
    orderBy: { order: 'asc' },
  });

  return (
    <CategoryLanding
      title={category.name}
      subtitle="Tour packages in this category"
      heroImage={category.image}
      categoryImage={category.image}
      descriptionHtml={category.description}
      items={tours.map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        heroImage: t.heroImage,
        duration: t.duration,
        price: t.discountedPrice ?? t.price,
        discountedPrice: t.discountedPrice,
      }))}
      basePath="/tours"
    />
  );
}