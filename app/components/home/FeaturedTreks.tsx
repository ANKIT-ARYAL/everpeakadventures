'use client';

import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';

interface Trek {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  heroImage: string;
  durationDays: string;
  price: number;
  region: string;
  difficulty: string;
}

interface FeaturedTreksProps {
  treks?: Trek[];
  label?: string;
  title?: string;
}

export default function FeaturedTreks({ treks = [], label, title }: FeaturedTreksProps) {
  return (
    <section className="py-20 bg-[#f8faf9]">
      <div className="max-w-[1200px] mx-auto px-5">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#24a0ed] mb-2 block">{label ?? "Top Rated Routes"}</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#222222] oswald uppercase">
              {title ?? "Featured Trekking Packages"}
            </h2>
          </div>          
        </Reveal>

        {treks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm bg-white rounded-2xl border border-gray-100">
            No trekking packages found.
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treks.map((trek) => (
              <StaggerItem
                key={trek.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:shadow-lg transition-all"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img 
                    src={trek.heroImage} 
                    alt={trek.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {trek.price && (
                    <div className="absolute top-3 left-3 bg-[#d93838] text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm oswald">
                      ${trek.price}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {trek.region}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-[#222222] text-sm md:text-base line-clamp-2 mb-2 group-hover:text-[#24a0ed] transition-colors">
                      {trek.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {trek.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#24a0ed]" />
                      {trek.durationDays}
                    </span>
                    <Link 
                      href={`/trekking/${trek.slug ? trek.slug : trek.id}`} 
                      className="text-[#24a0ed] hover:underline font-bold"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
