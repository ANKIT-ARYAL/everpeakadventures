import { prisma } from "@/lib/prisma";
import TestimonialForm from "../TestimonialForm";

export const dynamic = 'force-dynamic';

export default async function NewTestimonialPage() {
  const sectionData = await prisma.testimonialSectionContent.findFirst();
  return <TestimonialForm sectionData={sectionData} isEditing={false} />;
}
