import { prisma } from "@/lib/prisma";
import TrekkingPage from "../pages/TrekkingPage";

export const dynamic = 'force-dynamic'; // Forces Next.js to re-evaluate searchParams on every request

interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
}

export default async function TrekkingPageWrapper({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const query = (resolvedParams?.q || '').trim().toLowerCase();
  const pageSize = 12;

  const allTreks = await prisma.trek.findMany({
    orderBy: { order: 'asc' },
  });

  const filteredTreks = query
    ? allTreks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description || '').toLowerCase().includes(query) ||
          (t.region || '').toLowerCase().includes(query)
      )
    : allTreks;

  const totalPages = Math.ceil(filteredTreks.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const paginatedTreks = filteredTreks.slice(startIndex, startIndex + pageSize);

  const hero = await prisma.subpageHero.findUnique({ where: { slug: 'trekking' } });

  return (
    <TrekkingPage 
      treks={paginatedTreks} 
      currentPage={safePage} 
      totalPages={totalPages} 
      heroTitle={hero?.title}
      heroSubtitle={hero?.subtitle ?? undefined}
      heroImage={hero?.image ?? undefined}
    />
  );
}