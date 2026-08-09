import { prisma } from "@/lib/prisma";
import VideoBanner from "../home/VideoBanner";

export default async function VideoBannerWrapper() {
  const content = await prisma.videoBannerContent.findFirst();

  const data = content || {
    title: 'Explore Full Itineraries & Trip Ideas For Trekking',
    subtitle: 'Carefully crafted Trekking plans designed for every trail, pace, and adventure level.',
    buttonText: 'START JOURNEY',
    buttonLink: '/tour',
    videoUrl: 'https://www.youtube.com/watch?v=gCRNEJxDJKM',
    backgroundImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    ],
  };

  return <VideoBanner data={data} />;
}