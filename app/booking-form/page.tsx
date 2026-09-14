import { prisma } from "@/lib/prisma";
import BookingFormClient from "./BookingFormClient";
import Link from "next/link";
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import FeaturedTreksWrapper from '@/app/components/wrappers/FeaturedTreksWrapper';

export const dynamic = 'force-dynamic';

export default async function BookingFormServerPage() {
  const treks = await prisma.trek.findMany({ where: { published: true }, select: { id: true, title: true, price: true, heroImage: true, durationDays: true, groupPrices: { select: { groupSize: true, groupType: true, price: true } } } });
  const tours = await prisma.tour.findMany({ where: { published: true }, select: { id: true, title: true, price: true, heroImage: true, duration: true, groupPrices: { select: { groupSize: true, groupType: true, price: true } } } });
  const siteSettings = await prisma.siteSettings.findFirst();

  const trips = [
    ...treks.map(t => ({ id: t.id, title: t.title, type: 'trek' as const, duration: t.durationDays, price: t.price || 1199, image: t.heroImage, groupPrices: t.groupPrices })),
    ...tours.map(t => ({ id: t.id, title: t.title, type: 'tour' as const, duration: t.duration, price: t.price || 1199, image: t.heroImage, groupPrices: t.groupPrices }))
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans text-gray-800 pb-24">
      {/* Hero Banner Section */}
      <SubpageHeroContent
        slug="booking-form"
        fallbackTitle="Book Your Adventure"
        fallbackSubtitle="Ready for the Himalayas? Fill out the form below to request a booking or customize your trip."
        fallbackImage="https://images.unsplash.com/photo-1522199710521-72d69614c71c?q=80&w=2000&auto=format&fit=crop"
      />
      
      {/* Form Container with negative margin to overlap the hero slightly */}
      <div className="-mt-16 relative z-20 px-5 lg:px-20 max-w-[1400px] mx-auto mb-20">
        <BookingFormClient trips={trips} logoImage={siteSettings?.logoImage ?? undefined} />
      </div>

      <div className="bg-white pt-10 border-t border-gray-200">
        <FeaturedTreksWrapper />
      </div>
    </div>
  );
}