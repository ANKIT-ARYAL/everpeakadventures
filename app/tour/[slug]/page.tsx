import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, MapPin, CheckCircle2, 
  XCircle, Utensils, Award, Mountain 
} from 'lucide-react';
import TourGallerySlider from './TourGallerySlider';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const tour = await prisma.tour.findUnique({
    where: { slug },
  });

  if (!tour) notFound();

  // Fetch related tours for the bottom section
  const relatedTours = await prisma.tour.findMany({
    where: { destination: tour.destination, NOT: { id: tour.id } },
    take: 4,
    orderBy: { order: 'asc' },
  });

  // Gallery array for the slider
  const galleryImages = (tour.gallery || []).filter(Boolean);
  
  // Safe cast for itinerary Json field
  const itineraryDays = Array.isArray(tour.itinerary) ? (tour.itinerary as any[]) : [];

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans text-gray-800 pb-24">
      
      {/* 1. TOP HERO TITLE BANNER */}
      <section className="relative py-20 bg-[#112233] text-white text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider oswald">
            {tour.title}
          </h1>
        </div>
      </section>

      {/* 2. MAIN GRID */}
      <section className="max-w-[1200px] mx-auto px-5 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: STICKY BOOKING CARD */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-6 sticky top-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Price From</span>
                  <span className="text-3xl font-black text-[#112233] oswald">
                    ${tour.price ? tour.price.toLocaleString() : '1,199'}
                  </span>
                </div>
                <span className="bg-amber-50 text-amber-700 font-bold text-[10px] px-2.5 py-1 rounded border border-amber-200">
                  Best Price
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Destination</span>
                  <span className="font-bold uppercase text-[#112233]">{tour.destination}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Duration</span>
                  <span className="font-bold text-[#112233]">{tour.duration}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Best Season</span>
                  <span className="font-bold text-[#112233]">{tour.bestTime}</span>
                </div>
              </div>

              <Link 
                href={`/booking-form/?trip_id=${tour.id}`}
                className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-3.5 rounded-lg text-center transition-colors uppercase tracking-wider block text-xs shadow-sm"
              >
                Book This Tour Now
              </Link>
            </div>

            <div className="bg-[#112233] text-white rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-xs oswald border-b border-gray-700 pb-2">
                All In Queries / Help
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#1c2e40] rounded-lg font-medium flex items-center justify-between">
                  <span>General Inquiry</span><span>→</span>
                </div>
                <div className="p-3 bg-[#1c2e40] rounded-lg font-medium flex items-center justify-between">
                  <span>Instant WhatsApp</span><span>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FULL-WIDTH 2-IMAGE AUTO-SLIDER */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Full Width Auto-Swiping Slider Component */}
            <div className="w-full">
              <TourGallerySlider mainImage={tour.image} galleryImages={galleryImages} />
            </div>

            {/* 6-Icon Metadata Bar */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Clock className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Duration</span>
                  <span className="font-bold text-gray-800">{tour.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Calendar className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Best Time</span>
                  <span className="font-bold text-gray-800">{tour.bestTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Award className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Grade</span>
                  <span className="font-bold text-gray-800">{tour.grade}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Mountain className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Max Altitude</span>
                  <span className="font-bold text-gray-800">{tour.maxAltitude}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Utensils className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Meals</span>
                  <span className="font-bold text-gray-800">{tour.meals}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <MapPin className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Start / End</span>
                  <span className="font-bold text-gray-800">{tour.startPoint}</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">Trip Overview</h2>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed whitespace-pre-line">{tour.overview}</p>
            </div>

            {/* Highlights */}
            {tour.highlights?.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">Highlights</h2>
                <ul className="space-y-2.5">
                  {tour.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                      <span className="text-[#24a0ed] font-bold">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {itineraryDays.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">Itinerary</h2>
                <div className="space-y-3">
                  {itineraryDays.map((day: any, i: number) => (
                    <details key={i} className="group p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <summary className="font-bold text-xs text-[#112233] cursor-pointer flex items-center justify-between">
                        <span>Day {day.day || i + 1}: {day.title}</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200 leading-relaxed">{day.desc}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-bold oswald uppercase text-emerald-700 border-b pb-2 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Package Include
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {tour.inclusions?.map((inc: string, i: number) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-emerald-600 font-bold">•</span> {inc}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-bold oswald uppercase text-rose-700 border-b pb-2 flex items-center gap-2 text-xs">
                  <XCircle className="w-4 h-4" /> Package Exclude
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {tour.exclusions?.map((exc: string, i: number) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-rose-600 font-bold">•</span> {exc}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. RELATED TOURS */}
      {relatedTours.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-20">
          <h2 className="text-2xl font-black oswald uppercase text-[#112233] mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTours.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group">
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                  <h3 className="font-bold text-xs text-[#112233] line-clamp-2 group-hover:text-[#24a0ed] transition-colors">{item.title}</h3>
                  <Link href={`/tour/${item.slug}`} className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-2 rounded-lg text-center uppercase tracking-wider text-[11px] block transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}