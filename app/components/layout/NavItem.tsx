'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SubItem {
  label: string;
  href: string;
}

interface NavItemProps {
  item: {
    label: string;
    href: string;
    children?: SubItem[];
  };
}

export default function NavItem({ item }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group py-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link 
        href={item.href} 
        className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#24a0ed] transition-colors flex items-center gap-1"
      >
        {item.label}
        {item.children && <ChevronDown className="w-3.5 h-3.5" />}
      </Link>

      {item.children && isOpen && (
        <div className="absolute top-full left-0 w-64 bg-[#172a3a] border border-white/10 rounded-xl shadow-2xl py-2 mt-1 flex flex-col z-50">
          {item.children.map((child, idx) => (
            <Link
              key={idx}
              href={child.href}
              className="px-4 py-2.5 text-[11px] font-medium text-gray-200 hover:bg-[#f59e0b] hover:text-[#112233] transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}