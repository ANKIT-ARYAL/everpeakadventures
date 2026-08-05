import { prisma } from "@/lib/prisma";
import TourPackagesPage from "../pages/TourPackagesPage";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TourPackagesWrapper({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const pageSize = 12;

  const allTours = await prisma.tour.findMany({
    orderBy: { order: 'asc' },
  });

  const totalPages = Math.ceil(allTours.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTours = allTours.slice(startIndex, startIndex + pageSize);

  return (
    <TourPackagesPage 
      packages={paginatedTours} 
      currentPage={currentPage} 
      totalPages={totalPages} 
    />
  );
}