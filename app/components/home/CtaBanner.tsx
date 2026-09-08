'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal } from '../animations/Motion';
import { stripHtml } from '@/lib/stripHtml';

interface CtaBannerData {
  title: string;
  subtitle: string;
  bgImage: string;
  primaryLink: string;
  secondaryLink: string;
}

interface CtaBannerProps {
  data: CtaBannerData;
}

export default function CtaBanner({ data }: CtaBannerProps) {
  return (
    <section className="relative w-full py-32 px-6 font-sans overflow-hidden">
        
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${data.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />

      {/* Content Container */}
      <Reveal className="relative z-20 flex flex-col items-center text-center px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tight leading-[1.1]">
          {data.title}
        </h2>

        <p className="text-white/80 text-lg md:text-xl font-sans mb-12 leading-relaxed px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
          {stripHtml(data.subtitle)}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href={data.primaryLink || '/contact-us'}
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-black font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:scale-105"
          >
            Reserve Now
          </Link>

          <Link
            href={data.secondaryLink || '/tour'}
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-md"
          >
            Explore Trekking
          </Link>
        </div>

      </Reveal>
    </section>
  );
}
