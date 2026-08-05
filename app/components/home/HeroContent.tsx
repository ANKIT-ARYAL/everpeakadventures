"use client";

import { Calendar, Footprints, Headphones, ShieldCheck, Users } from "lucide-react";
import type { JSX, SVGProps, ComponentType } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
        className="flex flex-col items-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={item} className="text-orange-400 uppercase tracking-widest mb-3 text-sm font-semibold mulish">
          {hero.topLabel}
        </motion.p>

        <motion.h1 variants={item} className="text-4xl md:text-6xl font-bold mb-4 oswald">
          {hero.mainHeading}
        </motion.h1>

        <motion.div variants={item} className="w-24 h-[2px] bg-orange-400 mb-4" />

        <motion.p variants={item} className="text-gray-200 mb-8 max-w-2xl">
          {hero.subtext}
        </motion.p>

        <motion.div variants={item} className="w-full max-w-2xl mb-6">
          <input
            type="text"
            placeholder={hero.searchPlaceholder ?? undefined}
            className="w-full px-6 py-4 rounded-full text-black bg-white outline-none"
          />
        </motion.div>

        <motion.div variants={item} className="flex gap-4">
          <Link href={hero.primaryButtonLink ?? "/trekking"} className="border-3 border-orange-400 text-orange-400 px-6 py-3 rounded-md flex items-center gap-2 hover:bg-orange-400 hover:text-black transition bg-gray-300/10 cursor-pointer">
            {hero.primaryButtonText ?? "▲ View Treks"}
          </Link>

          <Link href={hero.secondaryButtonLink ?? "/send-inquiry"} className="border-2 border-orange-400 text-orange-400 px-6 py-3 rounded-md flex items-center gap-2 hover:bg-orange-400 hover:text-black transition bg-gray-300/10 cursor-pointer">
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
      </motion.div>
    </div>
  );
}
