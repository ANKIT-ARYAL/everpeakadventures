import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';
import TrekCard from '@/app/components/ui/TrekCard';
import TourCard from '@/app/components/ui/TourCard';
import HeroSearchBar from '@/app/components/home/HeroSearchBar';

interface PageProps {
  params: Promise<{
    activity: string;
  }>;
}

export default async function ActivityPage({ params }: PageProps) {
  const { activity } = await params;

  // Normalize helpers matching Navbar's behavior
  function normalizeActivityFilter(value: string | null | undefined) {
    if (!value) return "";

    return value
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function matchesActivityFilter(activity: string | null | undefined, filter: string) {
    const normalizedFilter = normalizeActivityFilter(filter);

    if (!normalizedFilter) return false;

    const candidates = (activity ?? "")
      .split(/[,/]/)
      .map((part) => normalizeActivityFilter(part))
      .filter(Boolean as any);

    const GENERIC = new Set(['tour', 'tours', 'trek', 'treks', 'trip', 'trips', 'day']);

    return candidates.some((candidate) => {
      if (!candidate) return false;
      if (candidate === normalizedFilter) return true;
      if (GENERIC.has(candidate) || GENERIC.has(normalizedFilter)) return false;
      return candidate.includes(normalizedFilter) || normalizedFilter.includes(candidate);
    });
  }

  // Fetch all published treks and tours and filter using the same matching logic as the navbar
  const [allTreks, allTours, hero] = await Promise.all([
    prisma.trek.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.tour.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.activity.findFirst({ where: { slug: activity, published: true } }),
  ]);

  const treks = allTreks.filter((t) => matchesActivityFilter((t as any).activity, activity));
  const tours = allTours.filter((t) => matchesActivityFilter((t as any).activity, activity));

  // Generate a clean, human-readable title from the URL slug
  const fallbackTitle = activity
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const activityTitle = hero?.title || fallbackTitle;
  const activitySubtitle = hero?.description || `Experience the best of ${fallbackTitle} in Nepal with Ever Peak Adventures. Safety, adventure, and unparalleled memories guaranteed.`;
  const heroImage = hero?.heroImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-800 pb-24">
      
      {/* Hero Banner Section */}
      <section className="relative h-[340px] bg-[#112233] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt={activityTitle} 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 px-5 lg:px-20">
          <h1 className="text-4xl md:text-5xl font-black text-white oswald uppercase tracking-wider mb-4">
            {activityTitle}
          </h1>        
        </div>
      </section>

      {/* Region Overview Box */}
      <section className="-mt-14 relative z-20 mb-16 px-5 lg:px-20">
        <Reveal className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
          <h2 className="text-xl md:text-2xl font-black text-[#222222] oswald uppercase tracking-tight mb-4">
            {activityTitle} Overview
          </h2>
          <div className="text-gray-600 text-lg leading-relaxed space-y-4">
            <p className="font-medium text-gray-700">{activitySubtitle}</p>
            <p className="text-lg text-gray-500">
              At Ever Peak Adventures, we carefully design every itinerary for safety, comfort, and excitement. Our experienced local guides ensure proper execution throughout the trip, providing quality accommodation and personalized service.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Grid Section */}
      <section className="px-5 lg:px-20">
        {treks.length === 0 && tours.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 oswald uppercase mb-2">No Packages Found for {activityTitle}</h3>
            <p className="text-md text-gray-400">We are currently updating our packages for this activity. Check back soon!</p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            
            {/* Render Treks */}
            {treks.map((trek) => (
              <StaggerItem key={trek.id}>
                <TrekCard trek={trek as any} />
              </StaggerItem>
            ))}

            {/* Render Tours */}
            {tours.map((tour) => (
              <StaggerItem key={tour.id}>
                <TourCard tour={tour as any} />
              </StaggerItem>
            ))}
            
          </Stagger>
        )}
      </section>

    </div>
  );
}
