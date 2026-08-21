'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import ToggleShow from '../components/ToggleShow';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import SectionCard from '@/app/components/admin/SectionCard';

interface Props {
  initialData?: any;
}

export default function HomeSectionContentForm({ initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    published: initialData?.published ?? true,
    featuredTreksLabel: initialData?.featuredTreksLabel || 'Top Rated Routes',
    featuredTreksTitle: initialData?.featuredTreksTitle || 'Featured Trekking Packages',
    bestSellersWatermark: initialData?.bestSellersWatermark || 'Trekking',
    bestSellersTitle: initialData?.bestSellersTitle || 'Best Seller Trekking',
    bestSellersSubtitle: initialData?.bestSellersSubtitle || '"Top-rated trekking journeys offering breathtaking views and authentic experiences."',
    fixedDeparturesLabel: initialData?.fixedDeparturesLabel || 'Departure Dates',
    fixedDeparturesTitle: initialData?.fixedDeparturesTitle || 'Join Fixed Departure Trips',
    popularToursWatermark: initialData?.popularToursWatermark || 'TOURS',
    popularToursTitle: initialData?.popularToursTitle || 'Popular Tours',
    popularToursSubtitle: initialData?.popularToursSubtitle || '"Premium tour packages tailored for comfort, culture, and adventure."',
    exploreBlogsWatermark: initialData?.exploreBlogsWatermark || 'EXPLORE OUR BLOGS',
    exploreBlogsTitle: initialData?.exploreBlogsTitle || 'Explore Our Blogs',
    exploreBlogsSubtitle: initialData?.exploreBlogsSubtitle || 'At Ever Peak Adventure, we believe that travel is not just about reaching a destination—it’s about creating stories.',
    whyChooseUsBadge: initialData?.whyChooseUsBadge || 'Why Choose Us',
    whyChooseUsTitle: initialData?.whyChooseUsTitle || 'Why Choose ',
    whyChooseUsTitleHighlight: initialData?.whyChooseUsTitleHighlight || 'Ever Peak Adventures',
    whyChooseUsSubtitle: initialData?.whyChooseUsSubtitle || 'We combine years of Himalayan expertise, personalized service, and a passion for adventure to deliver safe, authentic, and unforgettable trekking experiences throughout Nepal.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/home-section-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save home sections');

      toast.success('Home sections saved successfully!');
      router.push('/admin/home-section-content');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl xl:max-w-none mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />

      {/* Top Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">Home Sections</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleShow model="home-section-content" resource="home-section-content" id="__single__" published={form.published ?? true} />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <SectionCard title="Featured Treks" defaultOpen>
        <div>
          <label className="block font-bold mb-1">Label</label>
          <input type="text" name="featuredTreksLabel" value={form.featuredTreksLabel} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Top Rated Routes" />
        </div>

        <div>
          <label className="block font-bold mb-1">Title</label>
          <input type="text" name="featuredTreksTitle" value={form.featuredTreksTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Featured Trekking Packages" />
        </div>
      </SectionCard>

      <SectionCard title="Best Sellers">
        <div>
          <label className="block font-bold mb-1">Watermark</label>
          <input type="text" name="bestSellersWatermark" value={form.bestSellersWatermark} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Trekking" />
        </div>

        <div>
          <label className="block font-bold mb-1">Title</label>
          <input type="text" name="bestSellersTitle" value={form.bestSellersTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Best Seller Trekking" />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <TipTapEditor value={form.bestSellersSubtitle} onChange={(html) => setForm(prev => ({ ...prev, bestSellersSubtitle: html }))} placeholder="Short description..." />
        </div>
      </SectionCard>

      <SectionCard title="Fixed Departures">
        <div>
          <label className="block font-bold mb-1">Label</label>
          <input type="text" name="fixedDeparturesLabel" value={form.fixedDeparturesLabel} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Departure Dates" />
        </div>

        <div>
          <label className="block font-bold mb-1">Title</label>
          <input type="text" name="fixedDeparturesTitle" value={form.fixedDeparturesTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Join Fixed Departure Trips" />
        </div>
      </SectionCard>

      <SectionCard title="Popular Tours">
        <div>
          <label className="block font-bold mb-1">Watermark</label>
          <input type="text" name="popularToursWatermark" value={form.popularToursWatermark} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. TOURS" />
        </div>

        <div>
          <label className="block font-bold mb-1">Title</label>
          <input type="text" name="popularToursTitle" value={form.popularToursTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Popular Tours" />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <TipTapEditor value={form.popularToursSubtitle} onChange={(value) => setForm(prev => ({ ...prev, popularToursSubtitle: value }))} placeholder="Short description..." />
        </div>
      </SectionCard>

      <SectionCard title="Explore Blogs">
        <div>
          <label className="block font-bold mb-1">Watermark</label>
          <input type="text" name="exploreBlogsWatermark" value={form.exploreBlogsWatermark} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. EXPLORE OUR BLOGS" />
        </div>

        <div>
          <label className="block font-bold mb-1">Title</label>
          <input type="text" name="exploreBlogsTitle" value={form.exploreBlogsTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Explore Our Blogs" />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <TipTapEditor value={form.exploreBlogsSubtitle} onChange={(value) => setForm(prev => ({ ...prev, exploreBlogsSubtitle: value }))} placeholder="Short description..." />
        </div>
      </SectionCard>

      <SectionCard title="Why Choose Us">
        <div>
          <label className="block font-bold mb-1">Badge</label>
          <input type="text" name="whyChooseUsBadge" value={form.whyChooseUsBadge} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Why Choose Us" />
        </div>

        <div>
          <label className="block font-bold mb-1">Title</label>
          <input type="text" name="whyChooseUsTitle" value={form.whyChooseUsTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Why Choose " />
        </div>

        <div>
          <label className="block font-bold mb-1">Title Highlight</label>
          <input type="text" name="whyChooseUsTitleHighlight" value={form.whyChooseUsTitleHighlight} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Ever Peak Adventures" />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <TipTapEditor value={form.whyChooseUsSubtitle} onChange={(value) => setForm(prev => ({ ...prev, whyChooseUsSubtitle: value }))} placeholder="Short description..." />
        </div>
      </SectionCard>
    </form>
  );
}
