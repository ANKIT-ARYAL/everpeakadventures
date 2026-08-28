import { prisma } from "@/lib/prisma";
import BlueBanner from "../home/BlueBanner";

export default async function BlueBannerWrapper() {
  const content = await prisma.blueBannerContent.findFirst();

  if (content && !content.published) return null;

  const data = content || {
    title: 'Ever Peak Adventure',
    subtitle: 'Your trusted local partner for Himalayan adventures in Nepal.',
    buttonText: 'Learn More',
    buttonLink: '/about-us',
  };

  return <BlueBanner data={data} />;
}