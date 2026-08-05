import React from 'react';

interface SubpageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export default function SubpageHero({ title, subtitle, image }: SubpageHeroProps) {
  return (
    <section className="relative py-32 bg-[#112233] text-white overflow-hidden text-center">
      {image && (
        <div
          className="absolute inset-0 z-0 bg-center bg-cover opacity-40"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      )}

      <div className="max-w-[1200px] mx-auto px-5 relative z-20">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider oswald mb-4 drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white text-sm md:text-base italic max-w-xl mx-auto drop-shadow">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
