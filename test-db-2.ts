import { prisma } from './lib/prisma';
async function main() { 
  const posts = await prisma.blogPost.findMany();
  for (const post of posts) {
    if (post.content.includes('image-collage')) {
      console.log("=== FOUND COLLAGE IN:", post.title, "===");
      console.log(post.content);
    }
  }
}
main().finally(() => prisma.$disconnect());
