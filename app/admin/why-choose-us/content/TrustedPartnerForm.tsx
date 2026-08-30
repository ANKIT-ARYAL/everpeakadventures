/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import ToggleShow from '../../components/ToggleShow';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import MediaUploader from '@/app/components/admin/MediaUploader';
import SectionCard from '@/app/components/admin/SectionCard';

interface Props {
  initialData?: any;
}

export default function TrustedPartnerForm({ initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    published: initialData?.published ?? true,
    mainTitle: initialData?.mainTitle || '',
    description: initialData?.description || '',
    badgeTitle: initialData?.badgeTitle || '',
    badgeSubtitle: initialData?.badgeSubtitle || '',
    reviewCountText: initialData?.reviewCountText || '',
    storyTitle: initialData?.storyTitle || '',
    storyDescription: initialData?.storyDescription || '',
    storyImage: initialData?.storyImage || '',
    bgHeroImage: initialData?.bgHeroImage || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/trusted-partner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to save section content');

      toast.success('Section content saved successfully!');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 pb-20 text-md font-sans text-gray-800 min-w-0">
      <Toaster position="top-center" />
      
      {/* Top Header Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Link href="/admin/why-choose-us" className="self-start sm:self-auto p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-black text-[#112233] oswald uppercase tracking-wider">
            Section Content
          </h1>
        </div>

        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          <ToggleShow model="trusted-partner" resource="why-choose-us" id="__single__" published={form.published ?? true} />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          
          {/* Main Content */}
          <SectionCard title="Main Content" defaultOpen>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Main Title *</label>
              <input type="text" name="mainTitle" required value={form.mainTitle} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none focus:border-[#24a0ed]" placeholder="Your Trusted Partner For Himalayan Adventures" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Description *</label>
              <TipTapEditor value={form.description} onChange={(html) => setForm(prev => ({ ...prev, description: html }))} placeholder="Short section description..." minHeight="120px" />
            </div>
          </SectionCard>

          {/* Badge */}
          <SectionCard title="Badge">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Badge Title</label>
              <input type="text" name="badgeTitle" value={form.badgeTitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" placeholder="Traveler's Choice" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Badge Subtitle</label>
              <TipTapEditor value={form.badgeSubtitle} onChange={(html) => setForm(prev => ({ ...prev, badgeSubtitle: html }))} placeholder="Badge description..." />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Review Count Text</label>
              <input type="text" name="reviewCountText" value={form.reviewCountText} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" placeholder="Reviews 5/5" />
            </div>
          </SectionCard>

          {/* Traveler Story */}
          <SectionCard title="Traveler Story">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Story Title</label>
              <input type="text" name="storyTitle" value={form.storyTitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" placeholder="Traveler Story" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Story Description</label>
              <TipTapEditor value={form.storyDescription} onChange={(html) => setForm(prev => ({ ...prev, storyDescription: html }))} placeholder="Story text..." minHeight="120px" />
            </div>
          </SectionCard>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start min-w-0">
          
          <SectionCard title="Story Image">
            <MediaUploader value={form.storyImage} onChange={(url) => setForm(prev => ({ ...prev, storyImage: url }))} label="Upload Story Image" heightClass="h-36" />
          </SectionCard>

          <SectionCard title="Background Hero Image">
            <MediaUploader value={form.bgHeroImage} onChange={(url) => setForm(prev => ({ ...prev, bgHeroImage: url }))} label="Upload Background Hero Image" heightClass="h-36" />
          </SectionCard>

        </div>

      </div>
    </form>
  );
}