import { Calendar, Footprints, Headphones, ShieldCheck, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { JSX, SVGProps, ComponentType } from 'react';

// Map string icon names from DB to actual Lucide components
const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  ShieldCheck,
  Footprints,
  Headphones,
  Users,
};

export default async function Hero() {
  // Fetch hero configuration & trust items dynamically from the database
  const heroData = await prisma.heroContent.findFirst();
  const trustItems = await prisma.trustItem.findMany({
    orderBy: { order: 'asc' },
  });

  // Fallback defaults if database is empty
  const hero = heroData || {
    topLabel: "Your Adventure, Our Expertise",
    mainHeading: "Explore Nepal. Beyond the peak",
    subtext: "Authentic treks, Trusted guides. Unforgettable experiences.",
    youtubeVideoId: "gCRNEJxDJKM",
    searchPlaceholder: "Search by trek name",
  };

  const videoUrl = `https://www.youtube.com/embed/${hero.youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${hero.youtubeVideoId}&playsinline=1&modestbranding=1&rel=0`;

  return (
    <section className="relative w-screen h-[75vh] overflow-hidden">

      {/* VIDEO */}
      <iframe
        className="
          absolute top-1/2 left-1/2
          w-[177.77vh] h-[100vh]
          min-w-full min-h-full
          -translate-x-1/2 -translate-y-1/2
          pointer-events-none
        "
        src={videoUrl}
        allow="autoplay; fullscreen"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/25" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">

        {/* TOP LABEL */}
        <p className="text-orange-400 uppercase tracking-widest mb-3 text-sm font-semibold mulish">
          {hero.topLabel}
        </p>

        {/* MAIN HEADING */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 oswald">
          {hero.mainHeading}
        </h1>

        {/* DIVIDER */}
        <div className="w-24 h-[2px] bg-orange-400 mb-4" />

        {/* SUBTEXT */}
        <p className="text-gray-200 mb-8 max-w-2xl">
          {hero.subtext}
        </p>

        {/* SEARCH BAR */}
        <div className="w-full max-w-2xl mb-6">
          <input
            type="text"
            placeholder={hero.searchPlaceholder ?? undefined}
            className="w-full px-6 py-4 rounded-full text-black bg-white outline-none"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button className="border-3 border-orange-400 text-orange-400 px-6 py-3 rounded-md flex items-center gap-2 hover:bg-orange-400 hover:text-black transition bg-gray-300/10 cursor-pointer">
            ▲ View Treks
          </button>

          <button className="border-2 border-orange-400 text-orange-400 px-6 py-3 rounded-md flex items-center gap-2 hover:bg-orange-400 hover:text-black transition bg-gray-300/10 cursor-pointer">
            <Calendar className="w-5 h-5" />
            Book Now
          </button>
        </div>

        {/* TRUST BAR */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 pt-6 hidden md:block">
          <div className="bg-[#0B1F3A] py-6 px-8 flex justify-between items-center text-white rounded-t-xl shadow-lg">
            {trustItems.map((item) => {
              const IconComponent = iconMap[item.iconName] || ShieldCheck;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <IconComponent className="text-orange-400 w-7 h-7" />
                  <div className="text-left">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-gray-300">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}