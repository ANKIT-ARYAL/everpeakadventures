import { prisma } from "@/lib/prisma";
import TrekkingPage from "../pages/TrekkingPage";

export const dynamic = 'force-dynamic'; // Forces Next.js to re-evaluate searchParams on every request

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TrekkingPageWrapper({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const pageSize = 12;

  const allTreks = await prisma.trek.findMany({
    orderBy: { order: 'asc' },
  });

  const totalPages = Math.ceil(allTreks.length / pageSize) || 1;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTreks = allTreks.slice(startIndex, startIndex + pageSize);

  return (
    <TrekkingPage 
      treks={paginatedTreks} 
      currentPage={currentPage} 
      totalPages={totalPages} 
    />
  );
}