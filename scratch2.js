const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const trek = await prisma.trek.findFirst({
    where: { title: { contains: "Chisapani" } },
    select: { title: true, overview: true }
  });
  console.log(trek?.title);
  console.log("---");
  console.log(trek?.overview);
}

main().catch(console.error).finally(() => prisma.$disconnect());
