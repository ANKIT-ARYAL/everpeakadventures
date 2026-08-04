import { prisma } from "@/lib/prisma";
import TrekkingPage from "../pages/TrekkingPage";

export default async function TrekkingPageWrapper() {
  const treks = await prisma.trek.findMany({
    orderBy: { order: 'asc' },
  });

  return <TrekkingPage treks={treks} />;
}