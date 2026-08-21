import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, FolderOpen, ArrowRight } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/app/components/animations/Motion';
import FAQAccordion from '@/app/components/FAQAccordion';
import { stripHtml } from '@/lib/stripHtml';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Query database for blog post matching slug
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  });

  if (!post) notFound();

  // Related posts for the bottom section
  const relatedPosts = await prisma.blogPost.findMany({
    where: { id: { not: post.id }, published: true },
    take: 3,
    orderBy: { order: 'asc' },
  });

  // Safe cast for faqs Json field
  const faqs = Array.isArray(post.faqs) ? (post.faqs as any[]) : [];

  // Linked FAQs from the FAQ manager (related blog)
  const linkedFaqs = await prisma.fAQ.findMany({
    where: { relatedType: 'blog', relatedSlug: post.slug, published: true },
    orderBy: { order: 'asc' },
  });
  const mergedFaqs = [...linkedFaqs, ...faqs];

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans text-gray-800 pb-24">

      {/* 1. TOP HERO TITLE BANNER */}
      <section className="relative py-20 bg-[#112233] text-white text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider oswald">
            {post.title}
          </h1>
        </div>
      </section>

      {/* 2. MAIN ARTICLE */}
      <section className="max-w-[1200px] mx-auto px-5 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDEBAR: POST META */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-6 sticky top-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Calendar className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Published On</span>
                  <span className="font-bold text-[#112233] text-sm">{post.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <FolderOpen className="w-5 h-5 text-[#24a0ed]" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Category</span>
                  <span className="font-bold text-[#112233] text-sm">{post.category}</span>
                </div>
              </div>

              <Link
                href="/blog"
                className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-3.5 rounded-lg text-center transition-colors uppercase tracking-wider block text-xs shadow-sm"
              >
                Back to Blogs
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: ARTICLE CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero Image */}
            <Reveal className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img src={post.image} alt={post.title} className="w-full h-72 md:h-96 object-cover" />
            </Reveal>

            {/* Article Body */}
            <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded border border-amber-200">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black oswald uppercase text-[#112233] border-b pb-4">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-gray-500 text-sm italic border-l-4 border-[#24a0ed] pl-4">
                  {stripHtml(post.excerpt)}
                </p>
              )}

              {post.content ? (
                <div
                  className="wordpress-content space-y-4 text-gray-600 text-xs md:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {stripHtml(post.excerpt) || 'This article is being updated. Please check back soon.'}
                </p>
              )}
            </Reveal>

            {/* FAQs */}
            {mergedFaqs.length > 0 && (
              <FAQAccordion faqs={mergedFaqs} />
            )}

          </div>

        </div>
      </section>

      {/* 3. RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 mt-20">
          <Reveal className="text-2xl font-black oswald uppercase text-[#112233] mb-6">
            Related Posts
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group"
              >
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <div className="text-xs text-amber-600 font-semibold mb-2">{item.date}</div>
                    <h3 className="font-bold text-xs md:text-sm text-[#112233] line-clamp-2 group-hover:text-[#24a0ed] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#24a0ed] uppercase tracking-wider transition-colors">
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </Stagger>
        </section>
      )}

    </div>
  );
}
