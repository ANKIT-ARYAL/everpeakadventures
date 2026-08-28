import React from 'react';
import { prisma } from '@/lib/prisma';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import { Reveal } from '@/app/components/animations/Motion';

export default async function ResponsibleTravelPage() {
  const content = await prisma.responsibleTravelContent.findFirst({
    where: { published: true },
  });

  const data = content || {
    title: 'Responsible Travel',
    subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
    contentHtml: '<p>Welcome to our Responsible Travel initiatives.</p>',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* HERO SECTION */}
      <SubpageHeroContent
        slug="responsible-travel"
        fallbackTitle="Responsible Travel"
        fallbackSubtitle="Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* MAIN CONTENT SECTION */}
      <section className="py-24">
        <div className="px-5 lg:px-20">
          
          <Reveal className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-gray-100 relative">
            
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