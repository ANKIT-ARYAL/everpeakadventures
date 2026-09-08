"use client";

import React, { useState } from "react";
import { PlayCircle, Calendar, Play } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { stripHtml } from '@/lib/stripHtml';
import VideoModal from "../ui/VideoModal";

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
    showPopupVideo?: boolean;
    popupVideoUrl?: string | null;
  };
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
};

const itemLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

const itemUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export default function HeroContent({ hero }: HeroContentProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const renderHeading = (heading?: string | null) => {
    if (!heading) return null;
    
    const regex = /(Beyond the peak|The Land of Himalayas)/i;
    const parts = heading.split(regex);
    
    if (parts.length < 2) {
      return (
        <motion.h1 variants={itemLeft} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight">
          {heading}
        </motion.h1>
      );
    }

    return (
      <div className="mb-6">
        <motion.div variants={itemLeft} className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white mb-2 leading-[1.1] tracking-tight">
          {parts[0].replace(/[\.\s]+$/, '')}
        </motion.div>
        <motion.div variants={itemLeft} className="text-amber-500 text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
          {parts[1]}
        </motion.div>
        {parts[2] && (
          <motion.div variants={itemLeft} className="text-white text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
            {parts[2]}
          </motion.div>
        )}
      </div>
    );
  };

  const getSecondaryIcon = (text?: string | null) => {
    if (text?.toLowerCase().includes("video")) {
      return <PlayCircle className="w-5 h-5" />;
    }
    return <Calendar className="w-5 h-5" />;
  };

  const cleanPrimaryText = hero.primaryButtonText?.replace("▲ ", "") || "Explore Treks";

  return (
    <>
      <div className="relative z-10 w-full flex flex-col justify-center h-full px-5 lg:px-20 max-w-[1400px] mx-auto w-full ">
        <motion.div
          className="w-full"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Text Container constrained to left side */}
          <div className="max-w-3xl">
            {hero.topLabel && (
              <motion.p variants={itemLeft} className="text-white/90 font-medium mb-3 text-sm md:text-base font-sans">
                {hero.topLabel}
              </motion.p>
            )}

            {renderHeading(hero.mainHeading)}

            <motion.p variants={itemLeft} className="text-white/90 mb-10 text-lg md:text-xl font-sans leading-relaxed">
              {stripHtml(hero.subtext)}
            </motion.p>
          </div>

          {/* Action Row: Left aligned CTA Buttons + Right Aligned Play Button */}
          <motion.div variants={itemUp} className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 w-full pr-4">
            
            {/* Left: CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full lg:w-auto">
              <Link 
                href={hero.primaryButtonLink ?? "/trekking"} 
                className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-bold text-[16px] transition-colors shadow-lg"
              >
                {cleanPrimaryText}
              </Link>

              <Link 
                href={hero.secondaryButtonLink ?? "#"} 
                className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-bold text-[16px] transition-colors hover:bg-white/10 hover:border-white gap-2 backdrop-blur-sm"
              >
                {getSecondaryIcon(hero.secondaryButtonText)}
                {hero.secondaryButtonText || "Book Now"}
              </Link>
            </div>

            {/* Right: Premium Floating Play Button */}
            {hero.showPopupVideo && hero.popupVideoUrl && (
              <div className="hidden lg:flex flex-col items-center gap-3 opacity-90 hover:opacity-100 transition-all">
                <button 
                  onClick={() => setIsVideoOpen(true)}
                  className="group relative flex items-center justify-center w-20 h-20 rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-500 hover:bg-white/20 hover:border-white/40 shadow-xl"
                  aria-label="Play promotional video"
                >
                  {/* Subtle continuous outer pulse */}
                  <span className="absolute inset-0 rounded-full bg-white animate-pulse" />
                  
                  {/* Inner crisp solid circle */}
                  <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-500 ease-out">
                    <Play className="w-6 h-6 text-amber-500 ml-1 fill-current" />
                  </div>
                </button>
                <span className="text-white font-bold tracking-[0.2em] uppercase text-[10px] drop-shadow-md">
                  Watch Video
                </span>
              </div>
            )}

          </motion.div>
        </motion.div>
      </div>

      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoUrl={hero.popupVideoUrl || ""} 
      />
    </>
  );
}