'use client';

import React, { useEffect, useState } from 'react';

const LINKS = [
  { id: 'key-points', label: 'Key Points' },
  { id: 'trip-overview', label: 'Trip Overview' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'include', label: 'Package Include' },
  { id: 'exclude', label: 'Package Exclude' },
  { id: 'equipment', label: 'Equipment & Gears' },
];

const NAV_HEIGHT = 118; // offsets the sticky header + nav so scroll doesn't hide content

export default function StickySectionNav() {
  const [active, setActive] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      // Show nav once we've scrolled past the hero banner, hide when near the very top
      setVisible(y > NAV_HEIGHT);
      lastY = y;

      // Find the section currently in view (its top is near the top of the viewport)
      let current = '';
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= 160) current = s.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className={`fixed top-20 left-0 right-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              aria-current={active === l.id ? 'true' : undefined}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                active === l.id
                  ? 'bg-[#24a0ed] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}