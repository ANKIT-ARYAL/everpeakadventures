'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import Image from 'next/image';
import { stripHtml } from '@/lib/stripHtml';
import RichText from '@/app/components/RichText';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

interface ExploreBlogsProps {
  posts: BlogPost[];
  watermark?: string;
  title?: string;
  subtitle?: string;
}

export default function ExploreBlogs({ posts = [], title, subtitle }: ExploreBlogsProps) {
  const mainBlog = posts[0];
  const sideBlogs = posts.slice(1, 3);

  if (!mainBlog) {
    return null;
  }

  return (
    <section className="py-24 bg-foreground text-background relative overflow-hidden font-sans border-t border-background/10">
      <div className="relative z-10 px-5 lg:px-20">

        {/* HEADER */}
        <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-background tracking-tight mb-4">
              {title ?? 'Explore Our Blogs'}
            </h2>
            <div className="font-sans text-background/70 text-lg">
              <RichText html={subtitle ?? 'Travel is not just about reaching a destination—it’s about creating stories.'} />
            </div>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 font-sans font-semibold text-background hover:text-accent-amber transition-colors pb-1 border-b-2 border-transparent hover:border-accent-amber">
            View All Posts
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </Reveal>

        {/* ASYMMETRIC GRID */}
        <Stagger className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Large Featured Blog Card */}
          <StaggerItem className="lg:col-span-7">
            <Link 
              href={`/blog/${mainBlog.slug}`}
              className="group block h-full flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-background/5 mb-6">
                {mainBlog.image && (
                  <img
                    src={mainBlog.image} 
                    alt={mainBlog.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                  />
                )}
                {/* Subtle inner shadow overlay */}
                <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
              </div>
              
              <div className="flex items-center gap-3 text-lg font-semibold text-accent-amber mb-3">
                <MapPin className="w-4 h-4" />
                <span>{mainBlog.category}</span>
                <span className="w-1 h-1 rounded-full bg-background/20 ml-2" />
                <span className="text-background/50 font-medium ml-2">{mainBlog.date}</span>
              </div>
              <h3 className="text-3xl font-display font-medium leading-snug text-background group-hover:text-accent-amber transition-colors mb-4">
                {mainBlog.title}
              </h3>
              <p className="text-background/60 text-lg font-sans leading-relaxed line-clamp-2">
                {stripHtml(mainBlog.excerpt)}
              </p>
            </Link>
          </StaggerItem>

          {/* Right: Two Stacked Blog Cards */}
          <div className="lg:col-span-5 flex flex-col gap-10">            
            {sideBlogs.map((blog) => (
              <StaggerItem
                key={blog.id}
                className="group flex flex-col sm:flex-row items-center gap-6"
              >
                <Link
                    href={`/blog/${blog.slug}`}
                    className="flex flex-col sm:flex-row items-center gap-6 w-full">
                
                {/* Thumbnail Image */}
                <div className="relative w-full sm:w-40 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden shrink-0 bg-background/5">
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-md font-semibold text-accent-amber mb-2">
                    <span>{blog.category}</span>
                    <span className="w-1 h-1 rounded-full bg-background/20 ml-2" />
                    <span className="text-background/50 font-medium ml-2">{blog.date}</span>
                  </div>
                  <h3 className="font-display font-medium text-background text-xl mb-3 line-clamp-2 leading-snug group-hover:text-accent-amber transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-background/60 text-lg leading-relaxed font-sans line-clamp-2">
                    {stripHtml(blog.excerpt)}
                  </p>
                </div>
                
                </Link>
              </StaggerItem>
            ))}
          </div>

        </Stagger>

      </div>
    </section>
  );
}
