import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import WelcomeFeatureForm from "../../WelcomeFeatureForm";

export default async function EditWelcomeFeaturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const feature = await prisma.welcomeFeature.findUnique({ where: { id } });
  if (!feature) notFound();
  return <WelcomeFeatureForm initialData={feature} isEditing={true} />;
}
