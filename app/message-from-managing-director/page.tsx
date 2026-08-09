import React from 'react';
import { Mail, Award, ShieldCheck, Users, Footprints } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';

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
    <div className="min-h-screen bg-[#f4f7f5] font-sans text-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-5">
        
        {/* Main Card Container */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 relative">
          
          {/* Top Title & Est Badge Header */}
          <Reveal className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#222222] oswald tracking-wide uppercase mb-1">
                Message From Founder
              </h1>
              <p className="text-xs text-gray-500 font-medium">Explore Higher. Feel Deeper.</p>
            </div>
            <div className="self-start sm:self-auto bg-gray-50 border border-gray-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-700 tracking-wide">
              Estb - 2024
            </div>
          </Reveal>

          {/* Founder Layout: Image on Left, Intro & Badges on Right */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            {/* Founder Photo */}
            <div className="w-full md:w-[280px] h-[320px] rounded-2xl overflow-hidden shrink-0 shadow-md border border-gray-100 bg-gray-50">
              <img 
                src={data.founderImage} 
                alt={data.founderName} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Intro Text & Quick Stat Badges */}
            <div className="flex-1 space-y-4">
              {/* Feature Badge Grid */}
              <Stagger className="grid grid-cols-2 gap-2 pt-2">
                <StaggerItem className="flex items-center gap-2 bg-[#f8faf9] border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-700">
                  <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>15+ Years Experience</span>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-2 bg-[#f8faf9] border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#24a0ed]" />
                  <span>Nepal Himalayan Expert</span>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-2 bg-[#f8faf9] border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-700">
                  <Footprints className="w-3.5 h-3.5 text-[#24a0ed]" />
                  <span>Porter → Guide → Founder</span>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-2 bg-[#f8faf9] border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-700">
                  <Users className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>10,000+ Happy Travelers</span>
                </StaggerItem>
              </Stagger>
            </div>
          </div>

          {/* Remaining Dynamic HTML Content */}
          <Reveal>
            <div 
              className="wordpress-content space-y-4 text-gray-600 text-[14px] leading-relaxed pt-2"
              dangerouslySetInnerHTML={{ __html: data.contentHtml }}
            />
          </Reveal>

          {/* Highlight Callout Box */}
          <Reveal delay={0.1} className="mt-8 bg-[#fffbf0] border border-[#faeacc] p-5 rounded-2xl text-gray-700 text-xs md:text-sm font-medium leading-relaxed">
            Thank you for placing your trust in Ever Peak Adventures. I look forward to welcoming you to Nepal and helping you experience the Himalayas in the safest, most meaningful, and unforgettable way possible.
          </Reveal>

          {/* Email / Signature Bar */}
          <Reveal className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-900 oswald text-base">{data.founderName}</h4>
              <p className="text-xs text-gray-500">{data.founderTitle}</p>
            </div>

            <a 
              href={`mailto:${data.founderEmail}`}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#24a0ed]" />
              <span>{data.founderEmail}</span>
            </a>
          </Reveal>

        </div>

      </div>
    </div>
  );
}