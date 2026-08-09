import { prisma } from "@/lib/prisma";
import WhyChooseUs from "../home/WhyChooseUs";

export default async function WhyChooseUsWrapper() {
  const features = await prisma.whyChooseUsFeature.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  const section = await prisma.homeSectionContent.findFirst();

  if (section && !section.published) return null;

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