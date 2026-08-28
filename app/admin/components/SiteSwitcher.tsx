'use client';

import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

export default function SiteSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Everpeak Adventures');

  const sites = [
    'Everpeak Adventures',
    'Future Trek Co. (Demo)',
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="max-w-[120px] sm:max-w-[150px] truncate">{selected}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-100 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Superadmin Switcher</p>
            </div>
            <div className="p-1">
              {sites.map(site => (
                <button
                  key={site}
                  onClick={() => {
                    setSelected(site);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selected === site 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {site}
                </button>
              ))}
            </div>
            <div className="p-1 border-t border-gray-100">
              <a href="/admin/sites" className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                Manage Sites & Databases...
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
