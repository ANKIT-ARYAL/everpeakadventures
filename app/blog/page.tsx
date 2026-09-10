import React from 'react';
import { prisma } from '@/lib/prisma';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import { Stagger, StaggerItem } from '@/app/components/animations/Motion';
import BlogCard from '@/app/components/ui/BlogCard';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <SubpageHeroContent
        slug="blog"
        fallbackTitle="OUR BLOGS"
        fallbackSubtitle="Explore inspiring stories, travel experiences, and insights from the heart of the Himalayas."
        fallbackImage="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop"
      />

      {/* BLOG GRID SECTION */}
      <section className="py-16">
        <div className="px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
          
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No blog posts found in the database.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <StaggerItem key={post.id}>
                  <BlogCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

        </div>
      </section>

    </div>
  );
}