import { prisma } from "@/lib/prisma";
import BookingFormClient from "./BookingFormClient";

export const dynamic = 'force-dynamic';

export default async function BookingFormServerPage() {
  // Fetch treks and tours from database for the dropdown
  const treks = await prisma.trek.findMany({ where: { published: true }, select: { id: true, title: true, price: true, heroImage: true, durationDays: true } });
  const tours = await prisma.tour.findMany({ where: { published: true }, select: { id: true, title: true, price: true, heroImage: true, duration: true } });
  const siteSettings = await prisma.siteSettings.findFirst();

  // Map into a unified trip option array
  const trips = [
    ...treks.map(t => ({ id: t.id, title: t.title, type: 'trek' as const, duration: t.durationDays, price: t.price || 1199, image: t.heroImage })),
    ...tours.map(t => ({ id: t.id, title: t.title, type: 'tour' as const, duration: t.duration, price: t.price || 1199, image: t.heroImage }))
  ];

  return <BookingFormClient trips={trips} logoImage={siteSettings?.logoImage ?? undefined} />;
}