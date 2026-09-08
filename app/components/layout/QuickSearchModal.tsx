"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Mountain, MapPin, Compass, BookOpen, Clock, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrekResult {
  title: string;
  slug: string;
  heroImage: string;
  durationDays: string;
  price: number;
  discountedPrice?: number;
  lowestPrice?: number;
  region: string;
}

interface TourResult {
  title: string;
  slug: string;
  heroImage: string;
  duration: string;
  price: number;
  discountedPrice?: number;
  lowestPrice?: number;
  destination: string;
}

interface CategoryResult {
  name: string;
  slug: string;
  description?: string;
}

interface BlogResult {
  title: string;
  slug: string;
  image: string;
  category: string;
  date: string;
}

interface SearchResults {
  treks: TrekResult[];
  tours: TourResult[];
  categories: CategoryResult[];
  blogs: BlogResult[];
}

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ treks: [], tours: [], categories: [], blogs: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults({ treks: [], tours: [], categories: [], blogs: [] });
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live search debounce
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults({ treks: [], tours: [], categories: [], blogs: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  const totalResults =
    results.treks.length + results.tours.length + results.categories.length + results.blogs.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Slide-in Search Bar Container */}
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full bg-white shadow-2xl flex flex-col max-h-[80vh] z-10 rounded-b-3xl"
        >
          <div className="w-full flex flex-col h-full max-h-[80vh] px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
            {/* Top Search Bar */}
            <div className="flex items-center px-6 py-5 border-b border-gray-100 gap-4 bg-white shrink-0">
            {loading ? (
              <Loader2 className="w-5 h-5 text-accent-amber animate-spin shrink-0" />
            ) : (
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
            )}

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treks, tours, regions, guides..."
              className="flex-1 text-base sm:text-lg font-medium text-gray-800 placeholder-gray-400 bg-transparent outline-none"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ml-2"
            >
              <span>Close</span>
              <span className="hidden sm:inline text-xs border border-gray-300 rounded px-1.5 py-0.5 ml-1">ESC</span>
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-gray-50/50">
            {/* Quick Suggestions if empty query */}
            {!query && (
              <div className="py-6 text-center">
                <p className="text-sm font-semibold text-gray-400 mb-3">Popular Searches</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {["Everest Base Camp", "Annapurna Circuit", "Langtang Valley", "Manaslu Trek", "Bhutan Tours", "Helicopter Tour"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-accent-amber hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results State */}
            {query.trim().length >= 2 && !loading && totalResults === 0 && (
              <div className="py-12 text-center">
                <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-700">No results found for &ldquo;{query}&rdquo;</h4>
                <p className="text-xs text-gray-400 mt-1 px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
                  Try searching for Everest, Annapurna, Manaslu, cultural tours, or travel guides.
                </p>
              </div>
            )}

            {/* Treks Section */}
            {results.treks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">
                  <Mountain className="w-3.5 h-3.5 text-accent-amber" />
                  <span>Treks & Expeditions ({results.treks.length})</span>
                </div>
                <div className="space-y-1.5">
                  {results.treks.map((trek) => (
                    <Link
                      key={trek.slug}
                      href={`/trekking/${trek.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                    >
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <img
                          src={trek.heroImage || "/default-hero.jpg"}
                          alt={trek.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h5 className="text-sm font-bold text-gray-800 group-hover:text-accent-amber transition-colors truncate">
                            {trek.title}
                          </h5>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" /> {trek.durationDays}
                            </span>
                            {trek.region && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-gray-400" /> {trek.region}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <div className="text-sm font-extrabold text-[#112233]">
                          US$ {(trek.lowestPrice || trek.discountedPrice || trek.price || 0).toLocaleString()}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent-amber ml-auto mt-1 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tours Section */}
            {results.tours.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">
                  <Compass className="w-3.5 h-3.5 text-accent-amber" />
                  <span>Tour Packages ({results.tours.length})</span>
                </div>
                <div className="space-y-1.5">
                  {results.tours.map((tour) => (
                    <Link
                      key={tour.slug}
                      href={`/tour/${tour.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                    >
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <img
                          src={tour.heroImage || "/default-hero.jpg"}
                          alt={tour.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h5 className="text-sm font-bold text-gray-800 group-hover:text-accent-amber transition-colors truncate">
                            {tour.title}
                          </h5>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" /> {tour.duration}
                            </span>
                            {tour.destination && (
                              <span className="capitalize text-gray-500">
                                {tour.destination}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <div className="text-sm font-extrabold text-[#112233]">
                          US$ {(tour.lowestPrice || tour.discountedPrice || tour.price || 0).toLocaleString()}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent-amber ml-auto mt-1 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories / Regions Section */}
            {results.categories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">
                  <MapPin className="w-3.5 h-3.5 text-accent-amber" />
                  <span>Destinations & Regions ({results.categories.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/trekking-types/${cat.slug}`}
                      onClick={onClose}
                      className="p-3 rounded-xl bg-gray-50 hover:bg-accent-amber/10 border border-gray-100 hover:border-accent-amber/30 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-gray-800 group-hover:text-accent-amber transition-colors">
                          {cat.name}
                        </div>
                        {cat.description && (
                          <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                            {cat.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent-amber shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Blogs / Guides Section */}
            {results.blogs.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">
                  <BookOpen className="w-3.5 h-3.5 text-accent-amber" />
                  <span>Travel Guides & Blogs ({results.blogs.length})</span>
                </div>
                <div className="space-y-1.5">
                  {results.blogs.map((blog) => (
                    <Link
                      key={blog.slug}
                      href={`/blog/${blog.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={blog.image || "/default-hero.jpg"}
                          alt={blog.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h5 className="text-sm font-bold text-gray-800 group-hover:text-accent-amber transition-colors truncate">
                            {blog.title}
                          </h5>
                          <span className="text-xs text-gray-400">{blog.category} • {blog.date}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent-amber ml-2 shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-400 rounded-b-3xl">
            <span>Navigation: Click any result to open</span>
            <span>Press ESC or click outside to close</span>
          </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
