const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const content = await prisma.directorMessageContent.findFirst({
    where: { published: true },
  });
  console.log("Current DB Image:", content?.founderImage);
  
  if (content) {
    await prisma.directorMessageContent.update({
      where: { id: content.id },
      data: { founderImage: 'https://everpeakadventures.com/wp-content/uploads/2026/03/Dipesh-Aryal-Ever-peak-Adventure.png' }
    });
    console.log("Updated DB Image successfully.");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
