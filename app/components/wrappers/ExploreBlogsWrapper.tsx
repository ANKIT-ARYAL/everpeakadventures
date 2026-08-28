import { prisma } from "@/lib/prisma";
import ExploreBlogs from "../home/ExploreBlogs";

export default async function ExploreBlogsWrapper() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  const section = await prisma.homeSectionContent.findFirst();

  if (section && !section.published) return null;

  return (
    <ExploreBlogs
      posts={posts}
      watermark={section?.exploreBlogsWatermark}
      title={section?.exploreBlogsTitle}
      subtitle={section?.exploreBlogsSubtitle}
    />
  );
}