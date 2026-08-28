/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Utensils,
  Award,
  Mountain,
  Home,
  MapPin,
  Activity as ActivityIcon,
  Flag,
  Star,
  ShieldCheck,
  AlertCircle,
  Map,
  ChevronDown,
  MessageSquare
} from "lucide-react";

import TrekGalleryGrid from "@/app/components/trek/TrekGalleryGrid";
import StickySectionNav from "@/app/components/trek/StickySectionNav";
import StickyBookingSidebar from "@/app/components/trek/StickyBookingSidebar";
import RouteMapImage from "@/app/components/trek/RouteMapImage";
import TripReviewsSection from "@/app/components/trek/TripReviewsSection";
import PackingListSection from "@/app/components/trek/PackingListSection";
import VideoSyncedElevationProfile, { ElevationPoint } from "@/app/components/trek/VideoSyncedElevationProfile";
import TrekVideoWithSync from "@/app/components/trek/TrekVideoWithSync";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/app/components/animations/Motion";
import { toHtml } from "@/app/lib/html";
import FAQAccordion from "@/app/components/FAQAccordion";
import FixedDepartures from "@/app/components/home/FixedDepartures";
import {
  ensureRecurringInstances,
  shapeDeparture,
  departureWindow,
} from "@/lib/departures";

interface RouteMapData {
  peaks?: Array<{ name: string; elevation: number; x: number; y: number }>;
  routePoints?: Array<{ id: string; name: string; elevation: number; x: number; y: number; type: string; day?: number }>;
  routeSegments?: Array<{ from: string; to: string; type: string }>;
  title?: string;
  subtitle?: string;
  brandName?: string;
  brandTagline?: string;
  footerUrl?: string;
  maxAltitude?: number;
}

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/*
 * Keep this as a real image that exists in /public.
 *
 * Example:
 * public/images/placeholder.jpg
 *
 * Do NOT use an empty string here.
 */
const FALLBACK_IMAGE = "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png";

export default async function TrekDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const trek = await prisma.trek.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      groupPrices: true,
      packingItems: true,
    },
  });

  if (!trek) {
    notFound();
  }

  /*
   * heroImage is string | null in Prisma.
   * Convert it into a guaranteed string once.
   */
  const heroImage = trek.heroImage || FALLBACK_IMAGE;

  await ensureRecurringInstances();

  const { start, end } = departureWindow();

  const trekDepartures = await prisma.departure.findMany({
    where: {
      trekId: trek.id,
      published: true,
      startDate: {
        gte: start,
        lte: end,
      },
    },
    include: {
      trek: {
        select: {
          id: true,
          slug: true,
          title: true,
          heroImage: true,
          durationDays: true,
          price: true,
          discountedPrice: true,
          originalPrice: true,
          groupPrices: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  const shapedDepartures = trekDepartures
    .map(shapeDeparture)
    .filter(Boolean);

  const relatedTreks = await prisma.trek.findMany({
    where: {
      id: {
        not: trek.id,
      },
      published: true,
    },
    take: 3,
    orderBy: {
      order: "asc",
    },
  });

  const linkedFaqs = trek.slug
    ? await prisma.fAQ.findMany({
        where: {
          relatedType: "trek",
          relatedSlug: trek.slug,
          published: true,
        },
        orderBy: {
          order: "asc",
        },
      })
    : [];

  const galleryImages = (trek.gallery || []).filter(
    (image): image is string => Boolean(image)
  );

  const itineraryDays = Array.isArray(trek.itinerary)
    ? (trek.itinerary as any[])
    : [];

const packingItems = trek.packingItems || [];
   
  // FIX: Fetch the packing categories (PackingCategory model has no 'order' field)
  const packingCategories = await prisma.packingCategory.findMany();

  const parsePrice = (value?: string | null) => {
    const number = Number(
      String(value ?? "").replace(/[^0-9.]/g, "")
    );

    return Number.isFinite(number) && number > 0 ? number : 0;
  };

  const groupPricesArr = (trek.groupPrices || []) as any[];

  const routeMap =
    trek.routeMap &&
    typeof trek.routeMap === "object" &&
    !Array.isArray(trek.routeMap)
      ? (trek.routeMap as RouteMapData)
      : null;

  // Build elevation profile from elevationProfile (new) or altitudeData (legacy)
  const trekData = trek as any;
  const elevationProfile: ElevationPoint[] = Array.isArray(trekData.elevationProfile) && trekData.elevationProfile.length > 0
    ? (trekData.elevationProfile as any[]).map((ep: any, i: number) => ({
        day: ep.day || i + 1,
        location: ep.location || ep.place || '',
        elevation: Number(ep.elevation) || Number(ep.altitude) || 0,
        videoTime: ep.videoTime,
        note: ep.note,
      }))
    : Array.isArray(trek.altitudeData) && trek.altitudeData.length > 0
      ? (trek.altitudeData as any[]).map((ad: any, i: number) => ({
          day: ad.day || i + 1,
          location: ad.place || '',
          elevation: Number(ad.altitude) || 0,
          note: ad.note,
        }))
      : [];

  const routeMapItinerary = elevationProfile.length > 0
    ? elevationProfile.map((ep) => ({
        day: ep.day,
        title: ep.location,
        elev: ep.elevation,
        desc: ep.note,
      }))
    : itineraryDays;

  const buildElevationData = (itinerary: any[]) =>
    (itinerary || [])
      .filter((day) => day && day.title)
      .map((day) => ({
        day: day.day,
        location: day.title,
        elevation: Number(day.elev) || 0,
      }));

  const validGroupPrices = groupPricesArr
    .map((group) => parsePrice(group.price))
    .filter((price) => price > 0);

  const minPrice = validGroupPrices.length
    ? Math.min(...validGroupPrices)
    : (trek.discountedPrice ?? trek.price);

  const regularPrice =
    (trek.originalPrice ?? trek.price) > minPrice
      ? (trek.originalPrice ?? trek.price)
      : minPrice;

  const saveAmount = regularPrice - minPrice;


  const minPriceDisplay =
    minPrice > 0
      ? minPrice
      : (trek.discountedPrice ?? trek.price);

  const trekReviews = Array.isArray(trek.reviews) ? (trek.reviews as any[]) : [];
  const sectionNavIds = [
    'key-points',
    'trip-overview',
    trek.highlights ? 'highlights' : null,
    itineraryDays.length > 0 ? 'itinerary' : null,
    'include',
    trek.mapImage || elevationProfile.length > 0 ? 'altitude-chart' : null,
    packingItems.length > 0 ? 'equipment' : null,
    trekReviews.length > 0 ? 'reviews' : null,
    linkedFaqs.length > 0 ? 'faqs' : null,
    shapedDepartures.length > 0 ? 'departures' : null,
  ].filter((id): id is string => Boolean(id));

  return (
    <div className="journey-page min-h-screen bg-[#f4f6f8] font-sans text-gray-800 pb-24">

      {/* Breadcrumbs */}
      <div className="mx-auto px-5 lg:px-20 pt-28 pb-4 text-[13px] font-bold text-gray-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-[#24a0ed] transition-colors">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/trekking" className="hover:text-[#24a0ed] transition-colors">Trekking</Link>
        <span className="mx-2">›</span>
        <span className="text-[#112233]">{trek.title}</span>
      </div>

      <StickySectionNav sectionIds={sectionNavIds} />

      {/* =========================================================
          MAIN GRID
      ========================================================= */}
      <section className="site-container relative z-20" data-sticky-booking-section>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,2fr)_410px] gap-6 xl:gap-8 md:items-start">

          {/* =====================================================
              RIGHT SIDEBAR
          ===================================================== */}
          <StickyBookingSidebar>

              {/* Booking / Pricing */}
            <div className="journey-panel bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 space-y-6 relative overflow-hidden">
              
              {/* Best Price Sash */}
              <div className="absolute top-0 right-0 overflow-hidden w-32 h-32 pointer-events-none z-10">
                <div className="absolute top-[24px] -right-[32px] w-[130px] bg-[#ffc107] text-[#112233] text-[11px] font-black uppercase tracking-widest text-center py-2 rotate-45 shadow-sm">
                  Best Price
                </div>
              </div>

              {/* Price & Duration */}
              <div className="relative z-20 pb-2">
                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  From
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-[#112233] tracking-tighter">
                    US$ {minPriceDisplay.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-gray-500 ml-1">/ person</span>
                </div>
                
                {regularPrice > minPrice && (() => {
                  const percentOff = Math.round((saveAmount / regularPrice) * 100);
                  return (
                    <div className="mt-3 text-sm font-medium text-gray-500 flex items-center flex-wrap gap-2">
                      <span>Regular: <span className="line-through">US$ {regularPrice.toLocaleString()}</span></span>
                      <span className="text-green-600 font-bold">Save US$ {saveAmount.toLocaleString()}</span>
                      <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider">{percentOff}% OFF</span>
                    </div>
                  );
                })()}
                
                <div className="mt-6 text-lg font-medium text-[#112233] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#24a0ed]" />
                  Duration: {String(trek.durationDays).toLowerCase().includes('day') ? trek.durationDays : `${trek.durationDays} days`}
                </div>
              </div>

              {/* Group Discounts */}
              {trek.groupPrices && trek.groupPrices.length > 0 && (
                <details open className="group border border-[#e6e9ee] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden mt-4">
                  <summary className="bg-[#f4f7fb] p-4 font-bold text-[#112233] uppercase tracking-wide text-sm cursor-pointer flex justify-between items-center transition-colors">
                    <span>Group-Size Price Tiers</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  
                  <div className="bg-white">
                    <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest text-[9px] px-4 py-3 border-b border-gray-100">
                      <span className="w-1/3">Group Size</span>
                      <span className="w-1/3 text-center">Price / Pax</span>
                      <span className="w-1/3 text-right">Action</span>
                    </div>

                    <div className="flex flex-col">
                      {[...trek.groupPrices].sort((a: any, b: any) => parseInt(a.groupSize) - parseInt(b.groupSize)).map((gp: any) => (
                        <div key={gp.id} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0">
                          <div className="font-semibold text-[#112233] w-1/3">{gp.groupSize}</div>
                          <div className="font-bold text-[#1a73e8] w-1/3 text-center">US$ {gp.price}</div>
                          <div className="w-1/3 text-right">
                            <Link href={`/booking-form/?trip_id=${trek.id}`} className="inline-block bg-[#112233] hover:bg-[#1a2b44] text-white text-[11px] uppercase font-bold px-4 py-2 rounded-md transition-colors">
                              Book
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href={`/booking-form/?trip_id=${trek.id}`}
                  className="w-full bg-gradient-to-b from-[#3b99fc] to-[#0a65cc] text-white font-bold py-3.5 rounded-xl text-center transition-all shadow-md hover:shadow-lg uppercase tracking-wide block text-sm flex justify-center items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Check Availability
                </Link>

                <Link
                  href="/send-inquiry"
                  className="w-full bg-white border-2 border-[#e6e9ee] text-[#112233] font-bold py-3 rounded-xl text-center transition-colors uppercase tracking-wide block text-sm flex justify-center items-center gap-2 hover:border-[#cfd5e1]"
                >
                  <MessageSquare className="w-5 h-5" />
                  Make An Inquiry
                </Link>
              </div>

              {/* Trust Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="flex items-center gap-3 p-3 bg-white border border-[#e6e9ee] rounded-xl shadow-sm">
                  <div className="bg-green-50 p-2 rounded-full border border-green-100 text-green-500 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#112233] leading-tight">Instant<br/>Booking</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-[#e6e9ee] rounded-xl shadow-sm">
                  <div className="bg-blue-50 p-2 rounded-full border border-blue-100 text-[#24a0ed] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#112233] leading-tight">Secure<br/>Payments</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-[#e6e9ee] rounded-xl shadow-sm">
                  <div className="bg-purple-50 p-2 rounded-full border border-purple-100 text-purple-500 shrink-0">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#112233] leading-tight">No Hidden<br/>Costs</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-[#e6e9ee] rounded-xl shadow-sm">
                  <div className="bg-amber-50 p-2 rounded-full border border-amber-100 text-amber-500 shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#112233] leading-tight">Best Price<br/>Guarantee</span>
                </div>
              </div>
            </div>

            {/* Extra Sidebar Actions */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Link href="/send-inquiry" className="bg-white border border-gray-300 hover:border-[#24a0ed] hover:text-[#24a0ed] hover:shadow-md text-gray-800 font-bold text-sm uppercase tracking-wider py-4 rounded-xl text-center transition-all flex justify-center items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Customize
              </Link>
              <button className="bg-white border border-gray-300 hover:border-[#24a0ed] hover:text-[#24a0ed] hover:shadow-md text-gray-800 font-bold text-sm uppercase tracking-wider py-4 rounded-xl text-center transition-all flex justify-center items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </button>
            </div>
            
            {/* Reviews / Badges */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#34E0A1] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.1 14.5l-3.1-2.1-3.1 2.1 1.2-3.7-2.9-2.3h3.7l1.1-3.6 1.1 3.6h3.7l-2.9 2.3 1.2 3.7z"/>
                </svg>
              </div>
              <div>
                <div className="text-md font-bold text-gray-500 uppercase tracking-wider">Excellent</div>
                <div className="flex text-amber-500 my-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="text-[10px] text-gray-400 font-bold">Based on 120 reviews</div>
              </div>
            </div>
          </StickyBookingSidebar>

          {/* =====================================================
              RIGHT COLUMN (Now Main Content on Left, order-1)
          ===================================================== */}
          <div className="min-w-0 space-y-6 md:order-1">

            {/* Gallery */}
            <div className="w-full">
              <TrekGalleryGrid
                title={trek.title}
                mainImage={heroImage}
                galleryImages={galleryImages}
              />
            </div>

            {/* Title & Quick Info */}
            <div className="space-y-4 pb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#112233]">
                {trek.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#f28b18]">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="text-[16px] text-[#333333]">
                  {trek.rate ? `${trek.rate}.0` : "5.0"}/5 from <a href="#review">835 reviews</a>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[16px] font-bold text-gray-600">
                
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{trek.durationDays}</span>
                </div>
                
                <div className="w-[1px] h-3 bg-gray-300 hidden md:block" />
                
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{trek.difficulty}</span>
                </div>
                
                <div className="w-[1px] h-3 bg-gray-300 hidden md:block" />
                
                <div className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4" />
                  <span>Max. Altitude {trek.maxAltitude}</span>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="text-lg text-gray-600 leading-relaxed pb-4">
              <div className="line-clamp-3 overflow-hidden text-ellipsis [&>p]:inline" dangerouslySetInnerHTML={{ __html: toHtml(trek.overview) }} />
            </div>

            <section className=" mt-10">
{/* ===================================================
                QUICK FACTS (Unified Card UI)
            =================================================== */}
            <div id="key-points" className="scroll-mt-[118px]" />

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
  {/* Changed gap-y-8 to gap-6 md:gap-8 for equal horizontal and vertical spacing */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
    
    <div className="flex items-start gap-4">
      <MapPin className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" />
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Destination</span>
        <span className="text-[20px] font-bold text-[#112233]">{trek.startPoint || "Nepal"}</span>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <Calendar className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" />
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Duration</span>
        <span className="text-[20px] font-bold text-[#112233]">{trek.durationDays}</span>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <ActivityIcon className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" />
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Trip Difficulty</span>
        <span className="text-[20px] font-bold text-amber-600">{trek.difficulty}</span>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <Home className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" />
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Accommodation</span>
        <span className="text-[20px] font-bold text-[#112233]">{trek.accommodation || "Hotel / Guesthouse"}</span>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <Utensils className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" />
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Meals</span>
        <span className="text-[20px] font-bold text-[#112233] flex items-center gap-1">
          {trek.meals || "B, L, D"}
          <div className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[8px] text-gray-400 font-bold cursor-help" title="Breakfast, Lunch, Dinner">i</div>
        </span>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <svg className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Group Size</span>
        <span className="text-[20px] font-bold text-[#112233]">Min. 1 Pax</span>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <svg className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Best Time</span>
        <span className="text-[20px] font-bold text-[#112233]">{trek.bestSeason || "Mar - May & Sept - Dec"}</span>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <Mountain className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" />
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Max. Elevation</span>
        <span className="text-[20px] font-bold text-[#112233]">{trek.maxAltitude}</span>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <Flag className="w-6 h-6 text-gray-700 shrink-0 stroke-[1.5]" />
      <div className="flex flex-col">
        <span className="text-[16px] text-gray-500 font-bold mb-1">Activities</span>
        <span className="text-[20px] font-bold text-[#112233]">{trek.activity || "Trekking"}</span>
      </div>
    </div>

  </div>
</div>

            
</section>

            {/* ===================================================
                TRIP OVERVIEW
            =================================================== */}
            <div
              id="trip-overview"
              className="scroll-mt-[118px]"
            />

            <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">

              <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                Trip Overview
              </h2>

              <div
                className="text-gray-600 text-md md:text-lg leading-relaxed rich-content"
                dangerouslySetInnerHTML={{
                  __html: toHtml(trek.overview),
                }}
              />

            </Reveal>

            {/* ===================================================
                HIGHLIGHTS
            =================================================== */}
            {trek.highlights && (
              <>
                <div
                  id="highlights"
                  className="scroll-mt-[118px]"
                />

                <Reveal className="journey-panel bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#eaf4f1] rounded-full flex items-center justify-center shrink-0">
                      <Mountain className="w-6 h-6 text-[#1e857c]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold oswald uppercase text-[#112233]">
                        HIGHLIGHTS
                      </h2>
                      <div className="w-12 h-1 bg-[#1e857c] mt-1"></div>
                    </div>
                  </div>

                  <div
                    className="highlights-list"
                    dangerouslySetInnerHTML={{
                      __html: toHtml(trek.highlights),
                    }}
                  />
                </Reveal>
              </>
            )}

            {/* ===================================================
                ITINERARY
            =================================================== */}
            {itineraryDays.length > 0 && (
              <>
                <div
                  id="itinerary"
                  className="scroll-mt-[118px]"
                />

                <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">

                  <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
                    Itinerary
                  </h2>
                  <div className="journey-itinerary space-y-4">
                    {itineraryDays.map((day: any, index: number) => (
                      <details
                        key={index}
                        className="group rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 open:shadow-md"
                      >
                        <summary className="list-none cursor-pointer flex items-center justify-between gap-4 p-4 transition-colors hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            {/* Day Badge */}
                            <div className="bg-gray-100 text-gray-600 group-open:bg-[#f26522] group-open:text-white rounded-xl flex flex-col items-center justify-center w-[54px] h-[54px] shrink-0 transition-colors">
                              <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Day</span>
                              <span className="text-xl font-black leading-none oswald">{(day.day || index + 1).toString().padStart(2, '0')}</span>
                            </div>
                            <h3 className="font-bold text-[#112233] text-[17px]">{day.title}</h3>
                          </div>
                          
                          <div className="flex items-center gap-5 shrink-0">
                            {/* Decorative Icon */}
                            <Mountain className="w-6 h-6 text-gray-600 hidden sm:block stroke-[1.5]" />
                            {/* Caret */}
                            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                              <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform duration-300" />
                            </div>
                          </div>
                        </summary>

                        <div className="px-6 py-6 border-t border-gray-100 bg-white">
                          
                          {/* Description */}
                          <div
                            className="text-gray-600 text-[14px] leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{
                              __html: toHtml(day.desc),
                            }}
                          />

                          {/* 4-Grid Stats */}
                          {(day.startPoint || day.endPoint || day.distance || day.hours) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                              {day.startPoint && (
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                                  <div className="bg-gray-50 w-12 h-12 rounded-lg border border-gray-100 flex items-center justify-center text-[#f26522] shrink-0">
                                    <MapPin className="w-5 h-5 stroke-[1.5]" />
                                  </div>
                                  <div>
                                    <div className="text-[14px] font-bold text-[#112233] mb-0.5">Starting Point</div>
                                    <div className="text-[13px] text-gray-500">{day.startPoint}</div>
                                  </div>
                                </div>
                              )}

                              {day.endPoint && (
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                                  <div className="bg-gray-50 w-12 h-12 rounded-lg border border-gray-100 flex items-center justify-center text-[#f26522] shrink-0">
                                    <Flag className="w-5 h-5 stroke-[1.5]" />
                                  </div>
                                  <div>
                                    <div className="text-[14px] font-bold text-[#112233] mb-0.5">Ending Point</div>
                                    <div className="text-[13px] text-gray-500">{day.endPoint}</div>
                                  </div>
                                </div>
                              )}

                              {day.hours && (
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                                  <div className="bg-gray-50 w-12 h-12 rounded-lg border border-gray-100 flex items-center justify-center text-[#f26522] shrink-0">
                                    <Clock className="w-5 h-5 stroke-[1.5]" />
                                  </div>
                                  <div>
                                    <div className="text-[14px] font-bold text-[#112233] mb-0.5">Duration</div>
                                    <div className="text-[13px] text-gray-500">{day.hours}</div>
                                  </div>
                                </div>
                              )}

                              {day.distance && (
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                                  <div className="bg-gray-50 w-12 h-12 rounded-lg border border-gray-100 flex items-center justify-center text-[#f26522] shrink-0">
                                    <Map className="w-5 h-5 stroke-[1.5]" />
                                  </div>
                                  <div>
                                    <div className="text-[14px] font-bold text-[#112233] mb-0.5">Total Distance</div>
                                    <div className="text-[13px] text-gray-500">{day.distance}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Important Note */}
                          {day.note && (
                            <div className="flex items-start gap-4 p-5 rounded-xl border border-[#f26522]/30 bg-[#fff8f4] mb-6">
                              <AlertCircle className="w-6 h-6 text-[#f26522] shrink-0 mt-0.5" />
                              <div>
                                <div className="font-bold text-[#f26522] text-[15px] mb-1">Important Note</div>
                                <div className="text-[13px] text-gray-700 leading-relaxed">{day.note}</div>
                              </div>
                            </div>
                          )}

                          {/* Gallery Images */}
                          {Array.isArray(day.gallery) && day.gallery.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                              {day.gallery
                                .filter((src: string) => Boolean(src))
                                .map((src: string, galleryIndex: number) => (
                                  <img
                                    key={galleryIndex}
                                    src={src}
                                    alt={`Day ${day.day || index + 1} gallery`}
                                    className="w-full h-24 object-cover rounded-xl shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                    loading="lazy"
                                  />
                                ))}
                            </div>
                          )}

                        </div>
                      </details>
                    ))}
                  </div>
                </Reveal>
              </>
            )}

            {/* ===================================================
                INCLUDES / EXCLUDES
            =================================================== */}
            <div
              id="include"
              className="scroll-mt-[118px]"
            />

            <Stagger className="flex flex-col gap-6">

              <StaggerItem className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#eaf4f1] rounded-full flex items-center justify-center shrink-0">
                    <Mountain className="w-6 h-6 text-[#1e857c]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold oswald uppercase text-[#112233]">
                      PACKAGE INCLUDES
                    </h2>
                    <div className="w-12 h-1 bg-[#1e857c] mt-1"></div>
                  </div>
                </div>

                {trek.inclusions && (
                  <div
                    className="highlights-list"
                    dangerouslySetInnerHTML={{
                      __html: toHtml(trek.inclusions),
                    }}
                  />
                )}

              </StaggerItem>

              <StaggerItem
                id="exclude"
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-[118px]"
              >

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#fdeded] rounded-full flex items-center justify-center shrink-0">
                    <Mountain className="w-6 h-6 text-[#c84c31]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold oswald uppercase text-[#c84c31]">
                      PACKAGE EXCLUDES
                    </h2>
                    <div className="w-12 h-1 bg-[#c84c31] mt-1"></div>
                  </div>
                </div>

                {trek.exclusions && (
                  <div
                    className="exclusions-list"
                    dangerouslySetInnerHTML={{
                      __html: toHtml(trek.exclusions),
                    }}
                  />
                )}

              </StaggerItem>

            </Stagger>

            {/* =========================================================
                ROUTE MAP & ELEVATION PROFILE (VIDEO SYNCED)
            ========================================================= */}
            {(trek.mapImage || elevationProfile.length > 0) && (
              <section id="altitude-chart" className="scroll-mt-[118px]">

                {trek.mapImage && (
                  <RouteMapImage
                    src={trek.mapImage}
                    alt={`${trek.title} route map`}
                  />
                )}

                {elevationProfile.length > 0 && (
                  <div className={trek.mapImage ? "mt-10" : ""}>
                    <VideoSyncedElevationProfile
                      elevationData={elevationProfile}
                      chartTitle={trek.title}
                    />
                  </div>
                )}

              </section>
            )}

            {/* =========================================================
                EQUIPMENT & GEARS
            ========================================================= */}
            {packingItems.length > 0 && (
              <section id="equipment" className="scroll-mt-[118px]">
                <PackingListSection items={packingItems as any[]} categories={packingCategories} />
              </section>
            )}

            {/* =========================================================
                CLIENT REVIEWS
            ========================================================= */}
            <TripReviewsSection reviews={trekReviews} />

            {/* =========================================================
                FAQS
            ========================================================= */}
            {linkedFaqs.length > 0 && (
              <section id="faqs" className="scroll-mt-[118px]">
                <FAQAccordion faqs={linkedFaqs} />
              </section>
            )}

            {/* =========================================================
                FIXED DEPARTURES
            ========================================================= */}
            {shapedDepartures.length > 0 && (
              <section id="departures" className="scroll-mt-[118px]">
                <FixedDepartures
                  data={shapedDepartures as any[]}
                  label="Departure Dates"
                  title={`${trek.title} – Fixed Departures`}
                  embedded
                />
              </section>
            )}

            {/* =========================================================
                TREK VIDEO WITH SYNCED ELEVATION PROFILE
            ========================================================= */}
            {trek.videoUrl && trek.videoType ? (
              <TrekVideoWithSync
                videoUrl={trek.videoUrl}
                videoType={trek.videoType as 'youtube' | 'upload'}
                title={trek.title}
                elevationData={elevationProfile}
                embedded
              />
            ) : null}

          </div>
        </div>
      </section>

{/* =========================================================
          RELATED TREKS
      ========================================================= */}
      {relatedTreks.length > 0 && (
        <section className="site-container mt-20">

          <Reveal className="text-2xl font-black oswald uppercase text-[#112233] mb-6">
            You May Also Like
          </Reveal>

          <Stagger className="flex flex-col sm:flex-row sm:flex-wrap gap-4 md:gap-6">

            {relatedTreks.map((item) => {
              const relatedHeroImage =
                item.heroImage || FALLBACK_IMAGE;

              return (
                <StaggerItem
                  key={item.id}
                  className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-md sm:flex-[0_1_calc((100%_-_1rem)_/_2)] lg:flex-[0_1_calc((100%_-_3rem)_/_3)] xl:flex-[0_1_calc((100%_-_4.5rem)_/_4)]"
                >
                  <Link href={`/trekking/${item.slug ? item.slug : item.id}`} className="absolute inset-0">
                    {/* Image */}
                    <img 
                      src={relatedHeroImage} 
                      alt={item.title}
                      className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]`}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                      <h3 className="text-2xl font-display font-medium text-white mb-3 group-hover:text-accent-amber transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/70 text-lg font-sans mb-3">
                        <span className="flex items-center gap-1.5">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-80">
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                          </svg>
                          {item.durationDays}
                        </span>
                      </div>
                      <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="text-white hover:text-accent-amber text-lg font-sans pt-3 border-t border-white/20 mt-2 flex items-center gap-2 font-semibold transition-colors">
                          View Details
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {item.price && (
                    <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-sm text-white font-sans font-black text-md px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                      From ${(item.discountedPrice ?? item.price).toLocaleString()}
                    </div>
                  )}
                </StaggerItem>
              );
            })}

          </Stagger>

        </section>
      )}

    </div>
  );
}
