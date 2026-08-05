import React from 'react';
import { prisma } from '@/lib/prisma';
import { FileText, Download, ExternalLink } from 'lucide-react';

export default async function LegalDocumentsPage() {
  // Fetch legal documents dynamically from the database
  const documents = await prisma.legalDocument.findMany({
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
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-800 pb-20">
      
      {/* Hero Banner Section */}
      <section className="relative h-[320px] bg-[#112233] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            alt="Legal Documents" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-black text-white oswald uppercase tracking-wider mb-3">
            Legal Document
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            All essential travel documents and permits required for your Himalayan adventure.
          </p>
        </div>
      </section>

      {/* Content Grid Section */}
      <section className="max-w-[1200px] mx-auto px-5 pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDocuments.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col group hover:shadow-lg transition-all"
            >
              {/* Document Image Thumbnail Preview */}
              <div className="relative h-64 bg-gray-100 overflow-hidden border-b border-gray-100 flex items-center justify-center">
                <img 
                  src={doc.image} 
                  alt={doc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-[#24a0ed] rounded-xl shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#222222] text-base oswald uppercase tracking-tight leading-snug">
                    {doc.title}
                  </h3>
                </div>

                {/* Actions / View Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Verified Certificate</span>
                  {doc.documentUrl ? (
                    <a 
                      href={doc.documentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24a0ed] hover:underline"
                    >
                      <span>View Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-gray-400">Official Record</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}