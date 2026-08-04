import { prisma } from "@/lib/prisma";
import FeaturedTreks from "../home/FeaturedTreks";

export default async function FeaturedTreksWrapper() {
  const treks = await prisma.trek.findMany({
    orderBy: { order: 'asc' },
    take: 4,
  });

  return <FeaturedTreks treks={treks} />;
}