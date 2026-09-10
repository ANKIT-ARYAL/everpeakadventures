const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.tourCategory.findMany();
  console.log("Categories:", categories);
  
  const tours = await prisma.tour.findMany({ select: { slug: true, title: true } });
  console.log("Tours:", tours);
}

main().catch(console.error).finally(() => prisma.$disconnect());
