'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  Eye, 
  Map, 
  ListChecks, 
  CalendarDays, 
  MapPin, 
  Info, 
  Backpack, 
  MessageSquare,
  Star
} from 'lucide-react';

const LINKS = [
  { id: 'key-points', label: 'Trip Info', icon: Info },
  { id: 'trip-overview', label: 'Overview', icon: Eye },
  { id: 'highlights', label: 'Highlights', icon: Star },
  { id: 'itinerary', label: 'Itinerary', icon: Map },
  { id: 'include', label: 'Includes & Excludes', icon: ListChecks },
  { id: 'altitude-chart', label: 'Route Map', icon: MapPin },
  { id: 'equipment', label: 'Equipment & Gears', icon: Backpack },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'faqs', label: 'FAQs', icon: MessageSquare },
  { id: 'departures', label: 'Departures & Price', icon: CalendarDays },
];

const NAV_OFFSET = 150; // fixed header + sticky section nav + a little breathing room

interface StickySectionNavProps {
  sectionIds?: string[];
}

export default function StickySectionNav({ sectionIds }: StickySectionNavProps) {
  const [active, setActive] = useState('');
  const [visible, setVisible] = useState(false);
  const availableLinks = useMemo(
    () => LINKS.filter((link) => !sectionIds || sectionIds.includes(link.id)),
    [sectionIds]
  );

  useEffect(() => {
    const sections = availableLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      const y = window.scrollY;
      // Show nav once we've scrolled past the hero banner, hide when near the very top
      setVisible(y > 118);

      // Find the section currently in view (its top is near the top of the viewport)
      let current = '';
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= NAV_OFFSET + 12) current = s.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [availableLinks]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (availableLinks.length === 0) return null;

  return (
    <nav
      aria-label="Section navigation"
      className={`fixed top-20 left-0 right-0 z-30 bg-white/95 backdrop-blur border-y border-gray-100 shadow-sm transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0 pointer-events-none'
      }`}
    >
      <div className="overflow-x-auto no-scrollbar px-5 lg:px-20">
        <div className="flex items-center min-w-max h-[60px]">
          {availableLinks.map((l) => {
            const Icon = l.icon;
            const isActive = active === l.id;
            return (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`group relative flex items-center gap-2 h-full px-5 transition-colors focus:outline-none ${
                  isActive
                    ? 'text-[#1e857c]'
                    : 'text-[#112233] hover:text-[#1e857c]'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-[#1e857c]' : 'text-gray-400 group-hover:text-[#1e857c]'}`} />
                <span className="text-[14px] font-semibold whitespace-nowrap">
                  {l.label}
                </span>
                
                {/* Active Underline Indicator */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-[3px] bg-[#1e857c] transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  }`} 
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
