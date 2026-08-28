import { prisma } from "@/lib/prisma";
import { stripHtml } from '@/lib/stripHtml';
import TrekkingPage from "../pages/TrekkingPage";

import { unstable_cache } from 'next/cache';

const getCachedTreks = unstable_cache(
  async () => {
    return await prisma.trek.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  ['all-published-treks'],
  { revalidate: 60, tags: ['treks'] }
);

interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    destination?: string;
    duration?: string;
    difficulty?: string;
    price?: string;
  }>;
}

export default async function TrekkingPageWrapper({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const query = (resolvedParams?.q || '').trim().toLowerCase();
  const dest = (resolvedParams?.destination || '').trim().toLowerCase();
  const dur = (resolvedParams?.duration || '').trim();
  const diff = (resolvedParams?.difficulty || '').trim().toLowerCase();
  const maxPrice = Number(resolvedParams?.price) || 0;
  const pageSize = 12;

  const allTreks = await getCachedTreks();

  // Filter in-memory
  const filteredTreks = allTreks.filter((t) => {
    let match = true;

    if (query) {
      match = match && (
        t.title.toLowerCase().includes(query) ||
        stripHtml(t.description).toLowerCase().includes(query) ||
        (t.region || '').toLowerCase().includes(query)
      );
    }

    if (dest) {
      match = match && (t.region || '').toLowerCase().includes(dest);
    }

    if (dur) {
      const daysStr = (t.durationDays || '').replace(/[^0-9]/g, '');
      const days = parseInt(daysStr, 10) || 0;
      if (dur === '1-7') match = match && (days >= 1 && days <= 7);
      else if (dur === '8-14') match = match && (days >= 8 && days <= 14);
      else if (dur === '15+') match = match && (days >= 15);
    }

    if (diff) {
      match = match && (t.difficulty || '').toLowerCase().includes(diff);
    }

    if (maxPrice > 0) {
      const trekPrice = t.discountedPrice ?? t.price;
      if (trekPrice !== null && trekPrice !== undefined) {
        match = match && (trekPrice <= maxPrice);
      }
    }

    return match;
  });

  const totalPages = Math.ceil(filteredTreks.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const paginatedTreks = filteredTreks.slice(startIndex, startIndex + pageSize);

  const getCachedHero = unstable_cache(
    async () => prisma.subpageHero.findFirst({ where: { slug: 'trekking', published: true } }),
    ['subpage-hero-trekking'],
    { revalidate: 60, tags: ['hero'] }
  );
  
  const hero = await getCachedHero();

  // --- Search Summary Logic ---
  const filters: string[] = [];
  if (query) filters.push(`"${resolvedParams.q}"`);
  if (dest) filters.push(`${dest.charAt(0).toUpperCase() + dest.slice(1)} Region`);
  if (dur) filters.push(`${dur.replace("+", " or more")} Days`);
  if (diff) filters.push(`${diff.charAt(0).toUpperCase() + diff.slice(1)} Difficulty`);
  if (maxPrice > 0) filters.push(`Under $${maxPrice}`);

  // Set the hero title to the destination if searched, otherwise fallback to DB/default
  let displayTitle = hero?.title ?? "TREKKING IN NEPAL";
  if (dest) {
    displayTitle = `${dest.charAt(0).toUpperCase() + dest.slice(1)} Region`;
  } else if (query) {
    displayTitle = `Search: "${resolvedParams.q}"`;
  }

  // Restore the normal subtitle to the hero section
  const displaySubtitle = hero?.subtitle ?? "\"Experience the world's most iconic trekking routes through Nepal's breathtaking Himalayan landscapes.\"";

  return (
    <TrekkingPage 
      treks={paginatedTreks} 
      currentPage={safePage} 
      totalPages={totalPages} 
      heroTitle={displayTitle}
      heroSubtitle={displaySubtitle}
      heroImage={hero?.image ?? undefined}
      searchFilters={filters}
      totalFound={filteredTreks.length}
    />
  );
}