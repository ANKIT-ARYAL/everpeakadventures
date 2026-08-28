'use client';

import React from 'react';
import { Star, MapPin, Quote } from 'lucide-react';
import { Reveal } from '@/app/components/animations/Motion';

interface Review {
  name: string;
  location?: string;
  rating: number;
  avatar?: string;
  comment: string;
}

interface TripReviewsSectionProps {
  reviews: Review[];
}

export default function TripReviewsSection({ reviews }: TripReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div id="reviews" className="scroll-mt-[118px]">
      <Reveal className="bg-white rounded-xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-6">
        <h2 className="text-xl md:text-2xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
          Client Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden group">
              {/* Quote Watermark */}
              <Quote className="absolute -top-4 -right-4 w-24 h-24 text-gray-100/60 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (review.rating || 5) ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-[15px] italic leading-relaxed mb-6">
                    &quot;{review.comment}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 border-2 border-white shadow-sm">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1e857c] flex items-center justify-center text-white font-bold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#112233] text-[15px]">{review.name}</h4>
                    {review.location && (
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {review.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
