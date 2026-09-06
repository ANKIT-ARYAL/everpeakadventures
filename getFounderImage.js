const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const member = await prisma.teamMember.findFirst({ where: { name: { contains: "Dipesh" } } });
  console.log(member?.image);
}
main().catch(console.error).finally(() => prisma.$disconnect());
