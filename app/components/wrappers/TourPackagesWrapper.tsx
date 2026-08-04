import { prisma } from "@/lib/prisma";
import TourPackagesPage from "../pages/TourPackagesPage";

export default async function TourPackagesWrapper() {
  const tours = await prisma.tour.findMany({
    orderBy: { order: 'asc' },
  });

  return <TourPackagesPage packages={tours} />;
}