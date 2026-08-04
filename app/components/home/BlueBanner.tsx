import React from 'react';
import Link from 'next/link';

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
    <section className="relative w-full py-16 px-5 bg-[#1a93e8] overflow-hidden font-sans">
      {/* Background Image / Texture overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
        
        {/* Left Text Content */}
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            {data.title}
          </h2>
          <p className="text-white/90 text-xs md:text-sm leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* Right Button */}
        <div>
          <Link
            href={data.buttonLink}
            className="bg-white hover:bg-gray-100 text-[#1a93e8] font-bold text-xs md:text-sm px-7 py-3.5 rounded-xl shadow-md transition-all duration-200 inline-block whitespace-nowrap"
          >
            {data.buttonText}
          </Link>
        </div>

      </div>
    </section>
  );
}