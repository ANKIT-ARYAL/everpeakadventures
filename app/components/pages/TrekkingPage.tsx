/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SubpageHero from "./SubpageHero";
import { Stagger, StaggerItem } from "../animations/Motion";
import { SearchX, FilterX } from "lucide-react";
import TrekCard from "@/app/components/ui/TrekCard";

interface Trek {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  overview?: string | null;
  heroImage: string;
  durationDays: string;
  price: number;
  discountedPrice?: number | null;
  lowestPrice?: number | null;
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
  searchFilters?: string[];
  totalFound?: number;
}

export default function TrekkingPage({
  treks = [],
  currentPage = 1,
  totalPages = 1,
  heroTitle,
  heroSubtitle,
  heroImage,
  searchFilters = [],
  totalFound = 0,
}: TrekkingPageProps) {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const hasSearchFilters = searchFilters.length > 0;

  // Clear filters through client navigation without requiring a reload.
  const handleClearFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/trekking");
  };

  return (
    <div className="journey-listing min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      {/* HERO SECTION */}
      <SubpageHero
        title={heroTitle ?? "TREKKING IN NEPAL"}
        subtitle={
          heroSubtitle ??
          "\"Experience the world's most iconic trekking routes through Nepal's breathtaking Himalayan landscapes.\""
        }
        image={
          heroImage ??
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
        }
      />

      {/* TREKKING PACKAGES GRID */}
      <section className="py-12 lg:py-16">
        <div className="site-container px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
          {/* SEARCH SUMMARY BAR (Only visible if a search is active) */}
          {hasSearchFilters && (
            <div className="mb-10 bg-white rounded-2xl p-6 md:px-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#112233] mb-1.5 tracking-tight">
                  Search results for:{" "}
                  <span className="text-[#24a0ed]">
                    {searchFilters.join(" • ")}
                  </span>
                </h2>
                <p className="text-gray-500 font-medium text-sm">
                  Found {totalFound} {totalFound === 1 ? "trek" : "treks"}{" "}
                  matching your criteria.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold text-sm rounded-xl transition-colors whitespace-nowrap self-start md:self-center cursor-pointer"
              >
                <FilterX className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}

          {treks.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchX className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-[#112233] mb-3">
                No treks found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                We could not find any treks that perfectly match your current
                filters. Try adjusting your search or clearing some filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold py-3 px-8 rounded-xl transition-colors cursor-pointer"
              >
                View All Treks
              </button>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {treks.map((trek) => (
                <StaggerItem key={trek.id}>
                  <TrekCard trek={trek} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {/* Dynamic Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              {/* Previous Button */}
              {currentPage > 1 && (
                <a
                  href={`/trekking?page=${currentPage - 1}`}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#24a0ed] hover:border-[#24a0ed] font-bold text-md transition-all"
                >
                  ← Prev
                </a>
              )}

              {/* Numbered Page Links */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <a
                    key={pageNum}
                    href={`/trekking?page=${pageNum}`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-md transition-all ${
                      currentPage === pageNum
                        ? "bg-[#24a0ed] text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#24a0ed] hover:border-[#24a0ed]"
                    }`}
                  >
                    {pageNum}
                  </a>
                ),
              )}

              {/* Next Button */}
              {currentPage < totalPages && (
                <a
                  href={`/trekking?page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#24a0ed] hover:border-[#24a0ed] font-bold text-md transition-all"
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
