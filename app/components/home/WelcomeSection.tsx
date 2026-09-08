'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import { stripHtml } from '@/lib/stripHtml';

// 1. Define the props interface
interface WelcomeSectionProps {
  companyName?: string;
  carouselImages: string[];
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  features?: { id: string; title: string; description: string }[];
}

const defaultFeatures = [
  {
    id: '1',
    title: 'Local Himalayan Experts',
    description: 'Experienced guides with deep regional knowledge',
  },
  {
    id: '2',
    title: 'Safety First Approach',
    description: 'Certified guides and proven safety standards',
  },
  {
    id: '3',
    title: 'Government Licensed',
    description: 'Authorized by Tourism Ministry, TAAN & NMA',
  },
  {
    id: '4',
    title: 'Authentic Experiences',
    description: 'Connect with local communities and traditions',
  },
];

export default function WelcomeSection({ 
  companyName = 'Ever Peak Adventure', // Fallback name
  carouselImages = [],
  description,
  buttonText,
  buttonLink,
  features,
}: WelcomeSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;

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
    <section className="py-24 px-6 bg-foreground text-background">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
        
        {/* Left Side: Auto-swiping Image Carousel */}
        <Reveal className="w-full lg:w-1/2 aspect-[4/5] md:aspect-[1/1] lg:aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl max-h-[500px]">
          {carouselImages.length > 0 ? (
            <>
              <div 
                className="flex w-full h-full transition-transform duration-700 ease-[0.16,1,0.3,1]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {carouselImages.map((src, index) => (
                  <div key={index} className="w-full h-full shrink-0 relative">
                    <img
                      src={src}
                      alt={`Himalayan Scenery ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Inner shadow/gradient for depth */}
                    <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-background/5 flex items-center justify-center">
              <span className="text-background/40 font-sans">No images available</span>
            </div>
          )}
        </Reveal>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-background mb-6 tracking-tight leading-tight">
              Welcome To <span className="text-accent-amber">{companyName}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-background/70 text-lg font-sans leading-relaxed mb-12 text-justify">
              {description}
            </p>
          </Reveal>

          {/* Features List */}
          <Stagger className="flex flex-col gap-6 mb-12">
            {displayFeatures.map((feature, idx) => (
              <StaggerItem key={feature.id || idx} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2.5 shrink-0" />
                <div>
                  <h3 className="font-display font-medium text-background text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-lg font-sans text-background/60 leading-relaxed">
                    {stripHtml(feature.description)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Call to Action Button */}
          <Reveal delay={0.2}>
            <Link
              href={buttonLink ?? "/about-us"}
              className="inline-flex items-center gap-3 bg-accent-amber hover:bg-accent-amber/90 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 w-max"
            >
              {buttonText ?? "Know More About Us"}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </Reveal>
        </div>

      </div>
    </section>
  );
}