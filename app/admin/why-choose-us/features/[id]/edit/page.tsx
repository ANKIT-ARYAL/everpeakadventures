import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import WhyChooseUsFeatureForm from "../../WhyChooseUsFeatureForm";

export const dynamic = 'force-dynamic';

export default async function EditWhyChooseUsFeaturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const feature = await prisma.whyChooseUsFeature.findUnique({ where: { id } });
  if (!feature) notFound();
  return <WhyChooseUsFeatureForm initialData={feature} isEditing={true} />;
}
