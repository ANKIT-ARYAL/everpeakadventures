import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const treks = await prisma.trek.findMany({ take: 5, select: { id: true, title: true } });
  console.log(treks);
}
main().catch(console.error).finally(() => prisma.$disconnect());
