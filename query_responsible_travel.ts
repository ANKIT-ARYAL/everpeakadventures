import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const content = await prisma.responsibleTravelContent.findFirst();
  console.log(content?.contentHtml);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
