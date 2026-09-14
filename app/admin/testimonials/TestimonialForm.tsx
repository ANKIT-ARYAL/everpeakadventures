/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import MediaUploader from '@/app/components/admin/MediaUploader';
import ToggleShow from '../components/ToggleShow';
import NumberInput from '@/app/components/NumberInput';
import SectionCard from '@/app/components/admin/SectionCard';

interface Props {
  initialData?: any;
  sectionData?: any;
  isEditing?: boolean;
}

export default function TestimonialForm({ initialData, sectionData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    published: initialData?.published ?? true,
    quote: initialData?.quote || '',
    name: initialData?.name || '',
    location: initialData?.location || '',
    avatar: initialData?.avatar || '',
    order: initialData?.order || 0,
  });

  const [section, setSection] = useState({
    title: sectionData?.title || 'WHAT OUR CLIENT SAY ABOUT US ?',
    subtitle: sectionData?.subtitle || 'Real experiences shared by travelers who trusted us.',
    watermark: sectionData?.watermark || 'CLIENTS REVIEWS',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSection(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewPayload = {
        published: form.published,
        quote: form.quote,
        name: form.name,
        location: form.location,
        avatar: form.avatar,
        order: Number(form.order) || 0,
      };

      const reviewUrl = isEditing ? `/api/testimonials/${initialData?.id}` : '/api/testimonials';
      const reviewRes = await fetch(reviewUrl, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload),
      });
      if (!reviewRes.ok) throw new Error('Failed to save testimonial');

      const sectionRes = await fetch('/api/testimonials/section', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: section.title,
          subtitle: section.subtitle,
          watermark: section.watermark,
        }),
      });
      if (!sectionRes.ok) throw new Error('Failed to save section headings');

      toast.success('Testimonial saved successfully!');
      router.push('/admin/testimonials');
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
          <Link href="/admin/testimonials" className="self-start sm:self-auto p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-black text-[#112233] oswald uppercase tracking-wider">
            {isEditing ? `Edit Testimonial: ${initialData?.name}` : 'Add New Testimonial'}
          </h1>
        </div>

        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          {isEditing && <ToggleShow model="testimonials" resource="testimonials" id={initialData?.id as string} published={form.published ?? true} />}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Testimonial' : 'Publish Testimonial')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          
          {/* Section Headings */}
          <SectionCard title="Section Headings" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Main Heading</label>
                <input type="text" name="title" value={section.title} onChange={handleSectionChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none focus:border-[#24a0ed]" placeholder="WHAT OUR CLIENT SAY ABOUT US ?" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtitle</label>
                <input type="text" name="subtitle" value={section.subtitle} onChange={handleSectionChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" placeholder="Real experiences shared by travelers who trusted us." />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Background Watermark Text</label>
                <input type="text" name="watermark" value={section.watermark} onChange={handleSectionChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" placeholder="CLIENTS REVIEWS" />
              </div>
            </div>
          </SectionCard>

          {/* Review Details */}
          <SectionCard title="Review Details" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Quote *</label>
                <TipTapEditor value={form.quote} onChange={(html) => setForm(prev => ({ ...prev, quote: html }))} placeholder="What did the client say?" minHeight="160px" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Client Name *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" placeholder="e.g. Sarah Jenkins" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" placeholder="e.g. United Kingdom" />
              </div>
            </div>
          </SectionCard>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start min-w-0 admin-right-scrollable">
          
          <SectionCard title="Client Avatar">
            <MediaUploader value={form.avatar} onChange={(url) => setForm(prev => ({ ...prev, avatar: url }))} label="Upload Avatar" heightClass="h-36" />
          </SectionCard>

          <SectionCard title="Review Attributes">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Display Order</label>
              <NumberInput type="number" name="order" value={form.order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none" />
            </div>
          </SectionCard>

        </div>

      </div>
    </form>
  );
}