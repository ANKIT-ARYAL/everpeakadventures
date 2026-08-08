import React from 'react';
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
  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <SubpageHero
        title={heroTitle ?? "TOUR PACKAGES"}
        subtitle={heroSubtitle ?? "Discover carefully crafted trekking, climbing, and cultural tour packages across Nepal's most iconic and hidden destinations."}
        image={heroImage ?? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop"}
      />

      {/* TOUR PACKAGES GRID */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          
          {packages.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No tour packages found on this page.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <StaggerItem
                  key={pkg.id} 
                  className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-lg transition-shadow"
                >
                  <Link 
                      href={`/tour/${pkg.slug}`}>
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={pkg.heroImage} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-[#222222] text-sm md:text-base line-clamp-2 mb-4 group-hover:text-[#24a0ed] transition-colors min-h-[44px]">
                        {pkg.title}
                      </h3>
                    </div>

                    {/* Metadata Box (Duration & Best Time) */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-center mb-4 text-xs">
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Duration</span>
                        <span className="font-bold text-[#222222]">{pkg.duration}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Best Time</span>
                        <span className="font-bold text-[#222222] truncate block">{pkg.bestTime}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <span                      
                      className="w-full bg-[#1c2e40] hover:bg-[#24a0ed] text-white font-bold text-xs py-2.5 rounded-lg text-center transition-colors uppercase tracking-wider block"
                    >
                      View Details
                    </span>
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
                <Link 
                  href={`/tour?page=${currentPage - 1}`}
                  className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs transition-colors"
                >
                  ← Prev
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/tour?page=${pageNum}`}
                  className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#24a0ed] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}

              {currentPage < totalPages && (
                <Link 
                  href={`/tour?page=${currentPage + 1}`}
                  className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}