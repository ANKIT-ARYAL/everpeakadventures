import React from 'react';
import Link from 'next/link';
import { stripHtml } from '@/lib/stripHtml';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  image: string;
  date: string;
  excerpt: string;
}

export default function BlogCard({ post }: { post: BlogCardProps }) {
  return (
    <div className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300">
      <Link href={`/blog/${post.slug}`} className="absolute inset-0">
        {/* Image */}
        <img
          src={post.image || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500" />

        {/* Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-display font-medium text-white mb-3 group-hover:text-accent-amber transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-white/70 text-[15px] font-sans mb-3 font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 fill-current opacity-80 text-accent-amber" />
              {post.date}
            </span>
          </div>
          <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white/80 text-[14px] font-sans line-clamp-2 pt-3 border-t border-white/20 mt-2 text-justify">
              {stripHtml(post.excerpt)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}