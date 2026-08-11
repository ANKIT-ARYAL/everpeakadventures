'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import NumberInput from '@/app/components/NumberInput';

interface CategoryFormProps {
  title: string;
  subtitle: string;
  backHref: string;
  createUrl: string;
  updateUrl: string;
  initialData?: any;
  isEditing?: boolean;
}

export default function CategoryForm({
  title,
  subtitle,
  backHref,
  createUrl,
  updateUrl,
  initialData,
  isEditing = false,
}: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    order: initialData?.order || 0,
    published: initialData?.published ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'order'
            ? Number(value)
            : value,
      ...(name === 'name' && !isEditing
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setLoading(true);
    try {
      const url = isEditing ? updateUrl : createUrl;
      const method = isEditing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      toast.success('Saved successfully');
      setTimeout(() => router.push(backHref), 400);
    } catch (err: any) {
      toast.error(err.message || 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:border-[#24a0ed] outline-none';
  const labelCls = 'block font-bold text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-[1000px] mx-auto">
      <Toaster position="top-right" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#112233] uppercase tracking-wide">{title}</h1>
          <p className="text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={backHref} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#112233] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a52] flex items-center gap-2 disabled:opacity-50 font-bold"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Category Details</h3>
            <div>
              <label className={labelCls}>Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Everest Region" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated from name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Order</label>
              <NumberInput type="number" name="order" value={form.order} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <TipTapEditor
                value={form.description}
                onChange={(html) => setForm(prev => ({ ...prev, description: html }))}
                placeholder="Describe this category..."
                minHeight="140px"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Featured Image</h3>
            <MediaUploader value={form.image} onChange={(url) => setForm(prev => ({ ...prev, image: url }))} heightClass="h-40" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Visibility</h3>
            <label className="flex items-center justify-between cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
              <span className="font-bold text-gray-700">Published</span>
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="w-4 h-4 accent-[#24a0ed]"
              />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}