import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TourDestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const destinationName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Fetch tours related to this destination dynamically
  const tours = await prisma.tour.findMany({
    where: {
      destination: { equals: slug.toLowerCase(), mode: 'insensitive' },
    },
    orderBy: { order: 'asc' },
  });

  // Dynamic descriptions matching your screenshots for each destination
  const getDestinationDescription = (dest: string) => {
    switch (dest.toLowerCase()) {
      case 'nepal':
        return "Nepal is a land of breathtaking Himalayan landscapes, ancient civilizations, vibrant cultures, and warm hospitality. Home to Mount Everest, the world's highest peak, Nepal offers far more than mountains — lush jungles, sacred temples, serene lakes, and living traditions make it one of the most diverse travel destinations in the world.";
      case 'bhutan':
        return "Bhutan is a peaceful Himalayan kingdom known for its untouched landscapes, ancient monasteries, colorful festivals, and deep spiritual traditions. With its focus on sustainable tourism and cultural preservation, Bhutan offers travelers a truly meaningful and authentic experience.";
      case 'tibet':
        return "Tibet is one of the world's most extraordinary travel destinations, renowned for its dramatic Himalayan landscapes, deep spiritual heritage, and unique cultural identity. Located on the vast Tibetan Plateau, Tibet offers breathtaking views of snow-capped peaks, turquoise alpine lakes, and vast open plains.";
      default:
        return `Explore carefully crafted tour packages across ${destinationName}'s most iconic and hidden destinations. Experience the culture, history, and majestic natural beauty.`;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800 pb-24">
      
      {/* Hero Banner Section */}
      <section className="relative py-32 bg-[#112233] text-white text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop" 
            alt={destinationName} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider oswald mb-3">
            Explore {destinationName}
          </h1>
          <p className="text-gray-200 text-sm md:text-base italic max-w-xl mx-auto">
            Discover carefully crafted trekking, climbing, and cultural tour packages across {destinationName}&apos;s most iconic and hidden destinations.
          </p>
        </div>
      </section>

      {/* Destination Content Overview Box */}
      <section className="max-w-[1200px] mx-auto px-5 -mt-10 relative z-20 mb-16">
        <Reveal className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold oswald uppercase mb-4 text-[#222222]">
            {destinationName}
          </h2>
          <div className="text-gray-600 text-[14px] leading-relaxed space-y-3">
            <p>{getDestinationDescription(destinationName)}</p>
            <p className="text-xs text-gray-500 font-medium pt-2">
              At Ever Peak Adventures, we design authentic and safe travel experiences that allow you to explore {destinationName}&apos;s natural beauty, cultural heritage, and adventurous spirit with confidence and comfort.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Tours Grid Section */}
      <section className="max-w-[1200px] mx-auto px-5">
        <Reveal className="text-2xl font-black oswald uppercase tracking-tight text-[#222222] mb-6">
          {destinationName} Tours Packages
        </Reveal>

        {tours.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 oswald uppercase mb-2">No Tour Packages Found in {destinationName}</h3>
            <p className="text-xs text-gray-400">We are currently updating our itineraries for this destination. Check back soon!</p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((pkg) => (
              <StaggerItem
                key={pkg.id} 
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img 
                    src={pkg.heroImage} 
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <h3 className="font-bold text-[#222222] text-base line-clamp-2 mb-4 group-hover:text-[#24a0ed] transition-colors">
                    {pkg.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-center mb-6 text-xs">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Duration</span>
                      <span className="font-bold text-[#222222]">{pkg.duration}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Best Time</span>
                      <span className="font-bold text-[#222222] truncate block">{pkg.bestTime}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/tour/${pkg.slug}`}
                    className="w-full bg-[#1c2e40] hover:bg-[#24a0ed] text-white font-bold text-xs py-3 rounded-lg text-center transition-colors uppercase tracking-wider block shadow-sm"
                  >
                    View Details
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