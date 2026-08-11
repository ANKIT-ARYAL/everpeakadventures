
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Quote } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import MediaUploader from '@/app/components/admin/MediaUploader';
import ToggleShow from '../components/ToggleShow';

interface Props {
  initialData?: any;
  sectionData?: any;
  isEditing?: boolean;
}

export default function TestimonialForm({ initialData, sectionData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />
      
      {/* Top Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/testimonials" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? `Edit Testimonial: ${initialData?.name}` : 'Add New Testimonial'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && <ToggleShow model="testimonials" resource="testimonials" id={initialData?.id as string} published={initialData?.published ?? true} />}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Testimonial' : 'Publish Testimonial')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section Headings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Section Headings</h2>
            
            <div>
              <label className="block font-bold mb-1">Main Heading</label>
              <input type="text" name="title" value={section.title} onChange={handleSectionChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="WHAT OUR CLIENT SAY ABOUT US ?" />
            </div>

            <div>
              <label className="block font-bold mb-1">Subtitle</label>
              <input type="text" name="subtitle" value={section.subtitle} onChange={handleSectionChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="Real experiences shared by travelers who trusted us." />
            </div>

            <div>
              <label className="block font-bold mb-1">Background Watermark Text</label>
              <input type="text" name="watermark" value={section.watermark} onChange={handleSectionChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="CLIENTS REVIEWS" />
            </div>
          </div>

          {/* Review Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Review Details</h2>
            
            <div>
              <label className="block font-bold mb-1">Quote *</label>
              <TipTapEditor value={form.quote} onChange={(html) => setForm(prev => ({ ...prev, quote: html }))} placeholder="What did the client say?" minHeight="160px" />
            </div>

            <div>
              <label className="block font-bold mb-1">Client Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. Sarah Jenkins" />
            </div>

            <div>
              <label className="block font-bold mb-1">Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. United Kingdom" />
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Client Avatar</h3>
            <MediaUploader value={form.avatar} onChange={(url) => setForm(prev => ({ ...prev, avatar: url }))} label="Upload Avatar" heightClass="h-24" />
          </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Review Attributes</h3>

            <div>
              <label className="block font-bold mb-1">Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full p-2.5 border rounded-lg outline-none bg-gray-50" />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
