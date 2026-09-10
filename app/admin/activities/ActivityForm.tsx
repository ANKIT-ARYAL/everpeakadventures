'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';
import SectionCard from '@/app/components/admin/SectionCard';
import ToggleShow from '../components/ToggleShow';

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function ActivityForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/^-|-$/g, '');

  const [form, setForm] = useState({
    slug: initialData?.slug || (initialData?.title ? slugify(initialData.title) : ''),
    title: initialData?.title || '',
    description: initialData?.description || '',
    heroImage: initialData?.heroImage || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'title' && !slugEdited) {
      setForm(prev => ({ ...prev, slug: slugify(value) }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);
    setForm(prev => ({ ...prev, slug: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };

      const url = isEditing ? `/api/admin/activities/${initialData?.id}` : '/api/admin/activities';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save subpage hero');
      
      toast.success('Subpage hero saved successfully!');
      router.push('/admin/activities');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl xl:max-w-none mx-auto space-y-6 text-md text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />
      
      {/* Top Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/activities" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? `Edit Hero: ${initialData?.slug}` : 'Add New Activity'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && <ToggleShow model="activities" resource="activities" id={initialData?.id as string} published={initialData?.published ?? true} />}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Hero' : 'Publish Activity')}
          </button>
        </div>
      </div>

      <SectionCard title="Hero Details" defaultOpen>
        <div>
          <label className="block font-bold mb-1">Page Slug *</label>
          <input
            type="text"
            name="slug"
            required
            value={form.slug}
            onChange={handleSlugChange}
            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:border-[#24a0ed] outline-none"
            placeholder="auto-generated from title (editable)"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Title *</label>
          <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-lg font-medium focus:border-[#24a0ed] outline-none" placeholder="Add title..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <input type="text" name="description" value={form.description} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="Add description..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Background Image</label>
          <MediaUploader value={form.heroImage} onChange={(url) => setForm(prev => ({ ...prev, heroImage: url }))} label="Upload Background Image" />
        </div>
      </SectionCard>
    </form>
  );
}
