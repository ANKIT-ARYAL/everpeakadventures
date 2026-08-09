import React from 'react';
import { prisma } from '@/lib/prisma';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import { Reveal } from '@/app/components/animations/Motion';

export default async function WhyEverPeakAdventuresPage() {
  const content = await prisma.whyPageContent.findFirst({
    where: { published: true },
  });

  const data = content || {
    title: 'Why Ever Peak Adventures',
    subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
    contentHtml: '<p>Welcome to Ever Peak Adventures.</p>',
  };

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <SubpageHeroContent
        slug="why-ever-peak-adventures"
        fallbackTitle="Why Ever Peak Adventures"
        fallbackSubtitle="Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* MAIN CONTENT SECTION */}
      <section className="py-16">
        <div className="max-w-[1000px] mx-auto px-5">
          
          <Reveal className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative border-l-2 border-amber-500">
            
            <div 
              className="wordpress-content"
              dangerouslySetInnerHTML={{ __html: data.contentHtml }}
            />

          </Reveal>

        </div>
      </section>

    </div>
  );
}