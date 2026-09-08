/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import SubpageHero from './SubpageHero';
import { Stagger, StaggerItem } from '../animations/Motion';

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  heroImage: string;
  duration: string;
  bestTime: string;
  price?: number | null;
  discountedPrice?: number | null;
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
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <StaggerItem
                  key={pkg.id} 
                  className="journey-card bg-white rounded-xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-lg transition-all"
                >
                  <Link href={`/tour/${pkg.slug ? pkg.slug : pkg.id}`}>
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img 
                        src={pkg.heroImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
                        alt={pkg.title}
                        className={`w-full h-full ${!pkg.heroImage ? 'object-contain p-4 bg-white' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                      />
                      {pkg.price && (
                        <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-sm text-white font-sans font-black text-sm px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                          US$ {(pkg.discountedPrice ?? pkg.price).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-bold text-[#222222] text-xl line-clamp-2 mb-4 group-hover:text-[#24a0ed] transition-colors min-h-[56px]">
                          {pkg.title}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-center mb-5 text-md">
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Duration</span>
                          <span className="font-bold text-[#222222] text-sm">{pkg.duration}</span>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Best Time</span>
                          <span className="font-bold text-[#222222] text-sm">{pkg.bestTime || 'Anytime'}</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#112233] text-white font-bold py-3 rounded-lg text-center uppercase tracking-wider text-sm transition-colors group-hover:bg-[#24a0ed]">
                        Explore Tour
                      </div>
                    </div>
                  </Link>
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
