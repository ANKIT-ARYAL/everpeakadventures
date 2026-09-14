const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const tours = await prisma.tour.findMany({
    where: { duration: { contains: "16" } },
    select: { title: true, duration: true, price: true, groupPrices: true }
  });
  console.log(JSON.stringify(tours, null, 2));

  const treks = await prisma.trek.findMany({
    where: { durationDays: { contains: "16" } },
    select: { title: true, durationDays: true, price: true, groupPrices: true }
  });
  console.log(JSON.stringify(treks, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
