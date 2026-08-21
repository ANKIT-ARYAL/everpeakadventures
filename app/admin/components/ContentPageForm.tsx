'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import NumberInput from '@/app/components/NumberInput';

interface Props {
  categories: { id: string; name: string; depth: number }[];
  initialData?: any;
  isEditing?: boolean;
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:border-[#24a0ed] outline-none';
const labelCls = 'block font-bold text-gray-700 mb-1';

export default function ContentPageForm({ categories = [], initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    subtitle: initialData?.subtitle || '',
    heroImage: initialData?.heroImage || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    order: initialData?.order || 0,
    published: initialData?.published ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value,
      ...(name === 'title' && !isEditing
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, categoryId: form.categoryId || null };
      const url = isEditing ? `/api/pages/${initialData.id}` : '/api/pages';
      const method = isEditing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      toast.success('Saved successfully');
      setTimeout(() => router.push('/admin/pages'), 400);
    } catch (err: any) {
      toast.error(err.message || 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-[1000px] xl:max-w-none mx-auto">
      <Toaster position="top-right" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#112233] uppercase tracking-wide">
            {isEditing ? 'Edit Page' : 'Add New Page'}
          </h1>
          <p className="text-gray-500 mt-1">Create a page inside a main category and sub-category.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/pages" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#112233] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a52] flex items-center gap-2 disabled:opacity-50 font-bold"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Page Content</h3>
            <div>
              <label className={labelCls}>Page Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Our Story" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Short subtitle shown under the title" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Content</label>
              <TipTapEditor
                value={form.content}
                onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
                placeholder="Write the page content here..."
                minHeight="300px"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Page Settings</h3>
            <div>
              <label className={labelCls}>Main Category / Sub Category</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputCls}>
                <option value="">— No category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.depth > 0 ? '— '.repeat(c.depth) : ''}{c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated from title" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Order</label>
              <NumberInput type="number" name="order" value={form.order} onChange={handleChange} className={inputCls} />
            </div>
            <label className="flex items-center justify-between cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
              <span className="font-bold text-gray-700">Published</span>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm(prev => ({ ...prev, published: e.target.checked }))}
                className="w-4 h-4 accent-[#24a0ed]"
              />
            </label>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Hero Image</h3>
            <MediaUploader value={form.heroImage} onChange={(url) => setForm(prev => ({ ...prev, heroImage: url }))} heightClass="h-40" />
          </div>
        </div>
      </div>
    </form>
  );
}