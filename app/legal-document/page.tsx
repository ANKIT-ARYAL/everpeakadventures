import React from 'react';
import { prisma } from '@/lib/prisma';
import { FileText, Download, ExternalLink } from 'lucide-react';
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
      
      {/* Hero Banner Section */}
      <SubpageHeroContent
        slug="legal-document"
        fallbackTitle="Legal Document"
        fallbackSubtitle="All essential travel documents and permits required for your Himalayan adventure."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* Content Grid Section */}
      <section className="pt-20 px-5 lg:px-20">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayDocuments.map((doc) => (
              <StaggerItem key={doc.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                {doc.documentUrl ? (
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col flex-1"
                  >
                    {/* Document Image Thumbnail Preview */}
                    <div className="relative h-64 bg-gray-50 overflow-hidden border-b border-gray-100 flex items-center justify-center">
                      <img
                        src={doc.image}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8 flex flex-col flex-1 justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent-amber/10 text-accent-amber rounded-[1rem] shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-display font-medium text-[#112233] text-xl tracking-tight leading-snug">
                          {doc.title}
                        </h3>
                      </div>

                      {/* Actions / View Button */}
                      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-lg text-gray-500 font-medium">Verified Certificate</span>
                        <span className="inline-flex items-center gap-2 text-lg font-bold text-accent-amber hover:underline">
                          <span>View</span>
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <>
                    {/* Document Image Thumbnail Preview */}
                    <div className="relative h-64 bg-gray-50 overflow-hidden border-b border-gray-100 flex items-center justify-center">
                      <img
                        src={doc.image}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8 flex flex-col flex-1 justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent-amber/10 text-accent-amber rounded-[1rem] shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-display font-medium text-[#112233] text-xl tracking-tight leading-snug">
                          {doc.title}
                        </h3>
                      </div>

                      {/* Actions / View Button */}
                      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-lg text-gray-500 font-medium">Verified Certificate</span>
                        <span className="text-lg font-bold text-gray-500">Official Record</span>
                      </div>
                    </div>
                  </>
                )}
              </StaggerItem>
          ))}
        </Stagger>
      </section>

    </div>
  );
}