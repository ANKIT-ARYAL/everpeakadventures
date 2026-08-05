import { prisma } from "@/lib/prisma";
import PopularTours from "../home/PopularTours";

export default async function PopularToursWrapper() {
  const tours = await prisma.tour.findMany({
    orderBy: { order: 'asc' },
  });

  const section = await prisma.homeSectionContent.findFirst();

  return (
    <PopularTours
      tours={tours}
      watermark={section?.popularToursWatermark}
      title={section?.popularToursTitle}
      subtitle={section?.popularToursSubtitle}
    />
  );
}