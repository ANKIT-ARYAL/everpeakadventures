import { prisma } from "@/lib/prisma";
import BlueBanner from "../home/BlueBanner";

export default async function BlueBannerWrapper() {
  const content = await prisma.blueBannerContent.findFirst();

  const data = content || {
    title: 'Explore the Himalayas with Trusted Local Experts',
    subtitle: 'Ever Peak Adventures offers unforgettable trekking, peak climbing, and cultural journeys across Everest, Annapurna, and beyond. Safe, authentic, and professionally guided.',
    buttonText: 'View All Trek Packages →',
    buttonLink: '/tour',
  };

  return <BlueBanner data={data} />;
}