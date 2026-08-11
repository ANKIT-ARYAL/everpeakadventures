'use client';

export default function StickySectionNav({ sections }: { sections: string[] }) {
  const slugify = (s: string) => s.toLowerCase().replace(/[&]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return (
    <div className="sticky top-0 z-30 bg-[#f0f2f5] py-2 -mx-1">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {sections.map((s) => (
          <a
            key={s}
            href={`#sec-${slugify(s)}`}
            className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#24a0ed] hover:text-[#24a0ed]"
          >
            {s}
          </a>
        ))}
      </div>
    </div>
  );
}
