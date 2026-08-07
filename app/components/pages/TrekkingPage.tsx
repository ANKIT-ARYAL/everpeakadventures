import React from 'react';
import Link from 'next/link';
import SubpageHero from './SubpageHero';
import { Stagger, StaggerItem } from '../animations/Motion';

interface Trek {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  heroImage: string;
  durationDays: string;
  price: number;
  discountedPrice?: number | null;
  region: string;
  difficulty: string;
}

interface TrekkingPageProps {
  treks: Trek[];
  currentPage: number;
  totalPages: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

export default function TrekkingPage({ treks = [], currentPage = 1, totalPages = 1, heroTitle, heroSubtitle, heroImage }: TrekkingPageProps) {
  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <SubpageHero
        title={heroTitle ?? "TREKKING IN NEPAL"}
        subtitle={heroSubtitle ?? "\"Experience the world's most iconic trekking routes through Nepal's breathtaking Himalayan landscapes.\""}
        image={heroImage ?? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"}
      />

      {/* TREKKING PACKAGES GRID */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          
          {treks.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No trekking packages found on this page.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {treks.map((trek) => (
                <StaggerItem
                  key={trek.id} 
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-lg transition-all hover:scale-105"
                >
                  <Link 
                        href={`/trekking/${trek.slug ? trek.slug : trek.id}`}>
                  {/* Image & Price Ribbon */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={trek.heroImage} 
                      alt={trek.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {trek.price && (
                      <div className="absolute top-0 left-0 bg-[#d93838] text-white font-bold text-xs px-3 py-1.5 rounded-br-lg shadow-sm oswald">
                        ${(trek.discountedPrice ?? trek.price).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-[#222222] text-sm md:text-base line-clamp-2 mb-3 group-hover:text-[#24a0ed] transition-colors">
                        {trek.title}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>Duration : {trek.durationDays}</span>
                      <button
                        className="text-[#24a0ed] hover:underline font-bold"
                      >
                        Explore →
                      </button>
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
              {/* Previous Button */}
              {currentPage > 1 && (
                <Link 
                  href={`/trekking?page=${currentPage - 1}`}
                  className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs transition-colors"
                >
                  ← Prev
                </Link>
              )}

              {/* Numbered Page Links */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/trekking?page=${pageNum}`}
                  className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#24a0ed] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}

              {/* Next Button */}
              {currentPage < totalPages && (
                <Link 
                  href={`/trekking?page=${currentPage + 1}`}
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