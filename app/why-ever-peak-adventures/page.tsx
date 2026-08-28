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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* HERO SECTION */}
      <SubpageHeroContent
        slug="why-ever-peak-adventures"
        fallbackTitle="Why Ever Peak Adventures"
        fallbackSubtitle="Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* MAIN CONTENT SECTION */}
      <section className="py-24">
        <div className="px-5 lg:px-20">
          
          <Reveal className="bg-slate-50 rounded-[2.5rem] p-10 md:p-14 shadow-xl relative border-l-4 border-l-accent-amber border-y border-r border-gray-100">
            
            <div 
              className="wordpress-content text-gray-600 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.contentHtml }}
            />

          </Reveal>

        </div>
      </section>

    </div>
  );
}