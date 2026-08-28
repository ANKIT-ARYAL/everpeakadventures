import { prisma } from "@/lib/prisma";
import FeaturedTreks from "../home/FeaturedTreks";

export default async function FeaturedTreksWrapper() {
  const treks = await prisma.trek.findMany({
    where: { published: true, title: { not: '' } },
    orderBy: { order: 'asc' },
    take: 3,
    include: { groupPrices: true },
  });

  const section = await prisma.homeSectionContent.findFirst();

  if (section && !section.published) return null;

  const dataWithLowestPrice = treks.map((trek) => {
    let minPrice = trek.discountedPrice ?? trek.price;
    if (trek.groupPrices && trek.groupPrices.length > 0) {
      trek.groupPrices.forEach(gp => {
        const numMatch = gp.price.replace(/,/g, '').match(/\d+(\.\d+)?/);
        if (numMatch) {
          const p = parseFloat(numMatch[0]);
          if (p > 0 && p < minPrice) minPrice = p;
        }
      });
    }
    return { ...trek, lowestPrice: minPrice };
  });

  return (
    <FeaturedTreks
      treks={dataWithLowestPrice}
      label={section?.featuredTreksLabel}
      title={section?.featuredTreksTitle}
    />
  );
}