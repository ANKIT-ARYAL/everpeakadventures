/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import RichText from '@/app/components/RichText';

interface Tour {
  id: string;
  title: string;
  slug: string;
  heroImage: string;
  duration: string;
  bestTime: string;
  price?: number;
  discountedPrice?: number | null;
}

interface PopularToursProps {
  tours: Tour[];
  watermark?: string;
  title?: string;
  subtitle?: string;
}

export default function PopularTours({ tours = [], title, subtitle }: PopularToursProps) {
  return (
    <section className="py-24 bg-background relative overflow-hidden font-sans border-t border-gray-200 dark:border-gray-800">
      <div className="relative z-10 px-5 lg:px-20">

        {/* HEADER */}
        <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight mb-4">
              {title ?? 'Popular Tours'}
            </h2>
            <div className="font-sans text-foreground/70 text-lg">
              <RichText html={subtitle ?? 'Premium tour packages tailored for comfort, culture, and adventure.'} />
            </div>
          </div>
          <div>
            <Link href="/tour" className="inline-block border border-foreground/20 hover:border-accent-amber text-foreground hover:bg-accent-amber hover:text-white transition-all duration-300 px-6 py-3 rounded-full text-lg font-semibold">
              View All Tours
            </Link>
          </div>
        </Reveal>

        {/* GRID CONTAINER */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour) => (
            <StaggerItem
              key={tour.id}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden"
            >
              <Link href={`/tour/${tour.slug}`} className="absolute inset-0">
                {/* Image */}
                <img 
                  src={tour.heroImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
                  alt={tour.title}
                  className={`absolute inset-0 w-full h-full ${!tour.heroImage ? 'object-contain p-8 bg-white' : 'object-cover'} group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]`}
                />

                {/* Price Tag */}
                {(tour.price || tour.discountedPrice) && (
                  <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-sm text-foreground font-sans font-black text-md px-3 py-1.5 rounded-full shadow-sm pointer-events-none z-10">
                    From ${(tour.discountedPrice ?? tour.price)?.toLocaleString()}
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-display font-medium text-white mb-3 group-hover:text-accent-amber transition-colors">
                    {tour.title}
                  </h3>
                  <div className="flex items-center gap-4 text-white/70 text-lg font-sans mb-3">
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-80">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                      </svg>
                      {tour.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-80">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                      {tour.bestTime}
                    </span>
                  </div>
                  <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-white hover:text-accent-amber text-lg font-sans pt-3 border-t border-white/20 mt-2 flex items-center gap-2 font-semibold transition-colors">
                      View Details
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
