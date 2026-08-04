import { prisma } from "@/lib/prisma";
import BestSellers from "../home/BestSellers";

export default async function BestSellersWrapper() {
  const bestSellers = await prisma.trek.findMany({
    orderBy: { order: 'asc' },
    take: 3,
  });

  return <BestSellers data={bestSellers} />;
}