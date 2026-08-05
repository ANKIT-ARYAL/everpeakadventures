import { prisma } from "@/lib/prisma";
import WelcomeSection from "../home/WelcomeSection";


export default async function WelcomeSectionWrapper() {
  const welcome = await prisma.welcomeContent.findFirst();
  const features = await prisma.welcomeFeature.findMany({
    orderBy: { order: 'asc' },
  });

  // Fallback if empty
  const data = welcome || {
    companyName: 'Ever Peak Adventure',
    description: 'Ever Peak Adventure is a trusted Nepal trekking company specializing in trekking, peak climbing, hiking, and customized Himalayan adventures.',
    carouselImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    ],
  };

  return (
    <WelcomeSection 
      companyName={data.companyName} 
      carouselImages={data.carouselImages} 
      description={welcome?.description ?? undefined}
      buttonText={welcome?.buttonText ?? undefined}
      buttonLink={welcome?.buttonLink ?? undefined}
      features={features}
    />
  );
}
