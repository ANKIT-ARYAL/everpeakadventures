import { prisma } from "@/lib/prisma";
import WelcomeSection from "../home/WelcomeSection";


export default async function WelcomeSectionWrapper() {
  const welcome = await prisma.welcomeContent.findFirst({
    where: { published: true },
  });
  const features = await prisma.welcomeFeature.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  if (!welcome) return null;

  return (
    <WelcomeSection 
      companyName={welcome.companyName} 
      carouselImages={welcome.carouselImages} 
      description={welcome.description ?? undefined}
      buttonText={welcome.buttonText ?? undefined}
      buttonLink={welcome.buttonLink ?? undefined}
      features={features}
    />
  );
}