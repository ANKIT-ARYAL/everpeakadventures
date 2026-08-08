import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, Clock, CheckCircle2, XCircle, Utensils, Award, 
  Mountain, Home, Share2, MapPin, Activity as ActivityIcon, Flag
} from 'lucide-react';
import TrekGallerySlider from '../TrekGallerySlider';
import StickySectionNav from '@/app/components/trek/StickySectionNav';
import RouteMap from '@/app/components/trek/RouteMap';
import RouteMapImage from '@/app/components/trek/RouteMapImage';
import DetailedRouteMap, { RoutePoint, RouteSegment, Peak, ElevationDay } from '@/app/components/trek/DetailedRouteMap';
import GallerySection from '@/app/components/trek/GallerySection';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';
import { toHtml } from '@/app/lib/html';
import FAQAccordion from '@/app/components/FAQAccordion';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TrekDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const trek = await prisma.trek.findUnique({
    where: { slug },
    include: {
      groupPrices: true,
      fixedSchedules: true,
    }
  });

  if (!trek) notFound();

  const relatedTreks = await prisma.trek.findMany({
    where: { id: { not: trek.id } },
    take: 3,
    orderBy: { order: 'asc' },
  });

  const linkedFaqs = trek.slug
    ? await prisma.fAQ.findMany({
        where: { relatedType: 'trek', relatedSlug: trek.slug },
        orderBy: { order: 'asc' },
      })
    : [];

  const galleryImages = (trek.gallery || []).filter(Boolean);
  const itineraryDays = Array.isArray(trek.itinerary) ? (trek.itinerary as any[]) : [];
  const packingItems = trek.packingList || '';
  const shareUrl = `https://everpeakadventures.com/trekking/${trek.slug ?? trek.id}`;

  const parsePrice = (s?: string | null) => {
    const n = Number(String(s ?? '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const groupPricesArr = (trek.groupPrices || []) as any[];
  const minPrice = groupPricesArr.length
    ? Math.min(...groupPricesArr.map((g: any) => parsePrice(g.price)).filter((n: number) => n > 0))
    : (trek.discountedPrice ?? trek.price);
  const regularPrice = (trek.originalPrice ?? trek.price) > minPrice ? (trek.originalPrice ?? trek.price) : minPrice;
  const saveAmount = regularPrice - minPrice;
  const savePercent = Math.round((saveAmount / regularPrice) * 100);
  const minPriceDisplay = minPrice > 0 ? minPrice : (trek.discountedPrice ?? trek.price);

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

      <StickySectionNav />

      {/* 2. MAIN GRID LAYOUT */}
      <section className="max-w-[1200px] mx-auto px-5 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR: EXACT MATCH BOOKING & GROUP PRICE TABLE */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6 space-y-5">
              
              {/* Header Price display */}
              <div className="border-b pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Price From</span>
                    <div className="flex items-baseline flex-wrap gap-x-1.5 mt-1">
                      <span className="text-[1.75rem] leading-none font-black text-[#112233] oswald">US$ {minPriceDisplay.toLocaleString()}</span>
                      <span className="text-sm font-bold text-gray-500">PP</span>
                    </div>
                    <div className="mt-2 space-y-1 text-[11px] text-gray-500 font-medium">
                      {regularPrice > minPrice && (
                        <div>Regular price: <span className="line-through text-gray-400">US$ {regularPrice.toLocaleString()}</span></div>
                      )}
                      {trek.priceRange && <div>Range: {trek.priceRange}</div>}
                      <div>Duration: {trek.durationDays}</div>
                    </div>
                  </div>

                  {saveAmount > 0 && (
                    <div className="shrink-0 flex flex-col items-center bg-amber-400 text-[#112233] rounded-xl px-3 py-2 shadow-sm text-center">
                      <span className="text-[9px] font-black uppercase tracking-wider">Save</span>
                      <span className="text-sm font-black leading-tight">US$ {saveAmount.toLocaleString()}</span>
                      <span className="text-[10px] font-black leading-tight">-{savePercent}%</span>
                      <span className="text-[8px] font-bold uppercase tracking-wide opacity-80">per person</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Group-Size Discounts */}
              {trek.groupPrices && trek.groupPrices.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800 uppercase tracking-wider text-xs">Group-Size Discounts</h4>
                  <p className="text-[10px] text-gray-400">Your group is private - we do not add others to your group.</p>
                  <div className="overflow-x-auto">
                  <div className="min-w-[420px] border border-gray-200 rounded-lg overflow-hidden text-[11px]">
                    <div className="grid grid-cols-4 bg-gray-100 font-bold text-gray-600 p-2 border-b border-gray-200 text-center uppercase tracking-wide">
                      <span>No. of Persons</span>
                      <span>Group Type</span>
                      <span>Price / Person</span>
                      <span></span>
                    </div>
                    {trek.groupPrices.map((gp: any, i: number) => (
                      <div key={gp.id} className={`grid grid-cols-4 p-2 text-center text-gray-600 items-center ${i !== trek.groupPrices.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <span className="font-semibold">{gp.groupSize}</span>
                        <span>{gp.groupType}</span>
                        <span className="text-[#24a0ed] font-bold">{gp.price}</span>
                        <span>
                          <Link href={`/booking-form/?trip_id=${trek.id}`} className="text-[#24a0ed] hover:text-[#112233] font-bold underline">
                            Book
                          </Link>
                          </span>
                        </div>
                    ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Group Schedule / Departures Box */}
              {trek.fixedSchedules && trek.fixedSchedules.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase text-gray-500 block">Group Date Schedule</span>
                  <div className="space-y-1.5">
                    {trek.fixedSchedules.map((sch: any) => (
                      <div key={sch.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 text-[11px]">
                        <span className="font-medium text-gray-700">{sch.dateRange}</span>
                        <Link href={`/booking-form/?trip_id=${trek.id}`} className="bg-[#24a0ed] text-white px-3 py-1 rounded font-bold hover:bg-[#112233] transition-colors">
                          {sch.status}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Inclusive Section */}
              {trek.isAllInclusive && (
                <div className="bg-[#112233] text-white p-4 rounded-lg text-xs space-y-2">
                  <h4 className="font-bold uppercase tracking-wider mb-2">All Inclusive Price</h4>
                  <div className="flex items-center gap-2">✓ Entire Booking</div>
                  <div className="flex items-center gap-2">✓ Secure Processing</div>
                  <div className="flex items-center gap-2">✓ No Hidden Costs</div>
                </div>
              )}

              <Link 
                href={`/booking-form/?trip_id=${trek.id}`}
                className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-3.5 rounded-lg text-center transition-colors uppercase tracking-wider block text-xs shadow-sm"
              >
                Book Now
              </Link>
              <Link 
                href="/send-inquiry"
                className="w-full bg-white border-2 border-[#24a0ed] text-[#24a0ed] hover:bg-[#24a0ed] hover:text-white font-bold py-3.5 rounded-lg text-center transition-colors uppercase tracking-wider block text-xs"
              >
                Enquire
              </Link>
              <p className="text-center text-[9px] text-gray-400">Dates & discounts are applied in the next step.</p>
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
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full">
              <TrekGallerySlider mainImage={trek.heroImage} galleryImages={galleryImages} />
            </div>

            {/* Quick Facts Grid */}
            <div id="key-points" className="scroll-mt-[118px]" />
            <Stagger className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <MapPin className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Start at</span>
                  <span className="font-bold text-gray-800">Kathmandu</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Clock className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Duration</span>
                  <span className="font-bold text-gray-800">{trek.durationDays}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Award className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Trekking Grade</span>
                  <span className="font-bold text-gray-800">{trek.difficulty}</span>
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
                <Mountain className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Max Altitude</span>
                  <span className="font-bold text-gray-800">{trek.maxAltitude}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <ActivityIcon className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Activity</span>
                  <span className="font-bold text-gray-800">{trek.activity || 'Trekking'}</span>
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
                <Utensils className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Meals</span>
                  <span className="font-bold text-gray-800">{trek.meals || 'BLD'}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Flag className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">End at</span>
                  <span className="font-bold text-gray-800">Kathmandu</span>
                </div>
              </StaggerItem>
            </Stagger>

            {/* Trip Overview */}
            <div id="trip-overview" className="scroll-mt-[118px]" />
            <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                Trip Overview
              </h2>
              <div
                className="text-gray-600 text-xs md:text-sm leading-relaxed rich-content"
                dangerouslySetInnerHTML={{ __html: toHtml(trek.overview) }}
              />
            </Reveal>

            {/* Highlights */}
            {trek.highlights && (<>
              <div id="highlights" className="scroll-mt-[118px]" />
              <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                  Highlights
                </h2>
                <div className="rich-content text-xs text-gray-700 font-medium" dangerouslySetInnerHTML={{ __html: toHtml(trek.highlights) }} />
              </Reveal>
            </>)}

            {/* Itinerary */}
            {itineraryDays.length > 0 && (<>
              <div id="itinerary" className="scroll-mt-[118px]" />
              <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                  Itinerary
                </h2>
                <div className="space-y-3">
                  {itineraryDays.map((day: any, i: number) => (
                    <details key={i} className="group rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
                      <summary className="list-none font-bold text-xs text-[#112233] cursor-pointer flex items-center justify-between gap-2 px-4 py-3.5 transition-colors hover:bg-gray-100">
                        <span>Day {day.day || i + 1}: {day.title}</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
                      </summary>
                      <div className="text-xs text-gray-600 px-4 py-3.5 pt-3 border-t border-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: toHtml(day.desc) }} />
                    </details>
                  ))}
                </div>
              </Reveal>
            </>)}

            {/* Includes & Excludes */}
            <div id="include" className="scroll-mt-[118px]" />
            <Stagger className="flex flex-col gap-6">
              <StaggerItem className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-bold oswald uppercase text-emerald-700 border-b pb-2 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Package Includes
                </h3>
                {trek.inclusions && <div className="rich-content text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: toHtml(trek.inclusions) }} />}
              </StaggerItem>
              <StaggerItem id="exclude" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3 scroll-mt-[118px]">
                <h3 className="font-bold oswald uppercase text-rose-700 border-b pb-2 flex items-center gap-2 text-xs">
                  <XCircle className="w-4 h-4" /> Package Excludes
                </h3>
                {trek.exclusions && <div className="rich-content text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: toHtml(trek.exclusions) }} />}
              </StaggerItem>
            </Stagger>

          </div>
        </div>
      </section>

      {/* EQUIPMENT & GEARS */}
      {packingItems && (<>
        <div id="equipment" className="scroll-mt-[118px]" />
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
              Equipment & Trekking Gears
            </h2>
            <div className="rich-content text-xs text-gray-700 font-medium" dangerouslySetInnerHTML={{ __html: toHtml(packingItems) }} />
          </Reveal>
        </section>
      </>)}

      {/* ROUTE MAP & ELEVATION */}
      {((trek.mapImage) || itineraryDays.length > 0) && (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <RouteMapImage src={trek.mapImage} alt={`${trek.title} route map`} />
          {itineraryDays.length > 0 && (
            <div className="mt-6">
              <RouteMap itinerary={itineraryDays} chartTitle={trek.title} />
            </div>
          )}
          
          {/* Detailed Interactive Route Map (EBC with Gokyo Lake example) */}
          <div className="mt-10">
            <DetailedRouteMap
              title="EBC WITH GOKYO LAKE HELI SHUTTLE TREK"
              subtitle="Detailed route map with elevation profile"
              brandName="NEPAL HIKING TEAM"
              brandTagline="Walk, Explore and Discover"
              maxAltitude={5545}
              peaks={[
                { name: 'Mt. Everest', elevation: 8848, x: 720, y: 180 },
                { name: 'Lhotse', elevation: 8481, x: 750, y: 200 },
                { name: 'Nuptse', elevation: 7879, x: 700, y: 220 },
                { name: 'Everest Base Camp', elevation: 5364, x: 680, y: 260 },
                { name: 'Kala Patthar', elevation: 5545, x: 690, y: 275 },
                { name: 'Chhukung Ri', elevation: 5546, x: 780, y: 280 },
                { name: 'Island Peak', elevation: 6189, x: 800, y: 290 },
                { name: 'Kongma La Pass', elevation: 5535, x: 760, y: 300 },
                { name: 'Nangkar Tshang', elevation: 5083, x: 740, y: 285 },
                { name: 'Chhukung', elevation: 4730, x: 770, y: 310 },
                { name: 'Imja Tsho', elevation: 5010, x: 790, y: 320 },
              ]}
              routePoints={[
                { id: 'kathmandu', name: 'Kathmandu', elevation: 1335, x: 100, y: 520, type: 'start', day: 1 },
                { id: 'lukla', name: 'Lukla', elevation: 2860, x: 280, y: 380, type: 'airport', day: 3 },
                { id: 'phakding', name: 'Phakding', elevation: 2652, x: 320, y: 360, type: 'trek', day: 3 },
                { id: 'namche', name: 'Namche Bazaar', elevation: 3440, x: 380, y: 330, type: 'acclimatization', day: 4 },
                { id: 'tengboche', name: 'Tengboche', elevation: 3860, x: 440, y: 300, type: 'trek', day: 6 },
                { id: 'dingboche', name: 'Dingboche', elevation: 4410, x: 500, y: 280, type: 'acclimatization', day: 7 },
                { id: 'lobuche', name: 'Lobuche', elevation: 4910, x: 560, y: 260, type: 'trek', day: 9 },
                { id: 'gorakshep', name: 'Gorakshep', elevation: 5164, x: 600, y: 250, type: 'trek', day: 10 },
                { id: 'ebc', name: 'EBC', elevation: 5364, x: 630, y: 245, type: 'end', day: 10 },
                { id: 'kalapathar', name: 'Kala Patthar', elevation: 5545, x: 640, y: 240, type: 'peak', day: 11 },
                { id: 'dzongla', name: 'Dzongla', elevation: 4830, x: 620, y: 280, type: 'trek', day: 11 },
                { id: 'cho_la', name: 'Cho La Pass', elevation: 5420, x: 660, y: 295, type: 'pass', day: 12 },
                { id: 'dragnag', name: 'Dragnag', elevation: 4700, x: 700, y: 310, type: 'trek', day: 12 },
                { id: 'gokyo', name: 'Gokyo', elevation: 4790, x: 740, y: 320, type: 'lake', day: 13 },
                { id: 'gokyo_ri', name: 'Gokyo Ri', elevation: 5360, x: 760, y: 300, type: 'peak', day: 14 },
                { id: 'renjo_la', name: 'Renjo La Pass', elevation: 5360, x: 780, y: 270, type: 'pass' },
                { id: 'thame', name: 'Thame', elevation: 3800, x: 420, y: 290, type: 'helipad' },
                { id: 'lukla_end', name: 'Lukla', elevation: 2860, x: 280, y: 380, type: 'airport', day: 14 },
                { id: 'kathmandu_end', name: 'Kathmandu', elevation: 1335, x: 100, y: 520, type: 'end', day: 17 },
              ]}
              routeSegments={[
                { from: 'kathmandu', to: 'lukla', type: 'flight' },
                { from: 'lukla', to: 'phakding', type: 'trekking' },
                { from: 'phakding', to: 'namche', type: 'trekking' },
                { from: 'namche', to: 'tengboche', type: 'trekking' },
                { from: 'tengboche', to: 'dingboche', type: 'trekking' },
                { from: 'dingboche', to: 'lobuche', type: 'trekking' },
                { from: 'lobuche', to: 'gorakshep', type: 'trekking' },
                { from: 'gorakshep', to: 'ebc', type: 'trekking' },
                { from: 'gorakshep', to: 'kalapathar', type: 'secondary' },
                { from: 'dingboche', to: 'dzongla', type: 'secondary' },
                { from: 'dzongla', to: 'cho_la', type: 'trekking' },
                { from: 'cho_la', to: 'dragnag', type: 'trekking' },
                { from: 'dragnag', to: 'gokyo', type: 'trekking' },
                { from: 'gokyo', to: 'gokyo_ri', type: 'secondary' },
                { from: 'gokyo', to: 'renjo_la', type: 'secondary' },
                { from: 'renjo_la', to: 'thame', type: 'trekking' },
                { from: 'thame', to: 'namche', type: 'secondary' },
                { from: 'gokyo', to: 'lukla_end', type: 'flight' },
                { from: 'lukla_end', to: 'kathmandu_end', type: 'flight' },
              ]}
              elevationData={[
                { day: 1, location: 'Kathmandu', elevation: 1335 },
                { day: 2, location: 'Kathmandu', elevation: 1335 },
                { day: 3, location: 'Phakding', elevation: 2652, distance: '8km' },
                { day: 4, location: 'Namche Bazaar', elevation: 3440, distance: '12km' },
                { day: 5, location: 'Namche / Everest View Hotel', elevation: 3880, distance: '4km / 11km' },
                { day: 6, location: 'Tengboche', elevation: 3860, distance: '12km' },
                { day: 7, location: 'Dingboche', elevation: 4410, distance: '12km' },
                { day: 8, location: 'Dingboche / Nangkartsang Peak', elevation: 5083, distance: '6km / 4410m' },
                { day: 9, location: 'Lobuche', elevation: 4910, distance: '15km' },
                { day: 10, location: 'Gorakshep / EBC', elevation: 5364, distance: '14km' },
                { day: 11, location: 'Dzongla / Kala Patthar', elevation: 5545, distance: '' },
                { day: 12, location: 'Thangnak / Cho La Pass', elevation: 5420, distance: '9km' },
                { day: 13, location: 'Gokyo', elevation: 4790, distance: '5km' },
                { day: 14, location: 'Gokyo Ri / Lukla', elevation: 2860, distance: '4km' },
                { day: 15, location: 'Kathmandu', elevation: 1335 },
                { day: 16, location: 'Kathmandu', elevation: 1335 },
                { day: 17, location: 'Departure', elevation: 1335 },
              ]}
              footerUrl="www.nepalhikingteam.com"
            />
          </div>
        </section>
      )}

      {/* TREK VIDEO */}
      {trek.videoUrl && trek.videoType ? (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <Reveal className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg md:text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
              Trek Video
            </h2>
            {trek.videoType === 'youtube' ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-gray-100 bg-black">
                <iframe
                  src={trek.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${trek.title} video`}
                />
              </div>
            ) : (
              <video src={trek.videoUrl} controls className="w-full aspect-video rounded-xl border border-gray-100 bg-black object-contain" />
            )}
          </Reveal>
        </section>
      ) : null}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <GallerySection photos={galleryImages.map((src: string, i: number) => ({
            src, caption: `Day ${i + 1} snapshot - ${trek.title}`,
          }))} />
        </section>
      )}

      {/* FAQS */}
      {linkedFaqs.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <FAQAccordion faqs={linkedFaqs} />
        </section>
      )}

      {/* RELATED TREKS */}
      {relatedTreks.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-20">
          <Reveal className="text-2xl font-black oswald uppercase text-[#112233] mb-6">
            You May Also Like
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTreks.map((item) => (
              <StaggerItem key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group">
                <div className="h-44 overflow-hidden bg-gray-100 relative">
                  <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-white/95 text-[#112233] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                    {item.durationDays}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                  <h3 className="font-bold text-xs text-[#112233] line-clamp-2 group-hover:text-[#24a0ed] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#24a0ed] font-black text-sm">
                      US$ {(item.discountedPrice ?? item.price).toLocaleString()}
                    </span>
                    {item.originalPrice && (item.originalPrice > (item.discountedPrice ?? 0)) && (
                      <span className="text-[10px] text-gray-400 line-through font-medium">
                        US$ {item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link 
                    href={`/trekking/${item.slug ? item.slug : item.id}`}
                    className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-2 rounded-lg text-center uppercase tracking-wider text-[11px] block transition-colors"
                  >
                    Start Journey
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