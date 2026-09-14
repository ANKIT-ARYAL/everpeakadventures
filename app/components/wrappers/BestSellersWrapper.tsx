import { prisma } from "@/lib/prisma";
import BestSellers from "../home/BestSellers";

export default async function BestSellersWrapper() {
  const bestSellers = await prisma.trek.findMany({
    where: { isBestSeller: true, published: true, title: { not: '' } },
    orderBy: { order: 'asc' },
    include: { groupPrices: true },
  });

  if (bestSellers.length === 0) return null;

  const dataWithLowestPrice = bestSellers.map((trek) => {
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

  const section = await prisma.homeSectionContent.findFirst();

  if (section && !section.published) return null;

  return (
    <BestSellers
      data={dataWithLowestPrice}
      watermark={section?.bestSellersWatermark}
      title={section?.bestSellersTitle}
      subtitle={section?.bestSellersSubtitle}
    />
  );
}