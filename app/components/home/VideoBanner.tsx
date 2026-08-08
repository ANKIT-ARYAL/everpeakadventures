'use client';

import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '../animations/Motion';

export interface VideoBannerData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  videoUrl: string;
  backgroundImages: string[];
}

interface VideoBannerProps {
  data?: VideoBannerData;
}

export default function VideoBanner({ data }: VideoBannerProps) {
  const [currentBg, setCurrentBg] = useState(0);

  const images = data?.backgroundImages && data.backgroundImages.length > 0 
    ? data.backgroundImages 
    : [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
      ];

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative w-full py-20 md:py-24 flex items-center justify-center overflow-hidden font-sans">
      
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentBg ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={img}
            alt="Himalayan Trekking Background"
            className="w-full h-full object-cover scale-105"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-[#2d3a4b]/60 z-10" />

      <Reveal className="relative z-20 max-w-4xl mx-auto px-5 text-center flex flex-col items-center">
        
        <a 
          href={data?.videoUrl || data?.buttonLink || '/tour'}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group mb-6 flex items-center justify-center"
          aria-label="Play promotional video"
        >
          <div className="absolute w-20 h-20 bg-white/20 rounded-full animate-ping" />
          
          <div className="relative w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:bg-white/50 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <Play className="w-4 h-4 text-[#3bbae6] ml-0.5 fill-current" />
            </div>
          </div>
        </a>

        <h2 className="text-2xl md:text-[2.25rem] font-bold text-white mb-3 leading-tight oswald tracking-wide">
          {data?.title || 'Explore Full Itineraries & Trip Ideas For Trekking'}
        </h2>
        
        <p className="text-gray-200 text-xs md:text-sm max-w-xl mx-auto leading-relaxed mb-6">
          {data?.subtitle || 'Carefully crafted Trekking plans designed for every trail, pace, and adventure level.'}
        </p>

        <Link 
          href={data?.buttonLink || '/tour'}
          className="bg-[#3bbae6] hover:bg-[#2da1c9] text-white font-semibold text-xs md:text-sm px-7 py-3 rounded shadow-lg transition-colors duration-200 uppercase tracking-wider"
        >
          {data?.buttonText || 'START JOURNEY'}
        </Link>
      </Reveal>
    </section>
  );
}