import React from 'react';
import { prisma } from '@/lib/prisma';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';
import TourCard from '@/app/components/ui/TourCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function TourCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  let category = await prisma.tourCategory.findFirst({
    where: { slug, published: true },
  });

  const fallbackImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop";

  // If no category found, dynamically generate a category view
  // to avoid 404s for hardcoded navbar categories
  if (!category) {
    const title = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    category = {
      id: "dynamic",
      name: title,
      slug: slug,
      description: `Explore ${title}. It is one of Nepal's most breathtaking tour destinations, featuring stunning landscapes, rich local culture, and world-class itineraries designed for safety, comfort, and unforgettable memories.`,
      image: fallbackImage,
      order: 0,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  const cleanSlug = slug.replace(/-tour/g, '').toLowerCase();

  const tours = await prisma.tour.findMany({
    where: { 
      published: true, 
      OR: [
        { regions: { has: category.name } },
        { regions: { has: slug } },
        { regions: { has: cleanSlug } }
      ]
    },
    orderBy: { order: 'asc' },
  });

  const categoryImage = (category.image && category.image.trim() !== '') ? category.image : fallbackImage;

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-800 pb-24">
      {/* Hero Banner Section */}
      <section className="relative h-[340px] bg-[#112233] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={categoryImage} 
            alt={category.name} 
            className="w-full h-full object-cover opacity-35"
          />
        </div>
        <div className="relative z-10 px-5 lg:px-20">
          <h1 className="text-4xl md:text-5xl font-black text-white oswald uppercase tracking-wider mb-2">
            {category.name}
          </h1>
        </div>
      </section>

      {/* Region Overview Box */}
      <section className="-mt-14 relative z-20 mb-16 px-5 lg:px-20">
        <Reveal className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
          <h2 className="text-xl md:text-2xl font-black text-[#222222] oswald uppercase tracking-tight mb-4">
            {category.name}
          </h2>
          <div className="text-gray-600 text-lg leading-relaxed space-y-4 text-justify">
            <p className="text-[1rem] font-medium text-gray-700">
              {category.description || `Explore ${category.name}. It is one of Nepal's most breathtaking tour destinations, featuring stunning landscapes, rich local culture, and world-class itineraries designed for safety, comfort, and unforgettable memories.`}
            </p>
            <p className="text-[1rem] text-gray-500 text-justify">
              At Ever Peak Adventures, we carefully design every itinerary for safety, comfort, and excitement. Our experienced local guides ensure proper acclimatization throughout the tour, providing quality accommodation and personalized service.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Tours Grid Section */}
      <section className="px-5 lg:px-20">
        {tours.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 oswald uppercase mb-2">No Tours Found in {category.name}</h3>
            <p className="text-md text-gray-400">We are currently updating our packages for this category. Check back soon!</p>
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
                    bestTime: "All Year", 
                    price: tour.price,
                    discountedPrice: tour.discountedPrice
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