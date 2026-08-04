import { prisma } from "@/lib/prisma";
import ClientReviews from "../home/ClientReviews";

export default async function ClientReviewsWrapper() {
  const reviews = await prisma.clientReview.findMany({
    orderBy: { order: 'asc' },
  });

  return <ClientReviews reviews={reviews} />;
}