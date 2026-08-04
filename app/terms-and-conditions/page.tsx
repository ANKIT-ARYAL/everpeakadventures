import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function TermsAndConditionsPage() {
  const content = await prisma.termsPageContent.findFirst();

  const data = content || {
    title: 'Terms and Conditions',
    subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
    contentHtml: '<p>Please review our terms and conditions.</p>',
  };

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <section className="relative py-32 bg-[#112233] text-white overflow-hidden text-center">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop)',
          }}
        />

        <div className="max-w-7xl mx-auto px-5 relative z-20">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider oswald mb-4 drop-shadow-md">
            {data.title}
          </h1>
          <p className="text-white text-sm md:text-base italic max-w-xl mx-auto drop-shadow">
            {data.subtitle}
          </p>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 relative">
            
            <div 
              className="wordpress-content space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.contentHtml }}
            />

          </div>

        </div>
      </section>

    </div>
  );
}