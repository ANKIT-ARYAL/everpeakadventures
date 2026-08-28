'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal } from '../animations/Motion';
import { stripHtml } from '@/lib/stripHtml';

interface BlueBannerData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface BlueBannerProps {
  data: BlueBannerData;
}

export default function BlueBanner({ data }: BlueBannerProps) {
  return (
    <section className="relative w-full py-20 px-6 bg-accent-amber overflow-hidden font-sans">
      {/* Background Image / Texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left ">
        
        {/* Left Text Content */}
        <Reveal className="px-5 lg:px-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-white mb-4 tracking-tight leading-snug">
            {data.title}
          </h2>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed font-sans">
            {stripHtml(data.subtitle)}
          </p>
        </Reveal>

        {/* Right Button */}
        <Reveal delay={0.15} className="px-5 lg:px-20">
          <Link
            href={data.buttonLink}
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-accent-amber font-semibold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 whitespace-nowrap hover:scale-105"
          >
            {data.buttonText}
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </Reveal>

      </div>
    </section>
  );
}
