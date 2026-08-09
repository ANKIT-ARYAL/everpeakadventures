import React from 'react';
import { prisma } from '@/lib/prisma';
import SendInquiryClient from './SendInquiryClient';


export const dynamic = 'force-dynamic';

export default async function SendInquiryPage() {
  const tours = await prisma.tour.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      duration: true,
      price: true,
      heroImage: true,
    },
    orderBy: { order: 'asc' },
  });
  const siteSettings = await prisma.siteSettings.findFirst();

  const trips = tours.map(t => ({ ...t, type: 'tour' as const }));

  return <SendInquiryClient trips={trips} logoImage={siteSettings?.logoImage ?? undefined} />;
}