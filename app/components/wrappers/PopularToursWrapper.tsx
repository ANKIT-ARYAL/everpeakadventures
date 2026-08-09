import { prisma } from "@/lib/prisma";
import PopularTours from "../home/PopularTours";

export default async function PopularToursWrapper() {
  const tours = await prisma.tour.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  const section = await prisma.homeSectionContent.findFirst();

  if (section && !section.published) return null;

  return (
    <PopularTours
      tours={tours}
      watermark={section?.popularToursWatermark}
      title={section?.popularToursTitle}
      subtitle={section?.popularToursSubtitle}
    />
  );
}