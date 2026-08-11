import React from 'react';
import Link from 'next/link';
import SubpageHero from './SubpageHero';
import RichText from '../RichText';

interface Item {
  id: string;
  slug: string | null;
  title: string;
  heroImage: string;
  duration: string;
  price?: number | null;
  discountedPrice?: number | null;
}

interface Props {
  title: string;
  subtitle?: string | null;
  heroImage?: string | null;
  categoryImage?: string | null;
  descriptionHtml?: string | null;
  items: Item[];
  basePath: string; // '/trekking' | '/tours'
}

export default function CategoryLanding({
  title,
  subtitle,
  heroImage,
  categoryImage,
  descriptionHtml,
  items,
  basePath,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      <SubpageHero
        title={title}
        subtitle={subtitle ?? `Explore our ${title} packages.`}
        image={heroImage ?? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"}
      />

      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-5">
          {descriptionHtml && (
            <div className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
                {categoryImage && (
                  <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                    <img src={categoryImage} alt={title} className="w-full h-64 object-cover" />
                  </div>
                )}
                <div className="rich-content text-[15px] leading-relaxed text-gray-600">
                  <RichText html={descriptionHtml} />
                </div>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No packages found in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`${basePath}/${item.slug || item.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-lg transition-all hover:scale-105"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.heroImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.price && (
                        <div className="absolute top-0 left-0 bg-[#d93838] text-white font-bold text-xs px-3 py-1.5 rounded-br-lg shadow-sm oswald">
                          ${(item.discountedPrice ?? item.price).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#222222] text-sm md:text-base line-clamp-2 mb-3 group-hover:text-[#24a0ed] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Duration : {item.duration}</span>
                    <span className="text-[#24a0ed] hover:underline font-bold">Explore →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}