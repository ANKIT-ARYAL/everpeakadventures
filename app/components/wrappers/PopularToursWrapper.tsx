import { prisma } from "@/lib/prisma";
import PopularTours from "../home/PopularTours";

export default async function PopularToursWrapper() {
  const tours = await prisma.tour.findMany({
    orderBy: { order: 'asc' },
  });

  return <PopularTours tours={tours} />;
}