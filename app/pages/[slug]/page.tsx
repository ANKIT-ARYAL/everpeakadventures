import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SubpageHero from "@/app/components/pages/SubpageHero";
import RichText from "@/app/components/RichText";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ContentPageView({ params }: PageProps) {
  const { slug } = await params;

  const page = await prisma.contentPage.findFirst({
    where: { slug, published: true },
  });

  if (!page) notFound();

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      <SubpageHero
        title={page.title}
        subtitle={page.subtitle ?? "Page"}
        image={page.heroImage ?? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"}
      />

      <section className="py-14">
        <div className="max-w-[900px] mx-auto px-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 rich-content text-[16px] leading-relaxed text-gray-700">
            {page.content ? (
              <RichText html={page.content} />
            ) : (
              <p className="text-gray-400 italic">This page has no content yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}