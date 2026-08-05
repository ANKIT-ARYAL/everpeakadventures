import { prisma } from "@/lib/prisma";
import BookingFormClient from "./BookingFormClient";

export const dynamic = 'force-dynamic';

export default async function BookingFormServerPage() {
  // Fetch treks and tours from database for the dropdown
  const treks = await prisma.trek.findMany({ select: { id: true, title: true, price: true, heroImage: true, durationDays: true } });
  const tours = await prisma.tour.findMany({ select: { id: true, title: true, price: true, image: true, duration: true } });

  // Map into a unified trip option array
  const trips = [
    ...treks.map(t => ({ id: t.id, title: t.title, duration: t.durationDays, price: t.price || 1199, image: t.heroImage })),
    ...tours.map(t => ({ id: t.id, title: t.title, duration: t.duration, price: t.price || 1199, image: t.image }))
  ];

  return <BookingFormClient trips={trips} />;
}