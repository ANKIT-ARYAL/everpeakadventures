"use client";

import React, { useState, useEffect } from "react";

const PACKING_CATEGORIES = [
  "MAIN TREKKING GEAR",
  "CLOTHING, HEADWEAR & FOOTWEAR",
  "TOILETRIES, HYGIENE & PERSONAL CARE",
  "HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS",
  "OPTIONAL & RECOMMENDED ITEMS"
];

interface PackingItemSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function PackingItemSelector({ selectedIds, onChange }: PackingItemSelectorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/packing-list")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Failed to load packing items", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading packing items...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-500 text-sm mb-3">No packing items found in the master list.</p>
        <a 
          href="/admin/packing-list" 
          className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage Master Packing List
        </a>
      </div>
    );
  }

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectCategory = (cat: string) => {
    const catItems = items.filter(i => i.category === cat).map(i => i.id);
    const newSelected = [...new Set([...selectedIds, ...catItems])];
    onChange(newSelected);
  };

  const clearCategory = (cat: string) => {
    const catItems = items.filter(i => i.category === cat).map(i => i.id);
    const newSelected = selectedIds.filter(id => !catItems.includes(id));
    onChange(newSelected);
  };

  return (
    <div className="space-y-4">
      {PACKING_CATEGORIES.map(cat => {
        const catItems = items.filter(i => i.category === cat).sort((a, b) => a.order - b.order);
        if (catItems.length === 0) return null;
        
        const allSelected = catItems.every(i => selectedIds.includes(i.id));
        const someSelected = catItems.some(i => selectedIds.includes(i.id)) && !allSelected;

        return (
          <div key={cat} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h4 className="font-bold text-gray-800 text-sm">{cat}</h4>
              <div className="flex gap-3 text-[11px] font-bold">
                <button 
                  type="button" 
                  onClick={() => selectCategory(cat)} 
                  className="text-blue-600 hover:underline"
                >
                  Select All
                </button>
                <button 
                  type="button" 
                  onClick={() => clearCategory(cat)} 
                  className="text-gray-500 hover:underline"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {catItems.map(item => (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                  <div className="pt-0.5">
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                    />
                  </div>
                  <span className={`text-sm select-none transition-colors ${selectedIds.includes(item.id) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
