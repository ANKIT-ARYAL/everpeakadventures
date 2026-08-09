import { prisma } from "@/lib/prisma";
import ClientReviews from "../home/ClientReviews";

export default async function ClientReviewsWrapper() {
  const reviews = await prisma.clientReview.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  const section = await prisma.testimonialSectionContent.findFirst();

  if (section && !section.published) return null;

  return <ClientReviews reviews={reviews} section={section} />;
}