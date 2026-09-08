/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import TrekCard from '../ui/TrekCard';

interface Trek {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  overview?: string | null;
  heroImage: string;
  durationDays: string;
  price: number;
  discountedPrice?: number | null;
  region: string;
  difficulty: string;
  lowestPrice?: number | null;
}

interface FeaturedTreksProps {
  treks?: Trek[];
  label?: string;
  title?: string;
}

export default function FeaturedTreks({ treks = [], label, title }: FeaturedTreksProps) {
  return (
    <section className="py-24 bg-foreground text-background border-b border-background/10 font-sans">
      <div className="px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4 text-background">
              {title ?? "Most Popular Trekking"}
            </h2>
            <p className="font-sans text-background/70 text-lg">
              {label ?? "Our most sought-after routes, curated for the modern adventurer."}
            </p>
          </div>
          <div>
            <Link href="/trekking" className="inline-block border border-background/20 hover:border-accent-amber text-background hover:bg-accent-amber hover:text-white transition-all duration-300 px-6 py-3 rounded-full text-lg font-semibold">
              View All Treks
            </Link>
          </div>
        </Reveal>

        {treks.length === 0 ? (
          <div className="text-center py-24 text-background/50 text-lg font-sans">
            No trekking packages found.
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treks.map((trek) => (
              <StaggerItem key={trek.id}>
                <TrekCard trek={trek} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
