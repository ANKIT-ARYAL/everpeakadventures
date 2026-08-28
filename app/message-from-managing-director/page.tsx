import React from 'react';
import { Mail, Award, ShieldCheck, Users, Footprints } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';
import PageHero from '@/app/components/ui/PageHero';

export default async function MessageFromFounderPage() {
  const content = await prisma.directorMessageContent.findFirst({
    where: { published: true },
  });

  const data = content || {
    contentHtml: `
      <p>Welcome to Ever Peak Adventures. I'm Dipesh Aryal, and trekking has been my life's work for the past 15 years. My journey in the Himalayas began from the ground level as a porter, later becoming a trekking guide, and eventually establishing Ever Peak Adventures to share authentic Himalayan experiences with travelers from around the world.</p>
      <p>Having explored almost every trekking region of Nepal, I understand the mountains beyond the maps. From planning safe routes and logistics to creating memorable experiences, every journey is built on real field knowledge. Before founding this company, I had already helped more than <strong>10,000 travelers</strong> discover the beauty of Nepal.</p>
      <p>Ever Peak Adventures was founded in 2024 with a simple vision—to provide exceptional service, professional guidance, and unforgettable Himalayan adventures. Every trip we organize reflects our commitment to safety, responsible tourism, and personalized hospitality.</p>
      <p>When you choose Ever Peak Adventures, you become part of our family. We promise clear communication, genuine care, and support from your very first inquiry until your safe return home.</p>
    `,
    founderName: 'Dipesh Aryal',
    founderTitle: 'Founder, Ever Peak Adventures',
    founderEmail: 'dipesh@everpeakadventure.com',
    founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <PageHero 
        slug="message-from-managing-director" 
        fallbackTitle="Message From Founder" 
        fallbackSubtitle="Explore Higher. Feel Deeper."
      />

      <div className="py-12 px-5 lg:px-20">
        
        {/* Main Card Container */}
        <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-gray-100 relative mt-[-100px] z-30">
          
          <div className="flex justify-end mb-8">
            <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-lg font-bold text-[#112233] tracking-wide">
              Estb - 2024
            </div>
          </div>

          {/* Founder Layout: Image on Left, Intro & Badges on Right */}
          <div className="flex flex-col md:flex-row gap-10 items-start mb-10">
            {/* Founder Photo */}
            <div className="w-full md:w-[320px] h-[400px] rounded-3xl overflow-hidden shrink-0 shadow-lg border border-gray-100 bg-gray-50">
              <img 
                src={data.founderImage} 
                alt={data.founderName} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Intro Text & Quick Stat Badges */}
            <div className="flex-1 space-y-6">
              {/* Feature Badge Grid */}
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <StaggerItem className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl text-lg font-bold text-[#112233]">
                  <span className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-accent-amber" />
                  </span>
                  <span>15+ Years Experience</span>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl text-lg font-bold text-[#112233]">
                  <span className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-accent-amber" />
                  </span>
                  <span>Nepal Himalayan Expert</span>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl text-lg font-bold text-[#112233]">
                  <span className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center shrink-0">
                    <Footprints className="w-5 h-5 text-accent-amber" />
                  </span>
                  <span>Porter → Guide → Founder</span>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl text-lg font-bold text-[#112233]">
                  <span className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-accent-amber" />
                  </span>
                  <span>10,000+ Happy Travelers</span>
                </StaggerItem>
              </Stagger>
            </div>
          </div>

          {/* Remaining Dynamic HTML Content */}
          <Reveal>
            <div 
              className="wordpress-content space-y-6 text-gray-600 text-lg leading-relaxed pt-4"
              dangerouslySetInnerHTML={{ __html: data.contentHtml }}
            />
          </Reveal>

          {/* Highlight Callout Box */}
          <Reveal delay={0.1} className="mt-10 bg-accent-amber/5 border border-accent-amber/20 p-8 rounded-3xl text-[#112233] text-lg md:text-xl font-medium leading-relaxed shadow-inner">
            Thank you for placing your trust in Ever Peak Adventures. I look forward to welcoming you to Nepal and helping you experience the Himalayas in the safest, most meaningful, and unforgettable way possible.
          </Reveal>

          {/* Email / Signature Bar */}
          <Reveal className="pt-10 mt-10 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-medium text-[#112233] text-2xl mb-1">{data.founderName}</h4>
              <p className="text-lg text-gray-500">{data.founderTitle}</p>
            </div>

            <a 
              href={`mailto:${data.founderEmail}`}
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-100 text-[#112233] text-lg font-bold px-6 py-4 rounded-2xl transition-colors shadow-sm"
            >
              <Mail className="w-5 h-5 text-accent-amber" />
              <span>{data.founderEmail}</span>
            </a>
          </Reveal>

        </div>

      </div>
    </div>
  );
}