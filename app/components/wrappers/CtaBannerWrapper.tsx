import { prisma } from "@/lib/prisma";
import CtaBanner from "../home/CtaBanner";

export default async function CtaBannerWrapper() {
  const content = await prisma.ctaBannerContent.findFirst();

  if (content && !content.published) return null;

  const data = content || {
    title: 'Ready to Explore the Himalayas?',
    subtitle: 'Contact us today and let our team craft your perfect Himalayan adventure.',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop',
    primaryLink: '/contact-us',
    secondaryLink: '/tour',
  };

  return <CtaBanner data={data} />;
}