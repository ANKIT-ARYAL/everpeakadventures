import { prisma } from "@/lib/prisma";
import TrustedPartner from "../home/TrustedPartner";


export default async function TrustedPartnerWrapper() {
  const content = await prisma.trustedPartnerContent.findFirst();
  const features = await prisma.whyChooseUsItem.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  if (content && !content.published) return null;

  const defaultContent = {
    mainTitle: 'Your Trusted Partner For Himalayan Adventures',
    description: 'Explore the Himalayas with confidence through expert guidance, local knowledge, and a strong commitment to safety and authentic experiences.',
    badgeTitle: "Traveler's Choice",
    badgeSubtitle: "Ever Peak Adventures Trip Advisor Traveler's Choice. Carrying on a Legacy - Our badge of excellence",
    reviewCountText: 'Reviews 5/5',
    storyTitle: 'Traveler Story',
    storyDescription: 'Based on 100+ trusted Reviews on TripAdvisor. Your journey with us is built on a foundation of proven quality and memorable experiences.',
    storyImage: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=200&h=200&fit=crop',
    bgHeroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop',
  };

  return <TrustedPartner content={content || defaultContent} features={features} />;
}