import { prisma } from "@/lib/prisma";
import WhyChooseUs from "../home/WhyChooseUs";

export default async function WhyChooseUsWrapper() {
  const features = await prisma.whyChooseUsFeature.findMany({
    orderBy: { order: 'asc' },
  });

  return <WhyChooseUs features={features} />;
}