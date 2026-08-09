import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import { Stagger, StaggerItem } from '@/app/components/animations/Motion';
import { stripHtml } from '@/lib/stripHtml';

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
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No blog posts found in the database.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <StaggerItem
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-lg transition-all"
                >
                  {/* Blog Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Blog Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      
                      <h3 className="font-bold text-[#222222] text-base md:text-lg line-clamp-2 mb-3 group-hover:text-[#24a0ed] transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 text-xs md:text-sm line-clamp-3 mb-6 leading-relaxed">
                        {stripHtml(post.excerpt)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#222222] group-hover:text-[#24a0ed] uppercase tracking-wider transition-colors"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>

                </StaggerItem>
              ))}
            </Stagger>
          )}

        </div>
      </section>

    </div>
  );
}