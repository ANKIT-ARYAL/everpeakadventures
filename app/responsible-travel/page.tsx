import React from 'react';
import { prisma } from '@/lib/prisma';
import SubpageHero from '@/app/components/pages/SubpageHero';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';

export default async function ResponsibleTravelPage() {
  const content = await prisma.responsibleTravelContent.findFirst({
    where: { published: true },
  });

  const data = content || {
    title: 'Responsible Travel',
    subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
    contentHtml: '',
  };

  // Dynamically parse the DB HTML string into structured reasons
  const reasons: { title: string; description: string; image?: string }[] = [];
  if (data.contentHtml) {
    try {
      // Try parsing as JSON (new format)
      const parsedCards = JSON.parse(data.contentHtml);
      if (Array.isArray(parsedCards)) {
        reasons.push(...parsedCards);
      }
    } catch (e) {
      // Fallback: Parse the old HTML structure using regex
      const h3Matches = [...data.contentHtml.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)];
      const pMatches = [...data.contentHtml.matchAll(/<p[^>]*>(.*?)<\/p>/g)];
      
      for (let i = 0; i < h3Matches.length; i++) {
        reasons.push({
          title: h3Matches[i][1].replace(/<[^>]+>/g, '').trim(),
          description: (pMatches[i] ? pMatches[i][1].replace(/<[^>]+>/g, '').trim() : ''),
        });
      }
    }
  }

  // Fallback if parsing fails or DB is empty
  if (reasons.length === 0) {
    reasons.push(
      { title: "Eco-Friendly Operations", description: "We minimize our environmental footprint by practicing Leave No Trace principles on every trek." },
      { title: "Community Empowerment", description: "We hire local guides and porters, ensuring fair wages and contributing to the local economy." },
      { title: "Cultural Respect", description: "We educate our guests on local customs to foster deep, respectful connections with Himalayan communities." },
      { title: "Sustainable Tourism", description: "A portion of our profits goes toward funding education and infrastructure in remote villages." }
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* HERO SECTION */}
      <SubpageHero
        title={data.title}
        subtitle={data.subtitle}
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* MAIN CONTENT SECTION - BENTO GRID DESIGN */}
      <section className="py-24">
        <div className="px-5 lg:px-20 max-w-[1400px] mx-auto">

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, idx) => {
              // Create an explicit Bento layout for the items
              let spanClass = "col-span-1";
              let bgClass = "bg-slate-50 border-gray-100";
              let textClass = "text-gray-600";
              let titleClass = "text-[#112233]";
              let overlayClass = "";
              
              if (idx === 0) {
                // Item 1: Huge Left (2x2)
                spanClass = "md:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2 min-h-[400px] md:min-h-[500px]";
                bgClass = "bg-[#112233] border-[#112233]";
                textClass = "text-gray-200";
                titleClass = "text-white text-3xl md:text-4xl";
              } else if (idx === 1) {
                // Item 2: Right Top (2x1)
                spanClass = "md:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-1 min-h-[250px]";
              } else if (idx === 2) {
                // Item 3: Right Bottom (2x1)
                spanClass = "md:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-2 min-h-[250px]";
              } else if (idx === 3) {
                // Item 4: Full Width Row (4x1)
                spanClass = "md:col-span-2 lg:col-start-1 lg:col-span-4 lg:row-start-3 min-h-[250px] md:min-h-[300px]";
                bgClass = "bg-blue-50/50 border-blue-100/50";
                titleClass = "text-[#112233] text-2xl md:text-3xl";
              } else if (idx === 4) {
                // Item 5: Left Vertical Top (2x1)
                spanClass = "md:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-4 min-h-[250px]";
              } else if (idx === 5) {
                // Item 6: Left Vertical Bottom (2x1)
                spanClass = "md:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-5 min-h-[250px]";
              } else if (idx === 6) {
                // Item 7: Huge Right (2x2)
                spanClass = "md:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-4 lg:row-span-2 min-h-[400px] md:min-h-[500px]";
                bgClass = "bg-[#112233] border-[#112233]";
                textClass = "text-gray-200";
                titleClass = "text-white text-3xl md:text-4xl";
              } else if (idx === 7) {
                // Item 8: Made Full Width (4x1)
                spanClass = "md:col-span-2 lg:col-start-1 lg:col-span-4 lg:row-start-6 min-h-[250px]";
                titleClass = "text-[#112233] text-xl md:text-2xl";
              }

              const isSplitLayout = [1, 2, 4, 5].includes(idx);
              const isReversed = [2, 5].includes(idx);

              // Apply image background and overrides if image exists (ONLY for non-split layouts)
              if (reason.image && !isSplitLayout) {
                bgClass = "bg-gray-900 border-transparent";
                textClass = "text-gray-200 text-shadow-sm";
                titleClass = "text-white drop-shadow-md " + (idx === 0 || idx === 6 ? "text-3xl md:text-4xl" : (idx === 3) ? "text-2xl md:text-3xl" : "text-xl md:text-2xl");
                overlayClass = "absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-10 rounded-3xl";
              }

              if (isSplitLayout) {
                return (
                  <StaggerItem 
                    key={idx} 
                    className={`relative rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden bg-white ${spanClass}`}
                  >
                    {/* Image Half */}
                    {reason.image ? (
                      <div className={`w-full sm:w-1/2 h-64 sm:h-auto relative overflow-hidden ${isReversed ? 'sm:order-2' : 'sm:order-1'}`}>
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${reason.image})` }}
                        />
                      </div>
                    ) : (
                      <div className={`w-full sm:w-1/2 h-64 sm:h-auto relative overflow-hidden bg-gray-100 ${isReversed ? 'sm:order-2' : 'sm:order-1'}`} />
                    )}
                    
                    {/* Text Half */}
                    <div className={`w-full sm:w-1/2 p-8 md:p-10 flex flex-col justify-center transition-transform duration-500 group-hover:translate-x-1 ${isReversed ? 'sm:order-1' : 'sm:order-2'}`}>
                      <div className="font-mono text-sm font-bold text-accent-amber opacity-70 mb-4 tracking-widest uppercase">
                        0{idx + 1}
                      </div>
                      <h3 className="font-extrabold mb-4 leading-tight tracking-tight text-[#112233] text-xl md:text-2xl">
                        {reason.title}
                      </h3>
                      <p className="leading-relaxed text-base md:text-lg text-gray-600 text-pretty">
                        {reason.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              }

              // Standard full-card layout
              return (
                <StaggerItem 
                  key={idx} 
                  className={`relative rounded-3xl p-8 md:p-10 border shadow-sm flex flex-col justify-end group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${spanClass} ${bgClass}`}
                >
                  {/* Background Image Setup */}
                  {reason.image && (
                    <>
                      <div 
                        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${reason.image})` }}
                      />
                      <div className={overlayClass} />
                    </>
                  )}

                  {/* Content layer */}
                  <div className={`relative z-20 h-full flex flex-col justify-end transition-transform duration-500 group-hover:-translate-y-1 ${reason.image ? 'justify-end' : 'justify-start'}`}>
                    <div className={`font-mono text-sm font-bold opacity-70 mb-auto pb-8 tracking-widest uppercase ${reason.image || idx === 0 ? 'text-white/70' : 'text-accent-amber'}`}>
                      0{idx + 1}
                    </div>
                    
                    <div>
                      <h3 className={`font-extrabold mb-4 leading-tight tracking-tight ${titleClass}`}>
                        {reason.title}
                      </h3>
                      
                      <p className={`leading-relaxed text-base md:text-lg ${textClass}`}>
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

        </div>
      </section>

    </div>
  );
}
