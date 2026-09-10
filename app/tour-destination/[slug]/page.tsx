/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { prisma } from '@/lib/prisma';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';
import TourCard from '@/app/components/ui/TourCard';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TourDestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const destinationName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Fetch tours related to this destination dynamically
  // Now also checks the regions array field (new taxonomy)
  const tours = await prisma.tour.findMany({
    where: {
      OR: [
        { destination: { equals: slug.toLowerCase(), mode: 'insensitive' } },
        { primaryDestination: { equals: slug.toLowerCase(), mode: 'insensitive' } },
        { regions: { has: slug.toLowerCase() } },
        { regions: { has: destinationName } },
      ],
      published: true,
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

  const fallbackImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-800 pb-24">
      
      {/* Hero Banner Section */}
      <section className="relative h-[340px] bg-[#112233] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={fallbackImage} 
            alt={destinationName} 
            className="w-full h-full object-cover opacity-35"
          />
        </div>
        <div className="relative z-10 px-5 lg:px-20">
          <h1 className="text-4xl md:text-5xl font-black text-white oswald uppercase tracking-wider mb-2">
            {destinationName}
          </h1>
        </div>
      </section>

      {/* Destination Overview Box */}
      <section className="-mt-14 relative z-20 mb-16 px-5 lg:px-20">
        <Reveal className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
          <h2 className="text-xl md:text-2xl font-black text-[#222222] oswald uppercase tracking-tight mb-4">
            {destinationName}
          </h2>
          <div className="text-gray-600 text-lg leading-relaxed space-y-4 text-justify">
            <p className="text-[1rem] font-medium text-gray-700">{getDestinationDescription(destinationName)}</p>
            <p className="text-[1rem] text-gray-500 text-justify">
              At Ever Peak Adventures, we design authentic and safe travel experiences that allow you to explore {destinationName}'s natural beauty, cultural heritage, and adventurous spirit with confidence and comfort.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Tours Grid Section */}
      <section className="px-5 lg:px-20">
        {tours.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 oswald uppercase mb-2">No Tour Packages Found in {destinationName}</h3>
            <p className="text-md text-gray-400">We are currently updating our itineraries for this destination. Check back soon!</p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours.map((tour) => {
              const tourImage = (tour.heroImage && tour.heroImage.trim() !== '') ? tour.heroImage : fallbackImage;
              return (
                <StaggerItem key={tour.id}>
                  <TourCard tour={{
                    id: tour.id,
                    title: tour.title,
                    slug: tour.slug,
                    heroImage: tourImage,
                    duration: tour.duration,
                    bestTime: tour.bestTime || "All Year",
                    grade: tour.grade,
                    price: tour.price,
                    discountedPrice: tour.discountedPrice,
                    lowestPrice: tour.discountedPrice ?? tour.price ?? 0,
                    overview: tour.overview,
                    description: tour.description
                  }} />
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </section>

    </div>
  );
}