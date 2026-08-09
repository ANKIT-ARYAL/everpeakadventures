import React from 'react';
import { prisma } from '@/lib/prisma';
import SubpageHero from './SubpageHero';

interface SubpageHeroContentProps {
  slug: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackImage?: string;
}

export default async function SubpageHeroContent({ slug, fallbackTitle, fallbackSubtitle, fallbackImage }: SubpageHeroContentProps) {
  const hero = await prisma.subpageHero.findFirst({
    where: { slug, published: true },
  });

  return (
    <SubpageHero
      title={hero?.title ?? fallbackTitle ?? slug}
      subtitle={hero?.subtitle ?? fallbackSubtitle}
      image={hero?.image ?? fallbackImage}
    />
  );
}