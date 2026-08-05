'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';

interface Tour {
  id: string;
  title: string;
  slug: string;
  image: string;
  duration: string;
  bestTime: string;
}

interface PopularToursProps {
  tours: Tour[];
  watermark?: string;
  title?: string;
  subtitle?: string;
}

export default function PopularTours({ tours = [], watermark, title, subtitle }: PopularToursProps) {
  return (
    <section className="py-20 bg-white relative overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto px-5 relative z-10">

        {/* BACKGROUND WATERMARK TITLE */}
        <Reveal className="text-center relative mb-12">
          <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] md:text-[9rem] font-black text-[#f0f0f0] pointer-events-none select-none tracking-widest uppercase z-0 oswald">
            {watermark ?? 'TOURS'}
          </h1>
          
          {/* FOREGROUND HEADER */}
          <div className="relative z-10 pt-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight uppercase oswald mb-3">
              {title ?? 'Popular Tours'}
            </h2>
            <p className="text-gray-500 text-sm md:text-base italic">
              {subtitle ?? '"Premium tour packages tailored for comfort, culture, and adventure."'}
            </p>
          </div>
        </Reveal>

        {/* GRID CONTAINER */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.slice(0, 8).map((tour) => (
            <StaggerItem
              key={tour.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              {/* Tour Image Container */}
              <div className="relative w-full h-[200px] bg-gray-100 overflow-hidden">
                {tour.image ? (
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-200">
                    <div className="text-center font-bold text-[#3bbae6] tracking-wider text-sm uppercase oswald">
                      {tour.title}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-[#222222] text-[1.05rem] mb-6 text-center line-clamp-2">
                    {tour.title}
                  </h3>

                  {/* Duration & Best Time Breakdown */}
                  <div className="grid grid-cols-2 border-t border-b border-gray-100 py-3 mb-6 text-center">
                    <div className="border-r border-gray-100 pr-2">
                      <span className="block text-[11px] font-bold text-[#3bbae6] uppercase tracking-wider mb-1">
                        Duration
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        {tour.duration}
                      </span>
                    </div>
                    <div className="pl-2">
                      <span className="block text-[11px] font-bold text-[#3bbae6] uppercase tracking-wider mb-1">
                        Best Time
                      </span>
                      <span className="text-[11px] font-medium text-gray-600 leading-tight block">
                        {tour.bestTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  href={`/tour/${tour.slug}`}
                  className="w-full bg-[#1b2a47] hover:bg-[#121c2f] text-white font-medium text-xs py-2.5 rounded-lg text-center transition-colors duration-200 uppercase tracking-wider"
                >
                  View Details
                </Link>
              </div>

            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
