import { prisma } from "@/lib/prisma";
import CtaBanner from "../home/CtaBanner";

export default async function CtaBannerWrapper() {
  const content = await prisma.ctaBannerContent.findFirst();

  const data = content || {
    title: 'Experience nature in a new way. Visit Us.',
    subtitle: 'Where every step brings you closer to nature.',
    bgImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop',
    primaryLink: '/contact',
    secondaryLink: '/tours',
  };

  return <CtaBanner data={data} />;
}