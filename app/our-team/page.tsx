import React from 'react';
import { Globe, Share2, ExternalLink, MessageCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import { Stagger, StaggerItem } from '@/app/components/animations/Motion';

export default async function OurTeamPage() {
  const teamMembers = await prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* HERO SECTION */}
      <SubpageHeroContent
        slug="our-team"
        fallbackTitle="OUR TEAM"
        fallbackSubtitle={'"Passionate experts dedicated to delivering excellence and creating memorable experiences."'}
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* MAIN CONTENT SECTION */}
      <section className="py-24">
        <div className="px-5 lg:px-20">
          
          {teamMembers && teamMembers.length > 0 ? (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {teamMembers.map((member) => (
                <StaggerItem key={member.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col group">
                  <div className="w-full h-80 bg-gray-50 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                    />
                  </div>
                  <div className="p-8 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-medium text-[#112233] text-2xl mb-2">{member.name}</h3>
                      <p className="text-lg text-accent-amber font-medium mb-6">{member.role}</p>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-accent-amber hover:text-white transition-colors cursor-pointer"><Share2 className="w-4 h-4" /></span>
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-accent-amber hover:text-white transition-colors cursor-pointer"><Globe className="w-4 h-4" /></span>
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-accent-amber hover:text-white transition-colors cursor-pointer"><MessageCircle className="w-4 h-4" /></span>
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-accent-amber hover:text-white transition-colors cursor-pointer"><ExternalLink className="w-4 h-4" /></span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <div className="text-center py-12 text-foreground/50 text-xl">
              No team members found in the database.
            </div>
          )}

        </div>
      </section>

    </div>
  );
}