"use client";

import React, { useState } from "react";
import { Backpack, Shirt, Bath, BriefcaseMedical, Compass, ChevronDown, Check } from "lucide-react";

interface PackingItem {
  id: string;
  category: string;
  name: string;
  order: number;
}

interface PackingListSectionProps {
  items: PackingItem[];
  categories?: { name: string; description: string | null }[];
}

const CATEGORY_CONFIG: Record<string, { icon: React.FC<any>; bg: string; color: string; subtitle?: string; desc?: string }> = {
  "MAIN TREKKING GEAR": { 
    icon: Backpack, 
    bg: "bg-[#eef8f8]", 
    color: "text-[#367c82]",
    subtitle: "The Core Essentials",
    desc: "These are the fundamental items you need to carry your gear, sleep comfortably, and navigate the trails safely."
  },
  "CLOTHING, HEADWEAR & FOOTWEAR": { 
    icon: Shirt, 
    bg: "bg-[#eef8f8]", 
    color: "text-[#367c82]",
    subtitle: "Essentials for Comfort & Protection",
    desc: "Layer smartly and be prepared for changing weather, cold mornings, strong winds, and high-altitude conditions."
  },
  "TOILETRIES, HYGIENE & PERSONAL CARE": { 
    icon: Bath, 
    bg: "bg-[#f4eeff]", 
    color: "text-[#6b47c9]",
    subtitle: "Stay Clean & Healthy",
    desc: "Maintain your personal hygiene and protect yourself from the sun, dry air, and minor skin irritations during the trek."
  },
  "HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS": { 
    icon: BriefcaseMedical, 
    bg: "bg-[#fff2eb]", 
    color: "text-[#c26231]",
    subtitle: "Safety & Connectivity",
    desc: "Crucial medical supplies for emergencies, plus power banks, adapters, and headlamps to keep your devices charged and trails lit."
  },
  "OPTIONAL & RECOMMENDED ITEMS": { 
    icon: Compass, 
    bg: "bg-[#edf6ff]", 
    color: "text-[#3273c5]",
    subtitle: "Nice to Have",
    desc: "Extra items that can make your journey more enjoyable and comfortable, though not strictly required for survival."
  }
};

const CATEGORY_ORDER = [
  "MAIN TREKKING GEAR",
  "CLOTHING, HEADWEAR & FOOTWEAR",
  "TOILETRIES, HYGIENE & PERSONAL CARE",
  "HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS",
  "OPTIONAL & RECOMMENDED ITEMS"
];

export default function PackingListSection({ items, categories = [] }: PackingListSectionProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "MAIN TREKKING GEAR": true
  });

  if (!items || items.length === 0) return null;

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const activeCategories = CATEGORY_ORDER.filter(cat => items.some(i => i.category === cat));

  if (activeCategories.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#eaedf2] p-6 lg:p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#112233] mb-2 tracking-tight">Packing List</h2>
        <p className="text-gray-500 text-sm">Everything you need, organized for a safe and comfortable trek.</p>
      </div>

      <div className="space-y-4">
        {activeCategories.map((cat, idx) => {
          const catItems = items.filter(i => i.category === cat).sort((a, b) => a.order - b.order);
          const config = CATEGORY_CONFIG[cat] || { icon: Backpack, bg: "bg-gray-100", color: "text-gray-600" };
          const dynamicCategory = categories.find(c => c.name === cat);
          const dynamicDesc = dynamicCategory?.description;
          const Icon = config.icon;
          const isOpen = openCategories[cat];

          return (
            <div key={cat} className="border-b border-[#eaedf2] pb-4 last:border-0 last:pb-0">
              <button 
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between py-2 group focus:outline-none"
              >
                <div className="flex items-center justify-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} ${config.color} transition-transform group-hover:scale-105`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#112233] tracking-wide">{cat}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${isOpen ? 'bg-[#1e857c] text-white' : 'bg-[#eef8f8] text-[#367c82]'}`}>
                    {idx + 1}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="bg-[#f8f9fc] rounded-xl border border-[#eaedf2] p-6 lg:p-8 flex flex-col md:flex-row gap-8">
                    {config.subtitle && (
                      <div className="md:w-1/3 shrink-0">
                        <div className="inline-block bg-[#eaf5f5] text-[#1e857c] text-xs font-bold px-3 py-1.5 rounded mb-4">
                          {config.subtitle}
                        </div>
                        {dynamicDesc ? (
                          <div 
                            className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none prose-p:my-1"
                            dangerouslySetInnerHTML={{ __html: dynamicDesc }} 
                          />
                        ) : config.desc ? (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {config.desc}
                          </p>
                        ) : null}
                      </div>
                    )}
                    
                    <div className={`grid gap-x-8 gap-y-4 flex-1 ${config.subtitle ? 'md:w-2/3 sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'}`}>
                      {catItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="bg-[#1e857c] rounded-full p-1 mt-0.5 shrink-0">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-[14px] text-gray-700 font-medium leading-tight pt-0.5">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
