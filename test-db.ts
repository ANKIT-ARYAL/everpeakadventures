import { prisma } from './lib/prisma';
async function main() { 
  const post = await prisma.blogPost.findFirst({ orderBy: { id: 'desc' } }); 
  console.log("=== CONTENT START ===");
  console.log(post.content); 
  console.log("=== CONTENT END ===");
}
main().finally(() => prisma.$disconnect());
