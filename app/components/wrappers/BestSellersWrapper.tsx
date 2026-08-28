import { unstable_cache } from 'next/cache';
import { prisma } from "@/lib/prisma";
import BestSellers from "../home/BestSellers";

const getCachedBestSellers = unstable_cache(
  async () => prisma.trek.findMany({
    where: { isBestSeller: true, published: true, title: { not: '' } },
    orderBy: { order: 'asc' },
    include: { groupPrices: true },
  }),
  ['best-sellers'],
  { revalidate: 60, tags: ['treks'] }
);

const getCachedFallback = unstable_cache(
  async () => prisma.trek.findMany({
    where: { published: true, title: { not: '' } },
    orderBy: { order: 'asc' },
    take: 3,
    include: { groupPrices: true },
  }),
  ['best-sellers-fallback'],
  { revalidate: 60, tags: ['treks'] }
);

const getCachedSection = unstable_cache(
  async () => prisma.homeSectionContent.findFirst(),
  ['home-section-content'],
  { revalidate: 60, tags: ['sections'] }
);

export default async function BestSellersWrapper() {
  const bestSellers = await getCachedBestSellers();

  const rawData = bestSellers.length > 0
    ? bestSellers
    : await getCachedFallback();

  const dataWithLowestPrice = rawData.map((trek) => {
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

  const section = await getCachedSection();

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