import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  FolderOpen,
  Clock,
} from 'lucide-react';

import FAQAccordion from '@/app/components/FAQAccordion';
import { stripHtml } from '@/lib/stripHtml';

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  /* -------------------------------------------------------------------------- */
  /*                                BLOG POST                                   */
  /* -------------------------------------------------------------------------- */

  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      published: true,
    },
  });

  if (!post) {
    notFound();
  }

  /* -------------------------------------------------------------------------- */
  /*                              RELATED POSTS                                 */
  /* -------------------------------------------------------------------------- */

  const relatedPosts =
    await prisma.blogPost.findMany({
      where: {
        id: {
          not: post.id,
        },
        published: true,
      },
      take: 3,
      orderBy: {
        order: 'asc',
      },
    });

  /* -------------------------------------------------------------------------- */
  /*                               READ TIME                                    */
  /* -------------------------------------------------------------------------- */

  const wordCount = (
    post.content || ''
  )
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const readTime =
    `${Math.max(
      1,
      Math.ceil(wordCount / 200)
    )} min read`;

  /* -------------------------------------------------------------------------- */
  /*                                  FAQS                                      */
  /* -------------------------------------------------------------------------- */

  const faqs = Array.isArray(post.faqs)
    ? (post.faqs as any[])
    : [];

  const linkedFaqs =
    await prisma.fAQ.findMany({
      where: {
        relatedType: 'blog',
        relatedSlug: post.slug,
        published: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

  const mergedFaqs = [
    ...linkedFaqs,
    ...faqs,
  ];

  /* -------------------------------------------------------------------------- */
  /*                                   PAGE                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="bg-[#f7f9f7] font-sans">

      {/* ================================ HERO ================================ */}

      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-[#112233] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 text-center mt-12 px-5 lg:px-20">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider oswald shadow-sm">
            {post.title}
          </h1>
        </div>
      </section>

      {/* ============================== MAIN AREA ============================= */}

      <div className="py-8 md:py-12 px-5 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ============================= SIDEBAR ============================= */}

          <div className="lg:col-span-1 lg:order-2 space-y-6 relative">
            <div className="sticky top-24 space-y-6">

              {/* ARTICLE INFO */}

              <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="text-xl font-bold oswald uppercase tracking-wide text-[#112233] border-b border-gray-100 pb-4 mb-5">
                  Article Info
                </div>

                <div className="space-y-4">

                  {/* CATEGORY */}

                  <div className="flex items-center gap-4">
                    <div className="bg-[#24a0ed]/10 w-12 h-12 rounded-xl flex items-center justify-center text-[#24a0ed] shrink-0">
                      <FolderOpen className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Category
                      </div>

                      <div className="font-bold text-[#112233]">
                        {post.category}
                      </div>
                    </div>
                  </div>

                  {/* PUBLISH DATE */}

                  <div className="flex items-center gap-4">
                    <div className="bg-[#24a0ed]/10 w-12 h-12 rounded-xl flex items-center justify-center text-[#24a0ed] shrink-0">
                      <Calendar className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Published On
                      </div>

                      <div className="font-bold text-[#112233]">
                        {post.date}
                      </div>
                    </div>
                  </div>

                  {/* READ TIME */}

                  <div className="flex items-center gap-4">
                    <div className="bg-[#24a0ed]/10 w-12 h-12 rounded-xl flex items-center justify-center text-[#24a0ed] shrink-0">
                      <Clock className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Estimated Read
                      </div>

                      <div className="font-bold text-[#112233]">
                        {readTime}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* RELATED POSTS */}

              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <div className="text-xl font-bold oswald uppercase tracking-wide text-[#112233] border-b border-gray-100 pb-4 mb-5">
                    Related Articles
                  </div>

                  <div className="space-y-4">
                    {relatedPosts.map(
                      (related) => (
                        <Link
                          href={`/blog/${related.slug}`}
                          key={related.id}
                          className="group flex gap-3 items-center"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            <img
                              src={related.image}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div>
                            <div className="text-[10px] text-amber-600 font-bold uppercase mb-1">
                              {related.date}
                            </div>

                            <h4 className="text-sm font-bold text-[#112233] line-clamp-2 group-hover:text-[#24a0ed] transition-colors">
                              {related.title}
                            </h4>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}

              <div className="bg-gradient-to-br from-[#112233] to-[#1a365d] rounded-[24px] p-8 shadow-lg text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />

                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#24a0ed]/20 rounded-full blur-2xl -ml-10 -mb-10" />

                <h3 className="text-2xl font-black oswald uppercase tracking-wide mb-3 relative z-10">
                  Ready for an Adventure?
                </h3>

                <p className="text-white/80 text-sm mb-6 relative z-10">
                  Explore our carefully curated
                  trekking and tour packages.
                </p>

                <Link
                  href="/trekking"
                  className="w-full inline-block bg-[#24a0ed] hover:bg-[#1a85c7] text-white font-bold py-4 rounded-xl text-center transition-all uppercase tracking-wider text-sm shadow-md relative z-10"
                >
                  View All Treks
                </Link>
              </div>

            </div>
          </div>

          {/* =========================== MAIN CONTENT ========================== */}

          <div className="lg:col-span-2 lg:order-1 space-y-8">

            {/* BLOG ARTICLE */}

            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

              {/* TITLE */}

              <div className="mb-8 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#24a0ed]/10 text-[#24a0ed] px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black oswald uppercase text-[#112233] leading-[1.1]">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-gray-500 text-lg md:text-xl italic mt-6 border-l-4 border-[#24a0ed] pl-5 leading-relaxed text-justify">
                    {stripHtml(post.excerpt)}
                  </p>
                )}
              </div>

              {/* BLOG BODY */}

              <div className="blog-content prose max-w-none text-[17px] text-gray-600 prose-headings:font-black prose-headings:oswald prose-headings:uppercase prose-headings:text-[#112233] prose-p:my-6 prose-p:leading-8 prose-p:text-[1.04rem] prose-li:my-2 prose-a:text-[#24a0ed] hover:prose-a:text-[#1a85c7] text-justify">
                {post.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.content,
                    }}
                  />
                ) : (
                  <p>
                    This article is being updated.
                    Please check back soon.
                  </p>
                )}
              </div>

            </div>

            {/* FAQS */}

            {mergedFaqs.length > 0 && (
              <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <h2 className="text-2xl font-black oswald uppercase text-[#112233] border-b border-gray-100 pb-4 mb-6">
                  Frequently Asked Questions
                </h2>

                <FAQAccordion
                  faqs={mergedFaqs}
                />
              </div>
            )}

          </div>
        </div>
      </div>


    </div>
  );
}