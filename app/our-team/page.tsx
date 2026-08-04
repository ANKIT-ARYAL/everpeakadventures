import React from 'react';
import { Globe, Share2, ExternalLink, MessageCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function OurTeamPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <section className="relative py-32 bg-[#112233] text-white overflow-hidden text-center">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop)',
          }}
        />

        <div className="max-w-[1200px] mx-auto px-5 relative z-20">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider oswald mb-4 drop-shadow-md">
            OUR TEAM
          </h1>
          <p className="text-white text-sm md:text-base italic max-w-xl mx-auto drop-shadow">
            &quot;Passionate experts dedicated to delivering excellence and creating memorable experiences.&quot;
          </p>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          
          {teamMembers && teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
                  <div className="w-full h-80 bg-gray-100 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[#112233] text-lg oswald mb-1">{member.name}</h3>
                      <p className="text-xs text-[#24a0ed] font-medium mb-4">{member.role}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
                      <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#24a0ed] hover:text-white transition-colors cursor-pointer"><Share2 className="w-3.5 h-3.5" /></span>
                      <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#24a0ed] hover:text-white transition-colors cursor-pointer"><Globe className="w-3.5 h-3.5" /></span>
                      <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#24a0ed] hover:text-white transition-colors cursor-pointer"><MessageCircle className="w-3.5 h-3.5" /></span>
                      <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#24a0ed] hover:text-white transition-colors cursor-pointer"><ExternalLink className="w-3.5 h-3.5" /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm">
              No team members found in the database.
            </div>
          )}

        </div>
      </section>

    </div>
  );
}