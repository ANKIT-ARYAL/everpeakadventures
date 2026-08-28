'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import { stripHtml } from '@/lib/stripHtml';
import Image from 'next/image';

interface Review {
  id: string;
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

interface SectionContent {
  title?: string;
  subtitle?: string;
  watermark?: string;
}

interface ClientReviewsProps {
  reviews: Review[];
  section?: SectionContent | null;
  showAll?: boolean;
}

export default function ClientReviews({ reviews = [], section = null, showAll = false }: ClientReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Filter out reviews that have no actual quote text
  const validReviews = reviews.filter(r => stripHtml(r.quote).trim() !== '');
  const visibleReviews = showAll ? validReviews : validReviews.slice(0, 3);

  return (
    <section className="py-24 bg-background text-foreground relative overflow-hidden font-sans border-t border-foreground/10">
      <div className="relative z-10 px-5 lg:px-20">

        {/* HEADER */}
        <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight mb-4">
              {section?.title || 'What Our Clients Say'}
            </h2>
            <p className="font-sans text-foreground/70 text-lg">
              {section?.subtitle || 'Real experiences shared by travelers who trusted us with their journey.'}
            </p>
          </div>
        </Reveal>

        {/* REVIEWS GRID */}
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-20">
          {visibleReviews.map((review) => (
            <StaggerItem
              key={review.id}
              className="flex flex-col p-8 rounded-3xl border border-foreground/10 bg-foreground/[0.02]"
            >
              <div className="flex text-accent-amber mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-foreground text-lg leading-relaxed font-sans mb-8 italic text-balance">
                &quot;{stripHtml(review.quote)}&quot;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-auto">
                {review.avatar ? (
                  <img
                    src={review.avatar} 
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center font-display font-medium text-foreground shrink-0 text-xl">
                    {review.name ? review.name.charAt(0) : 'T'}
                  </div>
                )}
                <div>
                  <h4 className="font-display font-medium text-foreground text-lg">
                    {review.name}
                  </h4>
                  {review.location && (
                    <span className="text-lg text-foreground/60 font-sans block">
                      {review.location}
                    </span>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* TripAdvisor Call to Action */}
        <Reveal className="mt-24 relative overflow-hidden rounded-[2.5rem] p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-10 justify-between border border-foreground/10 bg-foreground/[0.02] shadow-2xl group">
          {/* Subtle gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00af87]/5 to-transparent pointer-events-none" />
          
          <div className="flex-1 relative z-10 flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left">
            {/* TripAdvisor Badge */}
            <div className="bg-white px-5 py-4 rounded-2xl shadow-lg flex flex-col items-center gap-1 shrink-0 transform group-hover:scale-105 transition-transform duration-500">
              <span className="text-3xl">🦉</span>
              <span className="text-[#000] font-extrabold text-sm tracking-tight">Tripadvisor</span>
            </div>

            {/* Text Message */}
            <div>
              <h3 className="text-foreground font-display font-medium text-2xl md:text-3xl mb-3 tracking-tight">
                Review us on Tripadvisor
              </h3>
              <p className="text-foreground/70 font-sans text-lg mb-6 leading-relaxed lg:mx-0">
                If you&apos;ve trekked with us, your honest feedback helps future travelers plan their dream Himalayan adventure.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm font-sans">
                <div className="flex items-center gap-1.5 bg-[#00af87]/10 text-[#00af87] px-4 py-2 rounded-full font-semibold">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="bg-foreground/5 text-foreground/70 px-4 py-2 rounded-full font-medium">Takes ~1 minute</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 shrink-0 mt-6 lg:mt-0">
            <a
              href="https://www.tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex items-center justify-center gap-3 bg-[#00af87] text-white font-sans font-semibold text-lg px-8 py-4 rounded-full overflow-hidden shadow-xl shadow-[#00af87]/20 transition-all hover:scale-105"
            >
              <span className="relative z-10">Write a Review</span>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 relative z-10 group-hover/btn:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
