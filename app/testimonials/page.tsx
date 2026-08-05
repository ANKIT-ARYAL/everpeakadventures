import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientReviews from '@/app/components/home/ClientReviews';

export default async function TestimonialsPage() {
  // Fetch all client reviews from the database
  const reviews = await prisma.clientReview.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-800 pb-20">
      
      {/* Hero Banner Section */}
      <section className="relative h-[320px] bg-[#112233] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            alt="Testimonials" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-black text-white oswald uppercase tracking-wider mb-3">
            Testimonials
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Real stories and genuine feedback from adventurers who traveled with us.
          </p>
        </div>
      </section>

      {/* Render your existing ClientReviews component passing all reviews */}
      <div className="-mt-10 relative z-20">
        <ClientReviews reviews={reviews} />
      </div>

    </div>
  );
}