import { prisma } from "@/lib/prisma";
import FeaturedTreks from "../home/FeaturedTreks";

export default async function FeaturedTreksWrapper() {
  const treks = await prisma.trek.findMany({
    orderBy: { order: 'asc' },
    take: 4,
  });

  const section = await prisma.homeSectionContent.findFirst();

  return (
    <FeaturedTreks
      treks={treks}
      label={section?.featuredTreksLabel}
      title={section?.featuredTreksTitle}
    />
  );
} 