import { prisma } from "@/lib/prisma";
import FeaturedTreks from "../home/FeaturedTreks";

export default async function FeaturedTreksWrapper() {
  const treks = await prisma.trek.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    take: 4,
  });

  const section = await prisma.homeSectionContent.findFirst();

  if (section && !section.published) return null;

  return (
    <FeaturedTreks
      treks={treks}
      label={section?.featuredTreksLabel}
      title={section?.featuredTreksTitle}
    />
  );
}