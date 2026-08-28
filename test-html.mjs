import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const post = await prisma.blogPost.findFirst({ orderBy: { id: 'desc' } });
  console.log("CONTENT:\n", post.content);
}
main().finally(() => prisma.$disconnect());
