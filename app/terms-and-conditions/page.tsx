import React from 'react';
import { prisma } from '@/lib/prisma';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import { Reveal } from '@/app/components/animations/Motion';

export default async function TermsAndConditionsPage() {
  const content = await prisma.termsPageContent.findFirst({
    where: { published: true },
  });

  const data = content || {
    title: 'Terms and Conditions',
    subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
    contentHtml: '<p>Please review our terms and conditions.</p>',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      
      {/* HERO SECTION */}
      <SubpageHeroContent
        slug="terms-and-conditions"
        fallbackTitle="Terms and Conditions"
        fallbackSubtitle="Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* MAIN CONTENT SECTION */}
      <section className="-mt-16 relative z-20 px-5 lg:px-20">
        <Reveal className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-white/10 text-slate-700 text-lg md:text-xl leading-relaxed">
          
          <div 
            className="wordpress-content space-y-6"
            dangerouslySetInnerHTML={{ __html: data.contentHtml }}
          />

        </Reveal>
      </section>

    </div>
  );
}