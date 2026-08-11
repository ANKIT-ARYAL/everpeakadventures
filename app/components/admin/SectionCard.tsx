'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function SectionCard({ title, subtitle, defaultOpen = false, action, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 min-w-0 text-left"
          aria-expanded={open}
        >
          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
          <span className="min-w-0">
            <span className="block font-bold text-[#112233] uppercase tracking-wide text-sm truncate">{title}</span>
            {subtitle && <span className="block text-[11px] text-gray-400 truncate">{subtitle}</span>}
          </span>
        </button>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
      {open && <div className="px-4 sm:px-5 pb-5 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}
