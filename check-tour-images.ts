import { prisma } from './lib/prisma';

async function main() {
  const tour = await prisma.tour.findFirst({ where: { slug: 'bhaktapur-day-tour' } });
  console.log("Tour ID:", tour?.id);
  console.log("Hero Image:", JSON.stringify(tour?.heroImage));
  console.log("Gallery:", JSON.stringify(tour?.gallery));
}
main().catch(console.error).finally(() => prisma.$disconnect());
