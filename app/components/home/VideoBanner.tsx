'use client';

import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '../animations/Motion';
import { stripHtml } from '@/lib/stripHtml';

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
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative w-full min-h-[60vh] min-h-[400px] max-h-[700px] flex items-center justify-center overflow-hidden">
      
      {/* Background Images */}
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

      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 z-10" />

      {/* Content */}
      <Reveal className="relative z-20 text-center flex flex-col items-center px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
        
        <a 
          href={data?.videoUrl || data?.buttonLink || '/tour'}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center mb-10"
          aria-label="Play promotional video"
        >
          {/* Ripple Effect */}
          <div className="absolute w-24 h-24 bg-white/10 rounded-full animate-ping pointer-events-none" />
          
          <div className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-500 ease-[0.16,1,0.3,1]">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-foreground group-hover:text-accent-amber transition-colors shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <Play className="w-5 h-5 ml-1 fill-current" />
            </div>
          </div>
        </a>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white mb-6 leading-[1.1] tracking-tight">
          {data?.title || 'Explore Full Itineraries & Trip Ideas For Trekking'}
        </h2>
        
        <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed mb-10 px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
          {stripHtml(data?.subtitle) || 'Carefully crafted trekking plans designed for every trail, pace, and adventure level.'}
        </p>

        <Link 
          href={data?.buttonLink || '/tour'}
          className="inline-flex items-center gap-3 bg-white text-black hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 w-max"
        >
          {data?.buttonText || 'Start Your Journey'}
        </Link>
      </Reveal>
    </section>
  );
}