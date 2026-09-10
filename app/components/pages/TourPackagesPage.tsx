/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from 'react';
import SubpageHero from './SubpageHero';
import { Stagger, StaggerItem } from '../animations/Motion';
import TourCard from '@/app/components/ui/TourCard';

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  heroImage: string;
  duration: string;
  bestTime: string;
  grade?: string;
  difficulty?: string;
  price?: number | null;
  discountedPrice?: number | null;
  lowestPrice?: number | null;
  overview?: string | null;
  description?: string | null;
}

interface TourPackagesProps {
  packages: TourPackage[];
  currentPage: number;
  totalPages: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

export default function TourPackagesPage({ packages = [], currentPage = 1, totalPages = 1, heroTitle, heroSubtitle, heroImage }: TourPackagesProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  return (
    <div className="journey-listing min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <SubpageHero
        title={heroTitle ?? "TOUR PACKAGES"}
        subtitle={heroSubtitle ?? "Discover carefully crafted trekking, climbing, and cultural tour packages across Nepal's most iconic and hidden destinations."}
        image={heroImage ?? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop"}
      />

      {/* TOUR PACKAGES GRID */}
      <section className="py-16">
        <div className="px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
          
          {packages.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No tour packages found on this page.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <StaggerItem key={pkg.id}>
                  <TourCard tour={pkg} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {/* Dynamic Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {currentPage > 1 && (
                <a 
                  href={`/tour?page=${currentPage - 1}`}
                  className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-md transition-colors"
                >
                  ← Prev
                </a>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`/tour?page=${pageNum}`}
                  className={`w-8 h-8 rounded flex items-center justify-center font-bold text-md transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#24a0ed] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </a>
              ))}

              {currentPage < totalPages && (
                <a 
                  href={`/tour?page=${currentPage + 1}`}
                  className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-md transition-colors"
                >
                  Next →
                </a>
              )}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
