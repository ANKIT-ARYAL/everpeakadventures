import { prisma } from './lib/prisma';
async function main() {
  const tour = await prisma.tour.findUnique({ where: { slug: 'bhaktapur-day-tour' } });
  console.log(JSON.stringify({ heroImage: tour?.heroImage, gallery: tour?.gallery }, null, 2));
}
main().finally(() => prisma.$disconnect());
