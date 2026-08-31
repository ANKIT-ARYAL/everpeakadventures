import { prisma } from "@/lib/prisma";
import BookingFormClient from "./BookingFormClient";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function BookingFormServerPage() {
  const treks = await prisma.trek.findMany({ where: { published: true }, select: { id: true, title: true, price: true, heroImage: true, durationDays: true } });
  const tours = await prisma.tour.findMany({ where: { published: true }, select: { id: true, title: true, price: true, heroImage: true, duration: true } });
  const siteSettings = await prisma.siteSettings.findFirst();

  const trips = [
    ...treks.map(t => ({ id: t.id, title: t.title, type: 'trek' as const, duration: t.durationDays, price: t.price || 1199, image: t.heroImage })),
    ...tours.map(t => ({ id: t.id, title: t.title, type: 'tour' as const, duration: t.duration, price: t.price || 1199, image: t.heroImage }))
  ];

  return (
    <div className="journey-page min-h-screen bg-[#f4f6f8] font-sans text-gray-800 pb-24">
      <div className="mx-auto px-5 lg:px-20 pt-28 pb-4 text-[13px] font-bold text-gray-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-[#24a0ed] transition-colors">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-[#112233]">Booking Form</span>
      </div>
      <BookingFormClient trips={trips} logoImage={siteSettings?.logoImage ?? undefined} />
    </div>
  );
}