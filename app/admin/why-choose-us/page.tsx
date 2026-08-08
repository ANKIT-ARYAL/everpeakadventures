import Link from 'next/link';
import { LayoutDashboard, Award, Layers, ArrowRight } from 'lucide-react';
import ViewButton from "../components/ViewButton";

export const dynamic = 'force-dynamic';

export default async function AdminWhyChooseUsPage() {
  const cards = [
    {
      title: 'Section Content',
      desc: 'Edit the main title, description, badges, and traveler story.',
      href: '/admin/why-choose-us/content',
      icon: LayoutDashboard,
    },
    {
      title: 'Why Choose Us Items',
      desc: 'Manage the icon list items displayed in the section.',
      href: '/admin/why-choose-us/items',
      icon: Award,
    },
    {
      title: 'Features Grid',
      desc: 'Manage the features grid cards below the section.',
      href: '/admin/why-choose-us/features',
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Why Choose Us</h1>
          <p className="text-gray-500 mt-1">Manage the Why Choose Us section content, items, and features grid.</p>
        </div>
        <ViewButton href="/why-ever-peak-adventures" title="View section on site" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="p-5 rounded-xl border border-gray-100 bg-[#fcfcfc] hover:bg-white hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-lg font-bold text-[#112233] block mb-1">{card.title}</span>
                  <p className="text-gray-500 font-medium">{card.desc}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform text-[#24a0ed]">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-medium group-hover:text-[#2271b1] transition-colors flex items-center gap-1">
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
