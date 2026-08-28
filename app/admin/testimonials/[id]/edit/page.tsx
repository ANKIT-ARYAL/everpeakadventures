import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TestimonialForm from "../../TestimonialForm";

export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await prisma.clientReview.findUnique({ where: { id } });
  if (!review) notFound();

  const sectionData = await prisma.testimonialSectionContent.findFirst();
  return <TestimonialForm initialData={review} sectionData={sectionData} isEditing={true} />;
}
