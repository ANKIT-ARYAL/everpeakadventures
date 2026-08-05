import { prisma } from "@/lib/prisma";
import BestSellers from "../home/BestSellers";

export default async function BestSellersWrapper() {
  const bestSellers = await prisma.trek.findMany({
    where: { isBestSeller: true },
    orderBy: { order: 'asc' },
  });

  const data = bestSellers.length > 0
    ? bestSellers
    : await prisma.trek.findMany({
        orderBy: { order: 'asc' },
        take: 3,
      });

  const section = await prisma.homeSectionContent.findFirst();

  return (
    <BestSellers
      data={data}
      watermark={section?.bestSellersWatermark}
      title={section?.bestSellersTitle}
      subtitle={section?.bestSellersSubtitle}
    />
  );
}
