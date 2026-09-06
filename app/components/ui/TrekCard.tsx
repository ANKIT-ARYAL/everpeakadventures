import React from 'react';
import Link from 'next/link';
import { stripHtml } from '@/lib/stripHtml';

export interface TrekCardProps {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  overview?: string | null;
  heroImage: string;
  durationDays: string;
  price: number;
  discountedPrice?: number | null;
  lowestPrice?: number | null;
  difficulty: string;
  region?: string;
}

export default function TrekCard({ trek }: { trek: TrekCardProps }) {
  return (
    <div className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300">
      <Link href={`/trekking/${trek.slug ? trek.slug : trek.id}`} className="absolute inset-0">
        {/* Image */}
        <img 
          src={trek.heroImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
          alt={trek.title}
          className={`absolute inset-0 w-full h-full ${!trek.heroImage ? 'object-contain p-8 bg-white' : 'object-cover'} group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500" />
        
        {/* Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-display font-medium text-white mb-3 group-hover:text-accent-amber transition-colors">
            {trek.title}
          </h3>
          <div className="flex items-center gap-4 text-white/70 text-[15px] font-sans mb-3 font-semibold">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-80 text-accent-amber">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
              {trek.durationDays}
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-80 text-accent-amber">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              {trek.difficulty}
            </span>
          </div>
          <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white/80 text-[14px] font-sans line-clamp-2 pt-3 border-t border-white/20 mt-2 text-justify">
              {stripHtml(trek.overview || trek.description).replace(/^(trip overview|overview|highlights)[\s:]*/i, '').trim()}
            </p>
          </div>
        </div>
      </Link>
      {(trek.lowestPrice || trek.price) && (
        <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-sm text-white font-sans font-black text-[13px] px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
          From ${(trek.lowestPrice ?? trek.discountedPrice ?? trek.price).toLocaleString()}
        </div>
      )}
    </div>
  );
}
