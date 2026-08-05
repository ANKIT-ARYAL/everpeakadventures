import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

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
}

export default function ExploreBlogs({ posts = [] }: ExploreBlogsProps) {
  const mainBlog = posts[0];
  const sideBlogs = posts.slice(1, 3);

  if (!mainBlog) {
    return null;
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto px-5 relative z-10">

        {/* BACKGROUND WATERMARK TITLE */}
        <div className="text-center relative mb-16">
          <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[4rem] md:text-[7rem] font-black text-[#f2f4f7] pointer-events-none select-none tracking-widest uppercase z-0 oswald whitespace-nowrap">
            EXPLORE OUR BLOGS
          </h1>
          
          <div className="relative z-10 pt-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight uppercase oswald mb-3">
              Explore Our Blogs
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              At Ever Peak Adventure, we believe that travel is not just about reaching a destination—it’s about creating stories.
            </p>
          </div>
        </div>

        {/* ASYMMETRIC GRID (1 Large Card Left, 2 Stacked Cards Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Large Featured Blog Card */}
          <Link 
            href={`/blogs/${mainBlog.slug}`}
            className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between group block"
          >
            <div className="relative w-full h-[380px] md:h-[440px] overflow-hidden bg-gray-100">
              {mainBlog.image && (
                <img 
                  src={mainBlog.image} 
                  alt={mainBlog.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Overlay Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#3bbae6]" />
                  <span>{mainBlog.category}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold leading-snug group-hover:text-[#3bbae6] transition-colors">
                  {mainBlog.title}
                </h3>
              </div>
            </div>
          </Link>

          {/* Right: Two Stacked Blog Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {sideBlogs.map((blog) => (
              <div 
                key={blog.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col sm:flex-row items-center p-4 gap-4 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <h3 className="font-bold text-[#222222] text-sm md:text-[0.95rem] mb-2 line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                      {blog.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-xs font-bold text-[#222222] hover:text-[#3bbae6] transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
                  >
                    Read More →
                  </Link>
                </div>

                {/* Thumbnail Image */}
                <div className="relative w-full sm:w-[150px] h-[130px] rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}