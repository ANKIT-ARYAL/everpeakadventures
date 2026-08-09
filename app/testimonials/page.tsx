import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientReviews from '@/app/components/home/ClientReviews';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';

export default async function TestimonialsPage() {
  // Fetch all client reviews from the database
  const reviews = await prisma.clientReview.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  const section = await prisma.testimonialSectionContent.findFirst({
    where: { published: true },
  });

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-800 pb-20">
      
      {/* Hero Banner Section */}
      <SubpageHeroContent
        slug="testimonials"
        fallbackTitle="Testimonials"
        fallbackSubtitle="Real stories and genuine feedback from adventurers who traveled with us."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* Render your existing ClientReviews component passing all reviews */}
      <div className="-mt-10 relative z-20">
        <ClientReviews reviews={reviews} section={section} showAll />
      </div>

    </div>
  );
}