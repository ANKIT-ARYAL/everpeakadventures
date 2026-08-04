import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

interface ClientReviewsProps {
  reviews: Review[];
}

export default function ClientReviews({ reviews = [] }: ClientReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-[#fbfcfb] relative overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto px-5 relative z-10">

        {/* BACKGROUND WATERMARK TITLE */}
        <div className="text-center relative mb-16">
          <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[4rem] md:text-[7.5rem] font-black text-[#edf0ed] pointer-events-none select-none tracking-widest uppercase z-0 oswald whitespace-nowrap">
            CLIENTS REVIEWS
          </h1>
          
          <div className="relative z-10 pt-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight uppercase oswald mb-3">
              WHAT OUR CLIENT SAY ABOUT US ?
            </h2>
            <p className="text-gray-500 text-sm md:text-base italic">
              &quot;Real experiences shared by travelers who trusted us.&quot;
            </p>
          </div>
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 3).map((review) => (
            <div 
              key={review.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] p-8 flex flex-col justify-between"
            >
              <p className="text-gray-600 text-[13.5px] leading-relaxed mb-8">
                &quot;{review.quote}&quot;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                {review.avatar ? (
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0 text-sm">
                    {review.name ? review.name.charAt(0) : 'T'}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-[#222222] text-sm">
                    {review.name}
                  </h4>
                  {review.location && (
                    <span className="text-xs text-gray-400 font-medium block">
                      {review.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TRIPADVISOR BANNER */}
        <div className="bg-[#0b221d] rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-lg">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 bg-[#071714] px-6 py-4 rounded-xl border border-white/5 w-full lg:w-auto justify-center">
            <div className="text-white font-black tracking-wider text-sm">
              EVER PEAK<span className="block text-[10px] text-gray-400 font-normal">ADVENTURES</span>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="bg-white px-3 py-1.5 rounded flex items-center gap-1.5 font-bold text-xs">
              <span className="text-xl">🦉</span> TripAdvisor
            </div>
          </div>

          {/* Text Message */}
          <div className="text-center lg:text-left flex-1">
            <h3 className="text-white font-bold text-lg mb-1">
              Write a TripAdvisor Review
            </h3>
            <p className="text-gray-300 text-xs mb-3">
              If you trekked with us (Everest Base Camp, Annapurna Circuit, or any trip), your honest review helps future travelers.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-400">
              <div className="flex text-[#34e0a1]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="bg-white/10 px-2.5 py-1 rounded-full text-gray-300">Trusted by Trekkers</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-full text-gray-300">Takes ~1 minute</span>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <a
              href="https://www.tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00af87] hover:bg-[#009472] text-white font-bold text-xs px-8 py-3.5 rounded-full shadow-md transition-colors inline-flex items-center gap-2 uppercase tracking-wider whitespace-nowrap"
            >
              Write a Review →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}