'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 1. Define the props interface
interface WelcomeSectionProps {
  companyName?: string;
  carouselImages: string[];
}

// Keep the features static if they aren't managed in a specific WordPress post type
const features = [
  {
    title: 'Local Himalayan Experts',
    description: 'Experienced guides with deep regional knowledge',
  },
  {
    title: 'Safety First Approach',
    description: 'Certified guides and proven safety standards',
  },
  {
    title: 'Government Licensed',
    description: 'Authorized by Tourism Ministry, TAAN & NMA',
  },
  {
    title: 'Authentic Experiences',
    description: 'Connect with local communities and traditions',
  },
];

export default function WelcomeSection({ 
  companyName = 'Ever Peak Adventure', // Fallback name
  carouselImages = [] 
}: WelcomeSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Only run the interval if we have more than 1 image
    if (carouselImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2500);

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <section className="py-16 px-5 bg-white font-sans text-[#333333]">
      <div className="max-w-[1200px] mx-auto bg-[#f8fafc] rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10 lg:gap-12 items-stretch">
        
        {/* Left Side: Auto-swiping Image Carousel */}
        <div className="w-full md:w-5/12 min-h-[380px] md:min-h-[480px] relative rounded-xl overflow-hidden shadow-md">
          {carouselImages.length > 0 ? (
            <>
              <div 
                className="flex w-full h-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {carouselImages.map((src, index) => (
                  <div key={index} className="w-full h-full shrink-0 relative">
                    <img
                      src={src}
                      alt={`Himalayan Scenery ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-4 bg-white' : 'w-2 bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            // Fallback empty state if no images are passed
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <span className="text-slate-400">No images available</span>
            </div>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-7/12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#113255] mb-4">
            Welcome To {companyName}
          </h2>

          <p className="text-[#555555] text-sm md:text-base leading-relaxed mb-8">
            {companyName} is a trusted Nepal trekking company specializing in trekking,
            peak climbing, hiking, and customized Himalayan adventures. Our experienced
            local guides lead unforgettable journeys to Everest Base Camp, Annapurna Base
            Camp, Langtang Valley, Upper Mustang, Manaslu Circuit, and many other
            spectacular destinations across Nepal. We focus on safety, personalized service,
            and authentic mountain experiences for every traveler.
          </p>

          {/* Features Grid */}
          <div className="py-10 mb-8 ">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {/* Checkmark Icon Container */}
                <div className="w-6 h-6 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-none stroke-current stroke-[3]"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                {/* Feature Text */}
                <div className='py-2'>
                  <h3 className="font-bold text-[#113255] text-sm md:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#666666] mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Button */}
          <div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Know More About Us
              <span className="text-base">→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}