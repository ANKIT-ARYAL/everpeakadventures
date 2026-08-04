import React from 'react';
import Link from 'next/link';

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  image: string;
  duration: string;
  bestTime: string;
}

interface TourPackagesProps {
  packages: TourPackage[];
}

export default function TourPackagesPage({ packages = [] }: TourPackagesProps) {
  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <section className="relative py-32 bg-[#112233] text-white overflow-hidden text-center">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop)',
          }}
        />

        <div className="max-w-[1200px] mx-auto px-5 relative z-20">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider oswald mb-4 drop-shadow-md">
            TOUR PACKAGES
          </h1>
          <p className="text-white text-sm md:text-base italic max-w-xl mx-auto drop-shadow">
            Discover carefully crafted trekking, climbing, and cultural tour packages across Nepal&apos;s most iconic and hidden destinations.
          </p>
        </div>
      </section>

      {/* TOUR PACKAGES GRID */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          
          {packages.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No tour packages found in the database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-lg transition-shadow"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-[#222222] text-sm md:text-base line-clamp-2 mb-4 group-hover:text-[#24a0ed] transition-colors min-h-[44px]">
                        {pkg.title}
                      </h3>
                    </div>

                    {/* Metadata Box (Duration & Best Time) */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-center mb-4 text-xs">
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Duration</span>
                        <span className="font-bold text-[#222222]">{pkg.duration}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Best Time</span>
                        <span className="font-bold text-[#222222] truncate block">{pkg.bestTime}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link 
                      href={`/tours/${pkg.slug}`}
                      className="w-full bg-[#1c2e40] hover:bg-[#24a0ed] text-white font-bold text-xs py-2.5 rounded-lg text-center transition-colors uppercase tracking-wider block"
                    >
                      View Details
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            <span className="w-8 h-8 rounded bg-[#24a0ed] text-white flex items-center justify-center font-bold text-xs">1</span>
            <span className="w-8 h-8 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold text-xs cursor-pointer">2</span>
            <span className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs cursor-pointer">Next</span>
          </div>

        </div>
      </section>

    </div>
  );
}