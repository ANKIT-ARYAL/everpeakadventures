import React from 'react';
import Link from 'next/link';

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
    <section className="py-12 px-5 bg-white font-sans">
      <div className="max-w-[1200px] mx-auto relative rounded-3xl overflow-hidden shadow-lg py-20 px-6 md:px-12 flex flex-col items-center text-center">
        
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
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Content Container */}
        <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center">
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight oswald">
            {data.title}
          </h2>

          <p className="text-gray-200 text-sm md:text-base mb-8 font-medium">
            {data.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={data.primaryLink}
              className="bg-white hover:bg-gray-100 text-[#222222] font-bold text-xs md:text-sm px-8 py-3.5 rounded-full shadow-md transition-colors duration-200 uppercase tracking-wider"
            >
              Reserve Now
            </Link>

            <Link
              href={data.secondaryLink}
              className="border-2 border-white hover:bg-white/10 text-white font-bold text-xs md:text-sm px-8 py-3 rounded-full transition-colors duration-200 uppercase tracking-wider backdrop-blur-xs"
            >
              Explore Trekking
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}