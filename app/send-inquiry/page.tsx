import React from 'react';
import { prisma } from '@/lib/prisma';
import SendInquiryClient from './SendInquiryClient';


export const revalidate = 60;

export default async function SendInquiryPage() {
  const tours = await prisma.tour.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      duration: true,
      price: true,
      heroImage: true,
      groupPrices: { select: { groupSize: true, groupType: true, price: true } },
    },
    orderBy: { order: 'asc' },
  });

  const treks = await prisma.trek.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      durationDays: true,
      price: true,
      heroImage: true,
      groupPrices: { select: { groupSize: true, groupType: true, price: true } },
    },
    orderBy: { order: 'asc' },
  });

  const siteSettings = await prisma.siteSettings.findFirst();

  const trips = [
    ...tours.map(t => ({ ...t, type: 'tour' as const })),
    ...treks.map(t => ({
      id: t.id,
      title: t.title,
      duration: t.durationDays ? `${t.durationDays} days` : '',
      price: t.price,
      heroImage: t.heroImage,
      groupPrices: t.groupPrices,
      type: 'trek' as const
    }))
  ];

  return <SendInquiryClient trips={trips} logoImage={siteSettings?.logoImage ?? undefined} />;
}