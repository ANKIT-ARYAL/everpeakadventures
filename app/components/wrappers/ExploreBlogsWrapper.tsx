import { prisma } from "@/lib/prisma";
import ExploreBlogs from "../home/ExploreBlogs";

export default async function ExploreBlogsWrapper() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { order: 'asc' },
  });

  return <ExploreBlogs posts={posts} />;
}