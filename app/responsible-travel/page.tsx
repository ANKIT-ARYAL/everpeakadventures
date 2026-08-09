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
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <SubpageHeroContent
        slug="responsible-travel"
        fallbackTitle="Responsible Travel"
        fallbackSubtitle="Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* MAIN CONTENT SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          
          <Reveal className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 relative">
            
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