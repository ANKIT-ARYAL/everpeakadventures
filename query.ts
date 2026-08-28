import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const treks = await prisma.trek.findMany({ take: 3 });
  treks.forEach(t => console.log("ID:", t.id, "\nDESC:", t.description, "\n---"));
}
main().catch(console.error).finally(() => prisma.$disconnect());
