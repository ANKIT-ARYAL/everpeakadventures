import React from 'react';
import { prisma } from '@/lib/prisma';
import { FileText, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import { Stagger, StaggerItem } from '@/app/components/animations/Motion';

export default async function LegalDocumentsPage() {
  // Fetch legal documents dynamically from the database
  const documents = await prisma.legalDocument.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  // Fallback items if database is empty initially
  const displayDocuments = documents.length > 0 ? documents : [
    {
      id: '1',
      title: 'Company Registration Certificate',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      documentUrl: '#',
    },
    {
      id: '2',
      title: 'Department of Tourism License',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      documentUrl: '#',
    },
    {
      id: '3',
      title: 'Tax Clearance Certificate (PAN)',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      documentUrl: '#',
    },
    {
      id: '4',
      title: 'TAAN & NMA Membership Affiliation',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      documentUrl: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      
      {/* Dark & Premium Hero Banner Section */}
      <SubpageHeroContent
        slug="legal-document"
        fallbackTitle="Licenses & Certifications"
        fallbackSubtitle="Discover the credentials that make Ever Peak Adventures a trusted, government-certified trekking and expedition operator in Nepal."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="pt-24 px-5 lg:px-20 max-w-[1600px] mx-auto">
        
        {/* Trust Indicators */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 mb-20">
          <div className="flex items-center gap-4 text-gray-600">
            <ShieldCheck className="w-8 h-8 text-accent-amber" />
            <span className="font-bold tracking-wide uppercase text-sm">Government Approved</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <Award className="w-8 h-8 text-accent-amber" />
            <span className="font-bold tracking-wide uppercase text-sm">Fully Insured & Licensed</span>
          </div>
        </div>

        {/* Stunning Masonry / Gallery Grid */}
        <Stagger className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          {displayDocuments.map((doc) => (
            <StaggerItem 
              key={doc.id} 
              className="break-inside-avoid relative group rounded-[1.5rem] overflow-hidden bg-white shadow-xl border border-gray-100"
            >
              {doc.documentUrl ? (
                <a
                  href={doc.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative"
                >
                  <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[300px]">
                    {doc.image ? (
                      <img
                        src={doc.image}
                        alt={doc.title}
                        className="w-full h-auto object-cover transform transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[300px] bg-gray-50 flex items-center justify-center">
                        <FileText className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Dark Glassmorphism Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-8">
                      <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-amber/20 border border-accent-amber/50 text-accent-amber rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </div>
                        <h3 className="font-display font-medium text-white text-2xl leading-tight mb-4 drop-shadow-md">
                          {doc.title}
                        </h3>
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-accent-amber transition-colors">
                          View Certificate <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="block relative">
                  <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[300px]">
                    {doc.image ? (
                      <img
                        src={doc.image}
                        alt={doc.title}
                        className="w-full h-auto object-cover transform transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[300px] bg-gray-50 flex items-center justify-center">
                        <FileText className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Dark Glassmorphism Overlay on Hover (No Link) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-8">
                      <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-amber/20 border border-accent-amber/50 text-accent-amber rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Official Record
                        </div>
                        <h3 className="font-display font-medium text-white text-2xl leading-tight drop-shadow-md">
                          {doc.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </section>

    </div>
  );
}