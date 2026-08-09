import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Clock, CheckCircle2, XCircle, Utensils, 
  Mountain, Car, MapPin, Activity as ActivityIcon, Flag
} from 'lucide-react';
import TourGallerySlider from '../TourGallerySlider';
import StickySectionNav from '@/app/components/trek/StickySectionNav';
import RouteMap from '@/app/components/trek/RouteMap';
import RouteMapImage from '@/app/components/trek/RouteMapImage';
import DetailedRouteMap, { RoutePoint, RouteSegment, Peak } from '@/app/components/trek/DetailedRouteMap';
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

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const tour = await prisma.tour.findUnique({
    where: { slug },
    include: {
      groupPrices: true,
      fixedSchedules: true,
    }
  });

  if (!tour) notFound();

  const relatedTours = await prisma.tour.findMany({
    where: { destination: tour.destination, NOT: { id: tour.id } },
    take: 4,
    orderBy: { order: 'asc' },
  });

  const linkedFaqs = await prisma.fAQ.findMany({
    where: { relatedType: 'tour', relatedSlug: tour.slug },
    orderBy: { order: 'asc' },
  });

  // Gallery array for the slider
  const galleryImages = (tour.gallery || []).filter(Boolean);

  // Safe cast for itinerary Json field
  const itineraryDays = Array.isArray(tour.itinerary) ? (tour.itinerary as any[]) : [];
  const packingItems = tour.packingList || '';

  const buildTourElevationData = (itinerary: any[]) =>
    (itinerary || [])
      .filter((d) => d && d.title)
      .map((d) => ({ day: d.day, location: d.title, elevation: Number(d.elev) || 0 }));

  const routeMap =
    tour.routeMap && typeof tour.routeMap === 'object' && !Array.isArray(tour.routeMap)
      ? (tour.routeMap as { peaks?: Peak[]; routePoints?: RoutePoint[]; routeSegments?: RouteSegment[]; title?: string; subtitle?: string; brandName?: string; brandTagline?: string; footerUrl?: string; maxAltitude?: number })
      : null;

  const parsePrice = (s?: string | null) => {
    const n = Number(String(s ?? '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const groupPricesArr = (tour.groupPrices || []) as any[];
  const minPrice = groupPricesArr.length
    ? Math.min(...groupPricesArr.map((g: any) => parsePrice(g.price)).filter((n: number) => n > 0))
    : (tour.discountedPrice ?? tour.price);
  const regularPrice = (tour.originalPrice ?? tour.price) > minPrice ? (tour.originalPrice ?? tour.price) : minPrice;
  const saveAmount = regularPrice - minPrice;
  const savePercent = Math.round((saveAmount / regularPrice) * 100);
  const minPriceDisplay = minPrice > 0 ? minPrice : (tour.discountedPrice ?? tour.price);

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans text-gray-800 pb-24">
      
      {/* 1. TOP HERO TITLE BANNER */}
      <section className="relative py-20 bg-[#112233] text-white text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img src={tour.heroImage} alt={tour.title} className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider oswald">
            {tour.title}
          </h1>
        </div>
      </section>

      <StickySectionNav />

      {/* 2. MAIN GRID LAYOUT */}
      <section className="max-w-[1200px] mx-auto px-5 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR: EXACT MATCH BOOKING & GROUP PRICE TABLE */}
          <div className="space-y-6 sticky top-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-5">
              
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
                      {tour.priceRange && <div>Range: {tour.priceRange}</div>}
                      <div>Duration: {tour.duration}</div>
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
              {tour.groupPrices && tour.groupPrices.length > 0 && (
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
                    {tour.groupPrices.map((gp: any, i: number) => (
                      <div key={gp.id} className={`grid grid-cols-4 p-2 text-center text-gray-600 items-center ${i !== tour.groupPrices.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <span className="font-semibold">{gp.groupSize}</span>
                        <span>{gp.groupType}</span>
                        <span className="text-[#24a0ed] font-bold">{gp.price}</span>
                        <span>
                          <Link href={`/booking-form/?trip_id=${tour.id}`} className="text-[#24a0ed] hover:text-[#112233] font-bold underline">
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
              {tour.fixedSchedules && tour.fixedSchedules.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase text-gray-500 block">Group Date Schedule</span>
                  <div className="space-y-1.5">
                    {tour.fixedSchedules.map((sch: any) => (
                      <div key={sch.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 text-[11px]">
                        <span className="font-medium text-gray-700">{sch.dateRange}</span>
                        <Link href={`/booking-form/?trip_id=${tour.id}`} className="bg-[#24a0ed] text-white px-3 py-1 rounded font-bold hover:bg-[#112233] transition-colors">
                          {sch.status}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Inclusive Section */}
              {tour.isAllInclusive && (
                <div className="bg-[#112233] text-white p-4 rounded-lg text-xs space-y-2">
                  <h4 className="font-bold uppercase tracking-wider mb-2">All Inclusive Price</h4>
                  <div className="flex items-center gap-2">✓ Entire Booking</div>
                  <div className="flex items-center gap-2">✓ Secure Processing</div>
                  <div className="flex items-center gap-2">✓ No Hidden Costs</div>
                </div>
              )}

              <Link 
                href={`/booking-form/?trip_id=${tour.id}`}
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
              <TourGallerySlider mainImage={tour.heroImage} galleryImages={galleryImages} />
            </div>

            {/* Quick Facts Grid */}
            <div id="key-points" className="scroll-mt-[118px]" />
            <Stagger className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <MapPin className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Start at</span>
                  <span className="font-bold text-gray-800">{tour.startPoint}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Clock className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Duration</span>
                  <span className="font-bold text-gray-800">{tour.duration}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Mountain className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Grade</span>
                  <span className="font-bold text-gray-800">{tour.grade}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Car className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Transport</span>
                  <span className="font-bold text-gray-800">{tour.transport || 'Private Vehicle'}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <ActivityIcon className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Max Altitude</span>
                  <span className="font-bold text-gray-800">{tour.maxAltitude}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <MapPin className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Activity</span>
                  <span className="font-bold text-gray-800">{tour.activity || 'Sightseeing / Tour'}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Mountain className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Best Season</span>
                  <span className="font-bold text-gray-800">{tour.bestTime}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Utensils className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Meals</span>
                  <span className="font-bold text-gray-800">{tour.meals || 'B.B.'}</span>
                </div>
              </StaggerItem>
              <StaggerItem className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Flag className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">End at</span>
                  <span className="font-bold text-gray-800">{tour.endPoint}</span>
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
                dangerouslySetInnerHTML={{ __html: toHtml(tour.overview) }}
              />
            </Reveal>

            {/* Highlights */}
            {tour.highlights && (<>
              <div id="highlights" className="scroll-mt-[118px]" />
              <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                  Highlights
                </h2>
                <div className="rich-content text-xs text-gray-700 font-medium" dangerouslySetInnerHTML={{ __html: toHtml(tour.highlights) }} />
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
                {tour.inclusions && <div className="rich-content text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: toHtml(tour.inclusions) }} />}
              </StaggerItem>
              <StaggerItem id="exclude" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3 scroll-mt-[118px]">
                <h3 className="font-bold oswald uppercase text-rose-700 border-b pb-2 flex items-center gap-2 text-xs">
                  <XCircle className="w-4 h-4" /> Package Excludes
                </h3>
                {tour.exclusions && <div className="rich-content text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: toHtml(tour.exclusions) }} />}
              </StaggerItem>
            </Stagger>

          </div>
        </div>
      </section>

      {/* EQUIPMENT */}
      {packingItems && (<>
        <div id="equipment" className="scroll-mt-[118px]" />
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
              Equipment & Gears
            </h2>
            <div className="rich-content text-xs text-gray-700 font-medium" dangerouslySetInnerHTML={{ __html: toHtml(packingItems) }} />
          </Reveal>
        </section>
      </>)}

      {/* ROUTE MAP & ELEVATION */}
      {(tour.mapImage || routeMap || itineraryDays.length > 0) && (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          {tour.mapImage && (
            <RouteMapImage src={tour.mapImage} alt={`${tour.title} route map`} />
          )}
          {routeMap && (
            <div className={tour.mapImage ? 'mt-10' : ''}>
              <DetailedRouteMap
                title={routeMap.title || tour.title}
                subtitle={routeMap.subtitle}
                brandName={routeMap.brandName}
                brandTagline={routeMap.brandTagline}
                footerUrl={routeMap.footerUrl}
                maxAltitude={routeMap.maxAltitude}
                peaks={routeMap.peaks}
                routePoints={routeMap.routePoints}
                routeSegments={routeMap.routeSegments}
                elevationData={buildTourElevationData(itineraryDays)}
                showElevationProfile={false}
              />
            </div>
          )}
          {itineraryDays.length > 0 && (
            <div className="mt-10">
              <RouteMap itinerary={itineraryDays} chartTitle={tour.title} />
            </div>
          )}
        </section>
      )}

      {/* TOUR VIDEO */}
      {tour.videoUrl && tour.videoType ? (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <Reveal className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg md:text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
              Tour Video
            </h2>
            {tour.videoType === 'youtube' ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-gray-100 bg-black">
                <iframe
                  src={tour.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${tour.title} video`}
                />
              </div>
            ) : (
              <video src={tour.videoUrl} controls className="w-full aspect-video rounded-xl border border-gray-100 bg-black object-contain" />
            )}
          </Reveal>
        </section>
      ) : null}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <GallerySection photos={galleryImages.map((src: string, i: number) => ({
            src, caption: `Day ${i + 1} snapshot - ${tour.title}`,
          }))} />
        </section>
      )}

      {/* FAQS */}
      {linkedFaqs.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          <FAQAccordion faqs={linkedFaqs} />
        </section>
      )}

      {/* RELATED TOURS */}
      {relatedTours.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-20">
          <Reveal className="text-2xl font-black oswald uppercase text-[#112233] mb-6">
            You May Also Like
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTours.map((item) => (
              <StaggerItem key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group">
                <Link 
                    href={`/tour/${item.slug ? item.slug : item.id}`}>
                <div className="h-44 overflow-hidden bg-gray-100 relative">
                  <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-white/95 text-[#112233] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                    {item.duration}
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
                  <button                     
                    className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-2 rounded-lg text-center uppercase tracking-wider text-[11px] block transition-colors"
                  >
                    Start Journey
                  </button>
                </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

    </div>
  );
}