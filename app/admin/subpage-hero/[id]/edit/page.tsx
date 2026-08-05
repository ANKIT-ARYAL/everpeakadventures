import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SubpageHeroForm from "../../SubpageHeroForm";

export default async function EditSubpageHeroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hero = await prisma.subpageHero.findUnique({ where: { id } });
  if (!hero) notFound();
  return <SubpageHeroForm initialData={hero} isEditing={true} />;
}
