import { prisma } from "@/lib/prisma";
import ExploreBlogs from "../home/ExploreBlogs";

export default async function ExploreBlogsWrapper() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { order: 'asc' },
  });

  const section = await prisma.homeSectionContent.findFirst();

  return (
    <ExploreBlogs
      posts={posts}
      watermark={section?.exploreBlogsWatermark}
      title={section?.exploreBlogsTitle}
      subtitle={section?.exploreBlogsSubtitle}
    />
  );
}