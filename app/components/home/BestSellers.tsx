'use client';

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import RichText from '@/app/components/RichText';
import { stripHtml } from '@/lib/stripHtml';

interface BestSellersProps {
  data: any[];
  watermark?: string;
  title?: string;
  subtitle?: string;
}

export default function BestSellers({ data, watermark, title, subtitle }: BestSellersProps) {
  return (
    <div className='min-h-screen bg-[#f7f7f7] oswald'>
      <section className="max-w-[1200px] mx-auto px-5 py-16">
        {/* Header Section */}
        <Reveal className="relative text-center mb-12 flex flex-col items-center justify-center">
          {/* Background Text */}
          <h1 className="absolute -top-10 text-[7rem] font-bold text-[#e8e8e8] tracking-widest uppercase select-none z-0">
            {watermark ?? 'Trekking'}
          </h1>

          {/* Foreground Title & Subtitle */}
          <h2 className="relative z-10 text-4xl font-bold text-[#222222] uppercase tracking-wide mb-3">
            {title ?? 'Best Seller Trekking'}
          </h2>
          <RichText html={subtitle ?? '"Top-rated trekking journeys offering breathtaking views and authentic experiences."'} className="relative z-10 text-[#555555] text-base" />
        </Reveal>

        {/* Grid Container */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((trek) => (
            <StaggerItem
              key={trek.id}
              className="bg-white rounded-md overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.06)] flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-[220px]">
                <Link href={`/trekking/${trek.slug ? trek.slug : trek.id}`}>
                <img
                  src={trek.heroImage}
                  alt={trek.title || "Trek image"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                </Link>
              </div>

              {/* Card Content */}
              {trek.title && (
                <div className="p-6 flex flex-col flex-grow">
                  <Link href={`/trekking/${trek.slug ? trek.slug : trek.id}`}>
                  <h3 className="text-xl text-[#222222] text-center mb-3 font-medium">
                    {trek.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex justify-center gap-5 text-[#888888] text-sm mb-4">
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                      </svg>
                      {trek.durationDays}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                      {trek.difficulty}
                    </span>
                  </div>

                  {/* Divider line */}
                  <div className="h-px bg-[#eaeaea] w-full mb-4"></div>

                  {/* Description */}
                  <p className="text-[#555555] text-sm leading-relaxed text-justify line-clamp-3 m-0">
                    {stripHtml(trek.description)}
                  </p>
                  </Link>
                </div>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
