import { prisma } from "@/lib/prisma";
import WhyChooseUs from "../home/WhyChooseUs";

export default async function WhyChooseUsWrapper() {
  const features = await prisma.whyChooseUsFeature.findMany({
    orderBy: { order: 'asc' },
  });

  const section = await prisma.homeSectionContent.findFirst();

  return (
    <WhyChooseUs
      features={features}
      badge={section?.whyChooseUsBadge}
      title={section?.whyChooseUsTitle}
      titleHighlight={section?.whyChooseUsTitleHighlight}
      subtitle={section?.whyChooseUsSubtitle}
    />
  );
}