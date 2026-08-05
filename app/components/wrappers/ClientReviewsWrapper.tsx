import { prisma } from "@/lib/prisma";
import ClientReviews from "../home/ClientReviews";

export default async function ClientReviewsWrapper() {
  const reviews = await prisma.clientReview.findMany({
    orderBy: { order: 'asc' },
  });

  const section = await prisma.testimonialSectionContent.findFirst();

  return <ClientReviews reviews={reviews} section={section} />;
}