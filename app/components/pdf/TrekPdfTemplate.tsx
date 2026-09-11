import React from "react";
import { Mountain, Activity, Clock, MapPin, Users, Calendar, CheckCircle2, DollarSign, BarChart2, CalendarDays, Map } from "lucide-react";
import { toHtml } from "@/app/lib/html";

interface TrekPdfTemplateProps {
  trek: any;
  heroImage: string;
  siteSettings?: any;
}

export default function TrekPdfTemplate({ 
  trek, 
  heroImage,
  siteSettings 
}: TrekPdfTemplateProps) {
  // Helpers
  const itineraryDays = Array.isArray(trek.itinerary)
    ? trek.itinerary.filter((day: any) => day && day.title)
    : [];
    
  const packingItems = Array.isArray(trek.packingItems)
    ? trek.packingItems.filter((item: any) => item.name)
    : [];

  const equipmentItems = packingItems.filter((i: any) => i.category === "EQUIPMENT" || !i.category).slice(0, 8);
  const clothingItems = packingItems.filter((i: any) => i.category === "CLOTHING").slice(0, 8);

  // Inclusions
  const inclusions = Array.isArray(trek.inclusions) 
    ? trek.inclusions.filter((inc: any) => inc && inc.content)
    : [];

  return (
    <div 
      id="pdf-content-wrapper" 
      style={{ position: "absolute", left: "-9999px", top: "-9999px", pointerEvents: "none" }}
    >
      <div 
        id="trek-pdf-content"
        className="bg-white text-gray-800 font-sans relative"
        style={{ width: "794px", minHeight: "1123px", fontSize: "12px" }}
      >
        {/* Watermark Overlay (Repeats logo faintly across all pages) */}
        {siteSettings?.logoImage && (
          <div className="absolute inset-0 z-[100] pointer-events-none opacity-[0.03] flex flex-wrap justify-center items-center gap-24 p-12 overflow-hidden mix-blend-multiply">
            {Array.from({ length: 30 }).map((_, i) => (
              <img 
                key={i}
                data-proxy="true"
                src={siteSettings.logoImage} 
                className="w-56 h-56 object-contain -rotate-12 grayscale" 
                crossOrigin="anonymous" 
                alt=""
              />
            ))}
          </div>
        )}
        {/* =========================================================
            1. HERO SECTION
        ========================================================= */}
        <div 
          className="relative flex flex-col justify-between overflow-hidden"
          style={{ height: "650px" }}
        >
          {/* Background Image using img tag instead of CSS background for better html2canvas support */}
          <img 
            id="pdf-hero-image"
            data-proxy="true"
            src={heroImage} 
            crossOrigin="anonymous"
            alt="Hero Background"
            className="absolute inset-0 z-0 w-full h-full object-cover"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/90 via-transparent to-black/80" />

          {/* Top Logo */}
          <div className="relative z-20 pt-10 flex flex-col items-center">
            {siteSettings?.logoImage ? (
              <img 
                data-proxy="true"
                src={siteSettings.logoImage} 
                alt="Logo" 
                className="h-16 object-contain" 
                crossOrigin="anonymous" 
              />
            ) : (
              <>
                <Mountain className="w-16 h-16 text-[#112233]" />
                <h1 className="text-xl font-bold tracking-widest text-[#112233] mt-2">EVER PEAK</h1>
                <p className="text-xs tracking-widest text-[#112233]">ADVENTURES</p>
              </>
            )}
          </div>

          {/* Title Area */}
          <div className="relative z-20 flex flex-col items-center pb-24 text-center">
            <h1 className="text-4xl px-8 font-extrabold text-white tracking-wider leading-tight mb-2 uppercase drop-shadow-lg">
              {trek.title}
            </h1>
            <p className="text-2xl text-white font-medium drop-shadow-md">
              ({trek.primaryDestination || "Nepal"})
            </p>
          </div>

          {/* Bottom Bars */}
          <div className="relative z-20 flex flex-col w-full">
            <div className="bg-[#e67e22] text-white text-center py-3 text-lg font-bold tracking-widest uppercase">
              TAILOR MADE ITINERARY
            </div>
            <div className="bg-[#2980b9] text-white text-center py-4 text-xl font-extrabold tracking-[0.15em] uppercase">
              HIGH ADVENTURE ESSENTIAL GUIDE
            </div>
          </div>
        </div>

        {/* =========================================================
            2. TRIP OVERVIEW
        ========================================================= */}
        {trek.overview && (
          <div className="bg-[#f8f9fa] py-10 px-16">
            <h2 className="text-xl font-bold text-[#2c3e50] tracking-widest uppercase mb-6 text-center">
              Trip Overview
            </h2>
            <div 
              className="text-[13px] text-gray-700 leading-relaxed text-justify max-w-4xl mx-auto [&>p]:mb-4 [&>p:last-child]:mb-0 [&>strong]:block [&>strong]:text-[#2c3e50] [&>strong]:text-base [&>strong]:mt-6 [&>strong]:mb-2 [&>h3]:text-[#2c3e50] [&>h3]:font-bold [&>h3]:text-base [&>h3]:mt-6 [&>h3]:mb-2 [&>h4]:text-[#2c3e50] [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-1"
              dangerouslySetInnerHTML={{ __html: toHtml(trek.overview).replace(/<\/p><br\/>/gi, '</p>') }}
            />
          </div>
        )}

        {/* =========================================================
            2.5 HIGHLIGHTS & DETAILS
        ========================================================= */}
        {trek.highlights && (
          <div className="bg-white py-10 px-16 border-t border-gray-100">
            <h2 className="text-xl font-bold text-[#2c3e50] tracking-widest uppercase mb-6 text-center">
              Trip Highlights & Important Details
            </h2>
            <div 
              className="text-[13px] text-gray-700 leading-relaxed max-w-4xl mx-auto [&>h3]:text-[#2980b9] [&>h3]:font-bold [&>h3]:uppercase [&>h3]:tracking-wider [&>h3]:mb-3 [&>h3]:mt-8 [&>ul]:grid [&>ul]:grid-cols-2 [&>ul]:gap-x-8 [&>ul]:gap-y-2 [&>ul]:mb-6 [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:gap-2 [&>p]:mb-4"
              dangerouslySetInnerHTML={{ __html: trek.highlights.replace(/<li[^>]*>/gi, '<li><span style="color:#e67e22;margin-top:2px;">✦</span> ') }}
            />
          </div>
        )}

        {/* =========================================================
            3. QUICK FACTS & ESSENTIALS
        ========================================================= */}
        <div className="px-16 py-10 grid grid-cols-[1fr_300px] gap-8 bg-white items-start">
          
          {/* Trip At A Glance (Blue Box) */}
          <div className="bg-[#f1f5f9] rounded-xl overflow-hidden border border-[#e2e8f0]">
            <div className="bg-[#2980b9] text-white px-6 py-4">
              <h3 className="font-bold text-lg uppercase tracking-wider">Trip At A Glance</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                {trek.activity && (
                  <div className="flex items-center gap-4">
                    <Activity className="w-8 h-8 text-[#2980b9]" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Activity</div>
                      <div className="text-sm font-bold text-[#2c3e50]">{trek.activity}</div>
                    </div>
                  </div>
                )}
                {trek.durationDays && (
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-[#2980b9]" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duration</div>
                      <div className="text-sm font-bold text-[#2c3e50]">{trek.durationDays} Days</div>
                    </div>
                  </div>
                )}
                {trek.maxAltitude && (
                  <div className="flex items-center gap-4">
                    <Mountain className="w-8 h-8 text-[#2980b9]" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Max Altitude</div>
                      <div className="text-sm font-bold text-[#2c3e50]">{trek.maxAltitude}</div>
                    </div>
                  </div>
                )}
                {trek.bestSeason && (
                  <div className="flex items-center gap-4">
                    <Calendar className="w-8 h-8 text-[#2980b9]" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Best Season</div>
                      <div className="text-sm font-bold text-[#2c3e50]">{trek.bestSeason}</div>
                    </div>
                  </div>
                )}
                {trek.groupSize && (
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-[#2980b9]" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Group Size</div>
                      <div className="text-sm font-bold text-[#2c3e50]">{trek.groupSize}</div>
                    </div>
                  </div>
                )}
                {trek.price && (
                  <div className="flex items-center gap-4">
                    <DollarSign className="w-8 h-8 text-[#2980b9]" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Price From</div>
                      <div className="text-sm font-bold text-[#2c3e50]">${trek.price}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trip Logistics (Orange Box) */}
          <div className="bg-[#f1f5f9] rounded-xl overflow-hidden border border-[#e2e8f0]">
            <div className="bg-[#e67e22] text-white px-6 py-4">
              <h3 className="font-bold text-lg uppercase tracking-wider">Trip Logistics</h3>
            </div>
            <div className="p-6 space-y-6">
              {trek.difficulty && (
                <div>
                  <div className="text-xs text-[#e67e22] uppercase font-bold tracking-wider mb-1">Difficulty Level</div>
                  <div className="text-sm font-bold text-[#2c3e50]">{trek.difficulty}</div>
                </div>
              )}
              {trek.meals && (
                <div>
                  <div className="text-xs text-[#e67e22] uppercase font-bold tracking-wider mb-1">Meals Included</div>
                  <div className="text-sm font-bold text-[#2c3e50]">{trek.meals}</div>
                </div>
              )}
              {trek.accommodation && (
                <div>
                  <div className="text-xs text-[#e67e22] uppercase font-bold tracking-wider mb-1">Accommodation</div>
                  <div className="text-sm font-bold text-[#2c3e50]">{trek.accommodation}</div>
                </div>
              )}
              {trek.startPoint && (
                <div>
                  <div className="text-xs text-[#e67e22] uppercase font-bold tracking-wider mb-1">Start Point</div>
                  <div className="text-sm font-bold text-[#2c3e50]">{trek.startPoint}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            4. ITINERARY IN DETAIL
        ========================================================= */}
        <div className="bg-white py-10 px-16">
          <div className="flex items-center justify-between border-b-2 border-[#e67e22] pb-4 mb-8">
            <h2 className="text-2xl font-bold text-[#2c3e50] uppercase tracking-widest">
              Itinerary In Detail
            </h2>
            {trek.price && (
              <div className="bg-[#2c3e50] text-white px-6 py-2 rounded-t-lg flex items-baseline">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 mr-2">Starting from:</span>
                <span className="text-xl font-bold text-[#e67e22]">US ${trek.price}</span>
                <span className="text-xs ml-1 opacity-80">/ per person</span>
              </div>
            )}
          </div>

          <div className="relative pl-8 border-l-2 border-dashed border-[#e67e22] space-y-12 pb-10">
            {itineraryDays.map((day: any, idx: number) => {
              const dayNum = String(idx + 1).padStart(2, "0");
              return (
                <div key={idx} className="relative">
                  {/* Number Circle */}
                  <div className="absolute -left-[45px] top-0 w-[26px] h-[26px] bg-[#e67e22] rounded-full flex items-center justify-center text-white text-xs font-bold border-4 border-white shadow-sm">
                    {dayNum}
                  </div>

                  {/* Header */}
                  <div className="mb-4">
                    <div className="text-[#e67e22] font-black text-sm uppercase tracking-widest mb-1">
                      DAY {dayNum}
                    </div>
                    <h4 className="text-lg font-bold text-[#2c3e50] uppercase leading-tight">
                      {day.title}
                    </h4>
                  </div>

                  <div className="flex gap-6">
                    {/* Details Box + Desc */}
                    <div className="flex-1">
                      {/* Box */}
                      <div className="bg-[#f8f9fa] border border-[#e2e8f0] p-4 flex gap-6 text-sm mb-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#7f8c8d]" />
                          <span className="font-bold text-[#2c3e50]">Altitude:</span>
                          <span className="text-gray-600">{day.altitude || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#7f8c8d]" />
                          <span className="font-bold text-[#2c3e50]">Duration:</span>
                          <span className="text-gray-600">{day.duration || "N/A"}</span>
                        </div>
                      </div>
                      
                      {/* Desc */}
                      <div 
                        className="text-[13px] text-gray-600 leading-relaxed text-justify"
                        dangerouslySetInnerHTML={{ __html: day.desc.replace(/(<([^>]+)>)/gi, "") }}
                      />
                    </div>

                    {/* Image if available */}
                    {day.image && (
                      <div className="w-[160px] h-[160px] shrink-0 rounded-lg overflow-hidden border-2 border-white shadow-md">
                        <img src={day.image} alt={day.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* =========================================================
            4.5 ROUTE MAP
        ========================================================= */}
        {trek.mapImage && (
          <div className="bg-[#f8f9fa] py-10 px-16">
            <h2 className="text-xl font-bold text-[#2c3e50] tracking-widest uppercase mb-6 text-center">
              Route Map
            </h2>
            <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <img 
                data-proxy="true"
                src={trek.mapImage}
                crossOrigin="anonymous"
                alt="Route Map"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* =========================================================
            4.6 GALLERY
        ========================================================= */}
        {Array.isArray(trek.gallery) && trek.gallery.length > 0 && (
          <div className="bg-white py-10 px-16">
            <h2 className="text-xl font-bold text-[#2c3e50] tracking-widest uppercase mb-6 text-center">
              Gallery
            </h2>
            <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
              {trek.gallery.slice(0, 6).map((img: string, idx: number) => (
                <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm">
                  <img 
                    data-proxy="true"
                    src={img}
                    crossOrigin="anonymous"
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            5. INCLUSIONS & EXCLUSIONS
        ========================================================= */}
        {(trek.inclusions || trek.exclusions) && (
          <div className="px-16 py-10 bg-[#f8f9fa] grid grid-cols-2 gap-8 items-start">
            {trek.inclusions && (
              <div className="bg-[#f1f5f9] rounded-xl overflow-hidden border border-[#e2e8f0]">
                <div className="bg-[#2980b9] text-white px-6 py-4">
                  <h3 className="font-bold text-lg uppercase tracking-wider">What is Included</h3>
                </div>
                <div className="p-6">
                  <div 
                    className="text-[13px] text-gray-700 leading-relaxed [&>ul]:space-y-3 [&>ul>li]:flex [&>ul>li]:gap-2 [&>ul>li]:items-start"
                    dangerouslySetInnerHTML={{ __html: trek.inclusions.replace(/<li[^>]*>/gi, '<li><span style="background-color:#2980b9;color:white;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;margin-top:2px;flex-shrink:0;">✔</span> ') }}
                  />
                </div>
              </div>
            )}
            
            {trek.exclusions && (
              <div className="bg-[#fff5f5] rounded-xl overflow-hidden border border-[#fed7d7]">
                <div className="bg-[#c84c31] text-white px-6 py-4">
                  <h3 className="font-bold text-lg uppercase tracking-wider">What is Excluded</h3>
                </div>
                <div className="p-6">
                  <div 
                    className="text-[13px] text-gray-700 leading-relaxed [&>ul]:space-y-3 [&>ul>li]:flex [&>ul>li]:gap-2 [&>ul>li]:items-start"
                    dangerouslySetInnerHTML={{ __html: trek.exclusions.replace(/<li[^>]*>/gi, '<li><span style="background-color:#c84c31;color:white;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;margin-top:2px;flex-shrink:0;">✘</span> ') }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            6. EQUIPMENT
        ========================================================= */}
        {packingItems.length > 0 && (
          <div className="px-16 py-10 bg-white flex items-start gap-12">
            <div className="flex-1">
              <h2 className="text-xl font-black text-[#2c3e50] uppercase tracking-wider border-b border-[#e2e8f0] pb-4 mb-6">
                Equipment & Clothing
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h4 className="font-bold text-[#2980b9] mb-3 text-sm uppercase">Equipment</h4>
                  <ul className="space-y-2">
                    {equipmentItems.map((item: any, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-[13px] text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#e67e22]" />
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#2980b9] mb-3 text-sm uppercase">Clothing</h4>
                  <ul className="space-y-2">
                    {clothingItems.map((item: any, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-[13px] text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#e67e22]" />
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            5.5 IMPORTANT NOTE / DISCLAIMER
        ========================================================= */}
        <div className="bg-white px-16 pb-12">
          <div className="bg-gradient-to-r from-[#fffbeb] to-white border-l-4 border-[#f59e0b] p-6 rounded-r-xl shadow-sm">
            <div className="flex gap-4">
              <svg className="w-6 h-6 text-[#f59e0b] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-[13px] font-bold text-[#92400e] uppercase tracking-widest mb-1.5">Important Trip Note</h4>
                <p className="text-[11.5px] text-[#b45309] leading-relaxed">
                  The above itinerary is a general guide to the standard trekking route. Please note that the daily schedule is subject to change due to unpredictable mountain weather, trail conditions, the acclimatization pace of the group, and other unforeseen circumstances. Our experienced lead guide will always prioritize the safety and well-being of the team and may modify the route if deemed absolutely necessary. We strongly advise securing comprehensive travel insurance that covers high-altitude trekking and emergency helicopter evacuation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            6. FOOTER
        ========================================================= */}
        <div className="bg-[#112233] text-white px-16 py-8 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {siteSettings?.logoImage ? (
              <img src={`/api/proxy-image?url=${encodeURIComponent(siteSettings.logoImage)}`} alt="Logo" className="h-10 object-contain" crossOrigin="anonymous" />
            ) : (
              <Mountain className="w-8 h-8 text-[#e67e22]" />
            )}
            <div>
              <div className="font-bold tracking-widest uppercase text-sm">Ever Peak</div>
              <div className="text-[10px] tracking-widest text-gray-400">ADVENTURES</div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-300 space-y-1">
            <p>{siteSettings?.email || "info@everpeakadventures.com"}</p>
            <p>{siteSettings?.emergencyPhone || siteSettings?.whatsapp || siteSettings?.emergencyLandline || "+977 9851000000"}</p>
            <p className="text-[#e67e22]">{siteSettings?.addressLine1 ? siteSettings.addressLine1.replace(/https?:\/\/[^\s]+/g, 'www.everpeakadventures.com') : "www.everpeakadventures.com"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
