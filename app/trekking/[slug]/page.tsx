import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, Clock, CheckCircle2, XCircle, Utensils, Award, 
  Mountain, Home, Users, Bus, Share2 
} from 'lucide-react';
import TrekGallerySlider from '../TrekGallerySlider';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';


export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TrekDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Query database for trek matching slug
  const trek = await prisma.trek.findUnique({
    where: { slug },
  });

  if (!trek) notFound();

  // Related treks query
  const relatedTreks = await prisma.trek.findMany({
    where: { id: { not: trek.id } },
    take: 3,
    orderBy: { order: 'asc' },
  });

  const galleryImages = (trek.gallery || []).filter(Boolean);
  const itineraryDays = Array.isArray(trek.itinerary) ? (trek.itinerary as any[]) : [];
  const packingItems = trek.packingList || [];

  const shareUrl = `https://everpeakadventures.com/trekking/${trek.slug ?? trek.id}`;

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans text-gray-800 pb-24">
      
      {/* 1. TOP HERO TITLE BANNER */}
      <section className="relative py-20 bg-[#112233] text-white text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img src={trek.heroImage} alt={trek.title} className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider oswald">
            {trek.title}
          </h1>
        </div>
      </section>

      {/* 2. MAIN GRID LAYOUT */}
      <section className="max-w-[1200px] mx-auto px-5 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR: BOOKING CARD & INQUIRY HELP */}
          <div className="space-y-6">
            
            {/* Price & Booking Box */}
            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-6 sticky top-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Price From</span>
                  <span className="text-3xl font-black text-[#112233] oswald">
                    ${trek.price ? trek.price.toLocaleString() : '1,790'}
                  </span>
                </div>
                <span className="bg-amber-50 text-amber-700 font-bold text-[10px] px-2.5 py-1 rounded border border-amber-200">
                  Best Price
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Destination</span>
                  <span className="font-bold uppercase text-[#112233]">{trek.region}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Duration</span>
                  <span className="font-bold text-[#112233]">{trek.durationDays}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Best Season</span>
                  <span className="font-bold text-[#112233]">{trek.bestSeason}</span>
                </div>
              </div>

              <Link 
                href={`/booking-form/?trip_id=${trek.id}`}
                className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-3.5 rounded-lg text-center transition-colors uppercase tracking-wider block text-xs shadow-sm"
              >
                Book This Trek Now
              </Link>
            </div>

            {/* Quick Inquiry Options */}
            <div className="bg-[#112233] text-white rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-xs oswald border-b border-gray-700 pb-2">
                All In Queries / Help
              </h3>
              <div className="space-y-2 text-xs">
                <Link href="/send-inquiry" className="p-3 bg-[#1c2e40] hover:bg-[#24a0ed] transition-colors rounded-lg font-medium flex items-center justify-between">
                  <span>General Inquiry</span><span>→</span>
                </Link>
                <a href="https://wa.me/9851093960" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#1c2e40] hover:bg-[#24a0ed] transition-colors rounded-lg font-medium flex items-center justify-between">
                  <span>Instant WhatsApp</span><span>→</span>
                </a>
                <Link href="/send-inquiry" className="p-3 bg-[#1c2e40] hover:bg-[#24a0ed] transition-colors rounded-lg font-medium flex items-center justify-between">
                  <span>Customize Trip</span><span>→</span>
                </Link>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Auto-Swiping Image Slider */}
            <div className="w-full">
              <TrekGallerySlider mainImage={trek.heroImage} galleryImages={galleryImages} />
            </div>

            {/* 8-Grid Quick Facts Box */}
            <Stagger className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Clock className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Duration</span>
                  <span className="font-bold text-gray-800">{trek.durationDays}</span>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Mountain className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Max Altitude</span>
                  <span className="font-bold text-gray-800">{trek.maxAltitude}</span>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Award className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Trek Grade</span>
                  <span className="font-bold text-gray-800">{trek.difficulty}</span>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Calendar className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Best Season</span>
                  <span className="font-bold text-gray-800">{trek.bestSeason}</span>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Home className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Accommodation</span>
                  <span className="font-bold text-gray-800">{trek.accommodation || 'Teahouse / Lodge'}</span>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Utensils className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Meals</span>
                  <span className="font-bold text-gray-800">{trek.meals || 'BLD'}</span>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Users className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Group Size</span>
                  <span className="font-bold text-gray-800">{trek.groupSize || '1 - 12 Pax'}</span>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Bus className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Transport</span>
                  <span className="font-bold text-gray-800">{trek.transport || 'Flight / Flight'}</span>
                </div>
              </StaggerItem>

            </Stagger>

            {/* Trip Overview */}
            <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                Trip Overview
              </h2>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                {trek.overview || "Experience one of Nepal's most breathtaking trekking adventures."}
              </p>
              
              {/* Social Share Bar */}
              <div className="pt-4 flex items-center gap-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-2">
                  <Share2 className="w-3.5 h-3.5" /> Share:
                </span>
                <a href="https://wa.me/9851093960" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">WhatsApp</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-600 text-white rounded text-[10px] font-bold">Facebook</a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(trek.title)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-sky-500 text-white rounded text-[10px] font-bold">Twitter</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-700 text-white rounded text-[10px] font-bold">LinkedIn</a>
              </div>
            </Reveal>

            {/* Highlights */}
            {trek.highlights && trek.highlights.length > 0 && (
              <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                  Highlights
                </h2>
                <ul className="space-y-2.5">
                  {trek.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                      <span className="text-[#24a0ed] font-bold">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* Itinerary */}
            {itineraryDays.length > 0 && (
              <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                  Itinerary
                </h2>
                <div className="space-y-3">
                  {itineraryDays.map((day: any, i: number) => (
                    <details key={i} className="group p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <summary className="font-bold text-xs text-[#112233] cursor-pointer flex items-center justify-between">
                        <span>Day {day.day || i + 1}: {day.title}</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200 leading-relaxed">
                        {day.desc}
                      </p>
                    </details>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Includes & Excludes */}
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StaggerItem className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-bold oswald uppercase text-emerald-700 border-b pb-2 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Package Includes
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {trek.inclusions?.map((inc: string, i: number) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-emerald-600 font-bold">•</span> {inc}</li>
                  ))}
                </ul>
              </StaggerItem>
              <StaggerItem className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-bold oswald uppercase text-rose-700 border-b pb-2 flex items-center gap-2 text-xs">
                  <XCircle className="w-4 h-4" /> Package Excludes
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {trek.exclusions?.map((exc: string, i: number) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-rose-600 font-bold">•</span> {exc}</li>
                  ))}
                </ul>
              </StaggerItem>
            </Stagger>

            {/* Equipment & Packing Checklist */}
            <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                Equipment List / Checklist
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                {(packingItems.length > 0 ? packingItems : [
                  'Trekking boots & spare laces',
                  'Down jacket & waterproof shell jacket',
                  'Thermal innerwear (top & bottom)',
                  'Trekking poles & gloves',
                  'Sleeping bag (-10°C rating)',
                  'Water purification tablets & bottle'
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-[#24a0ed]">✓</span> {item}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Elevation Profile Chart Placeholder */}
            <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                Elevation Map
              </h2>
              {trek.mapUrl ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center space-y-3">
                  <img 
                    src={trek.mapUrl} 
                    alt={`${trek.title} elevation profile`} 
                    className="w-full h-44 object-contain rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>Elevation Profile</span>
                    <span>Max: {trek.maxAltitude || '5,357m'}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center space-y-3">
                  <div className="h-44 w-full bg-emerald-50/50 rounded-lg flex items-end justify-between px-6 pb-4 border-b border-emerald-200">
                    <div className="w-6 bg-emerald-400 rounded-t h-[30%]" title="Lukla (2,860m)"></div>
                    <div className="w-6 bg-emerald-500 rounded-t h-[55%]" title="Namche (3,440m)"></div>
                    <div className="w-6 bg-emerald-600 rounded-t h-[75%]" title="Dole (4,200m)"></div>
                    <div className="w-6 bg-emerald-700 rounded-t h-[90%]" title="Gokyo (4,790m)"></div>
                    <div className="w-6 bg-emerald-800 rounded-t h-full" title="Gokyo Ri (5,357m)"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>Start: 2,860m</span>
                    <span>Max: {trek.maxAltitude || '5,357m'}</span>
                  </div>
                </div>
              )}
            </Reveal>

          </div>

        </div>
      </section>

      {/* 3. RELATED TREKS SECTION */}
      {relatedTreks.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-20">
          <Reveal className="text-2xl font-black oswald uppercase text-[#112233] mb-6">
            You May Also Like
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTreks.map((item) => (
              <StaggerItem key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group">
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                  <h3 className="font-bold text-xs text-[#112233] line-clamp-2 group-hover:text-[#24a0ed] transition-colors">
                    {item.title}
                  </h3>
                  <Link 
                    href={`/trekking/${item.slug ? item.slug : item.id}`}
                    className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-2 rounded-lg text-center uppercase tracking-wider text-[11px] block transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

    </div>
  );
}
