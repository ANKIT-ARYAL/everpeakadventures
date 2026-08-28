import React from 'react';
import { prisma } from '@/lib/prisma';
import PageHeroClient from './PageHeroClient';

interface Props {
  slug: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  fallbackImage?: string;
}

export default async function PageHero({ slug, fallbackTitle, fallbackSubtitle, fallbackImage }: Props) {
  let heroData = null;
  
  try {
    heroData = await prisma.subpageHero.findUnique({ where: { slug } });
  } catch (e) {
    console.error("Failed to fetch subpage hero", e);
  }

  const title = heroData?.title || fallbackTitle;
  const subtitle = heroData?.subtitle || fallbackSubtitle;
  
  // A premium dark landscape fallback
  const image = heroData?.image || fallbackImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop'; 

  // If the admin explicitly turns it off, we render nothing (or a simple spacer)
  if (heroData && !heroData.published) {
    return <div className="h-24 bg-white" />; // minimal spacer for navbar
  }

  return <PageHeroClient title={title} subtitle={subtitle} image={image} />;
}
