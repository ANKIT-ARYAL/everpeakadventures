'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';
import SectionCard from '@/app/components/admin/SectionCard';
import ToggleShow from '../components/ToggleShow';

const ALLOWED_SLUGS = [
  "trekking",
  "tour",
  "blog",
  "faq",
  "contact-us",
  "our-team",
  "legal-document",
  "testimonials",
  "why-ever-peak-adventures",
  "responsible-travel",
  "terms-and-conditions",
  "privacy-policy",
];

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function SubpageHeroForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    image: initialData?.image || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };

      const url = isEditing ? `/api/subpage-hero/${initialData?.id}` : '/api/subpage-hero';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save subpage hero');
      
      toast.success('Subpage hero saved successfully!');
      router.push('/admin/subpage-hero');
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
          <Link href="/admin/subpage-hero" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? `Edit Hero: ${initialData?.slug}` : 'Add New Subpage Hero'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && <ToggleShow model="subpage-heroes" resource="subpage-hero" id={initialData?.id as string} published={initialData?.published ?? true} />}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Hero' : 'Publish Hero')}
          </button>
        </div>
      </div>

      <SectionCard title="Hero Details" defaultOpen>
        <div>
          <label className="block font-bold mb-1">Page Slug *</label>
          <select name="slug" required value={form.slug} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-gray-50 focus:border-[#24a0ed] outline-none">
            <option value="" disabled>Select a page...</option>
            {ALLOWED_SLUGS.map(slug => (
              <option key={slug} value={slug}>{slug}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold mb-1">Title *</label>
          <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Add title..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="Add subtitle..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Background Image</label>
          <MediaUploader value={form.image} onChange={(url) => setForm(prev => ({ ...prev, image: url }))} label="Upload Background Image" />
        </div>
      </SectionCard>
    </form>
  );
}
