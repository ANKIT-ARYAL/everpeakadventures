"use client";

import { Calendar, Footprints, Headphones, ShieldCheck, Users } from "lucide-react";
import type { JSX, SVGProps, ComponentType } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { stripHtml } from '@/lib/stripHtml';

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  ShieldCheck,
  Footprints,
  Headphones,
  Users,
};

interface HeroContentProps {
  hero: {
    topLabel?: string | null;
    mainHeading?: string | null;
    subtext?: string | null;
    searchPlaceholder?: string | null;
    primaryButtonText?: string | null;
    primaryButtonLink?: string | null;
    secondaryButtonText?: string | null;
    secondaryButtonLink?: string | null;
  };
  trustItems: {
    id: string;
    iconName: string;
    title: string;
    subtitle: string;
  }[];
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function HeroContent({ hero, trustItems }: HeroContentProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
      <motion.div
        className="flex flex-col items-center max-w-4xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={item} className="text-orange-400 uppercase tracking-[0.2em] mb-4 text-xs md:text-sm font-bold mulish drop-shadow-md">
          {hero.topLabel}
        </motion.p>

        <motion.h1 variants={item} className="text-4xl md:text-6xl lg:text-7xl font-black mb-5 oswald leading-tight drop-shadow-lg">
          {hero.mainHeading}
        </motion.h1>

        <motion.div variants={item} className="w-16 h-1 bg-orange-400 mb-5 rounded-full" />

        <motion.p variants={item} className="text-gray-100 mb-10 max-w-2xl text-sm md:text-base leading-relaxed drop-shadow-md">
          {stripHtml(hero.subtext)}
        </motion.p>

        <motion.div variants={item} className="w-full max-w-2xl mb-8">
          <form action="/trekking" className="relative">
            <input
              type="text"
              name="q"
              placeholder={hero.searchPlaceholder ?? "Search by trek name"}
              className="w-full px-6 py-4 md:py-5 rounded-full text-black bg-white/95 backdrop-blur-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm md:text-base shadow-lg"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-orange-400 text-black px-5 py-2.5 md:px-6 md:py-3 rounded-full font-bold text-sm hover:bg-orange-300 transition-colors cursor-pointer shadow-md hover:shadow-lg"
              aria-label="Search treks"
            >
              Search
            </button>
          </form>
        </motion.div>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-2xl">
          <Link href={hero.primaryButtonLink ?? "/trekking"} className="flex-1 bg-orange-400 hover:bg-orange-300 text-black px-6 py-3.5 md:py-4 rounded-lg font-bold text-sm md:text-base uppercase tracking-wider transition-all text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
            {hero.primaryButtonText ?? "▲ View Treks"}
          </Link>

          <Link href={hero.secondaryButtonLink ?? "/send-inquiry"} className="flex-1 border-2 border-white text-white px-6 py-3.5 md:py-4 rounded-lg font-bold text-sm md:text-base uppercase tracking-wider transition-all text-center hover:bg-white hover:text-[#112233] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            <Calendar className="w-5 h-5" />
            {hero.secondaryButtonText ?? "Book Now"}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 pt-6 hidden md:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
      >
        <div className="bg-[#0B1F3A]/90 backdrop-blur-md py-6 px-8 flex justify-between items-center text-white rounded-t-xl shadow-2xl border-t border-white/10">
          {trustItems.map((item) => {
            const IconComponent = iconMap[item.iconName] || ShieldCheck;
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="p-2 bg-orange-400/10 rounded-lg">
                  <IconComponent className="text-orange-400 w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-300">{stripHtml(item.subtitle)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
