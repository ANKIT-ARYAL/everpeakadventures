import React from 'react';
import { prisma } from '@/lib/prisma';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';
import { stripHtml } from '@/lib/stripHtml';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TrekkingRegionPage({ params }: PageProps) {
  const { slug } = await params;

  // Clean up the URL slug to generate flexible search keys
  const cleanSlug = slug.replace(/-region-trekking|-region/g, '').toLowerCase();

  // Fetch treks dynamically using multiple matching patterns so it never misses any region
  const treks = await prisma.trek.findMany({
    where: {
      OR: [
        { region: { contains: cleanSlug, mode: 'insensitive' } },
        { region: { contains: slug, mode: 'insensitive' } },
      ],
      published: true,
    },
    orderBy: { order: 'asc' },
  });

  // Generate a clean, human-readable title from the URL slug
  const regionTitle = slug
    .replace(/-region-trekking|-region/g, ' ')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ' Region';

  const regionDescription = `Explore ${regionTitle}. It is one of Nepal's most breathtaking trekking destinations, featuring stunning Himalayan landscapes, rich local culture, and world-class trails designed for safety, comfort, and unforgettable memories.`;

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-800 pb-24">
      
      {/* Hero Banner Section */}
      <section className="relative h-[340px] bg-[#112233] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            alt={regionTitle} 
            className="w-full h-full object-cover opacity-35"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-black text-white oswald uppercase tracking-wider mb-2">
            {regionTitle}
          </h1>
        </div>
      </section>

      {/* Region Overview Box */}
      <section className="max-w-[1200px] mx-auto px-5 -mt-14 relative z-20 mb-16">
        <Reveal className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
          <h2 className="text-xl md:text-2xl font-black text-[#222222] oswald uppercase tracking-tight mb-4">
            {regionTitle}
          </h2>
          <div className="text-gray-600 text-[14px] leading-relaxed space-y-4">
            <p>{regionDescription}</p>
            <p className="text-xs text-gray-500 font-medium">
              At Ever Peak Adventures, we carefully design every itinerary for safety, comfort, and excitement. Our experienced local guides ensure proper acclimatization throughout the trek, providing quality accommodation and personalized service.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Treks Grid Section */}
      <section className="max-w-[1200px] mx-auto px-5">
        {treks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 oswald uppercase mb-2">No Treks Found in {regionTitle}</h3>
            <p className="text-xs text-gray-400">We are currently updating our packages for this region. Check back soon!</p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treks.map((trek) => (
              <StaggerItem
                key={trek.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Trek Image & Badges */}
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    <img 
                      src={trek.heroImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop'} 
                      alt={trek.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating Info Pills */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="bg-[#112233]/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                        <Clock className="w-3 h-3 text-[#f59e0b]" />
                        {trek.durationDays}
                      </span>
                      <span className="bg-[#f59e0b] text-[#112233] text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                        <Tag className="w-3 h-3" />
                        ${trek.price}
                      </span>
                    </div>
                  </div>

                  {/* Trek Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-[#222222] text-base oswald uppercase tracking-tight mb-2 group-hover:text-[#24a0ed] transition-colors line-clamp-1">
                      {trek.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {stripHtml(trek.description)}
                    </p>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-5 pt-0">
                  <Link 
                    href={`/trekking/${trek.slug ? trek.slug : trek.id}`}
                    className="w-full bg-[#f8faf9] hover:bg-[#f59e0b] hover:text-[#112233] text-gray-800 border border-gray-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-between group/btn"
                  >
                    <span>START JOURNEY</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

    </div>
  );
}