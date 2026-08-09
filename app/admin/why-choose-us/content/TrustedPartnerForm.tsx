'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import ToggleShow from '../../components/ToggleShow';
import TipTapEditor from '@/app/components/admin/TipTapEditor';

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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />
      
      {/* Top Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/why-choose-us" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">Section Content</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleShow model="trusted-partner" resource="why-choose-us" id="__single__" published={form.published ?? true} />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Content */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Main Content</h2>
            
            <div>
              <label className="block font-bold mb-1">Main Title *</label>
              <input type="text" name="mainTitle" required value={form.mainTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Your Trusted Partner For Himalayan Adventures" />
            </div>

            <div>
              <label className="block font-bold mb-1">Description *</label>
              <TipTapEditor value={form.description} onChange={(html) => setForm(prev => ({ ...prev, description: html }))} placeholder="Short section description..." minHeight="120px" />
            </div>
          </div>

          {/* Badge */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Badge</h2>
            
            <div>
              <label className="block font-bold mb-1">Badge Title</label>
              <input type="text" name="badgeTitle" value={form.badgeTitle} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="Traveler's Choice" />
            </div>

            <div>
              <label className="block font-bold mb-1">Badge Subtitle</label>
              <TipTapEditor value={form.badgeSubtitle} onChange={(html) => setForm(prev => ({ ...prev, badgeSubtitle: html }))} placeholder="Badge description..." />
            </div>

            <div>
              <label className="block font-bold mb-1">Review Count Text</label>
              <input type="text" name="reviewCountText" value={form.reviewCountText} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="Reviews 5/5" />
            </div>
          </div>

          {/* Traveler Story */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Traveler Story</h2>
            
            <div>
              <label className="block font-bold mb-1">Story Title</label>
              <input type="text" name="storyTitle" value={form.storyTitle} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="Traveler Story" />
            </div>

            <div>
              <label className="block font-bold mb-1">Story Description</label>
              <TipTapEditor value={form.storyDescription} onChange={(html) => setForm(prev => ({ ...prev, storyDescription: html }))} placeholder="Story text..." minHeight="120px" />
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Story Image</h3>
            <input type="url" name="storyImage" value={form.storyImage} onChange={handleChange} placeholder="https://..." className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
            {form.storyImage && (
              <div className="h-36 rounded-lg overflow-hidden border">
                <img src={form.storyImage} alt="Story Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Background Hero Image</h3>
            <input type="url" name="bgHeroImage" value={form.bgHeroImage} onChange={handleChange} placeholder="https://..." className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
            {form.bgHeroImage && (
              <div className="h-36 rounded-lg overflow-hidden border">
                <img src={form.bgHeroImage} alt="Background Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

        </div>

      </div>
    </form>
  );
}
