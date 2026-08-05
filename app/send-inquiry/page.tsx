import React from 'react';
import { prisma } from '@/lib/prisma';
import SendInquiryClient from './SendInquiryClient';


export const dynamic = 'force-dynamic';

export default async function SendInquiryPage() {
  const tours = await prisma.tour.findMany({
    select: {
      id: true,
      title: true,
      duration: true,
      price: true,
      image: true,
    },
    orderBy: { order: 'asc' },
  });

  return <SendInquiryClient trips={tours} />;
}