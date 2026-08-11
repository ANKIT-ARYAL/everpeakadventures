'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function WelcomeFeatureForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    order: initialData?.order || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/welcome-features/${initialData?.id}` : '/api/welcome-features';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to save welcome feature');

      toast.success('Welcome feature saved successfully!');
      router.push('/admin/welcome-features');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />

      {/* Top Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/welcome-features" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? `Edit Feature: ${initialData?.title}` : 'Add New Feature'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Feature' : 'Publish Feature')}
        </button>
      </div>

      {/* Feature Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block font-bold mb-1">Feature Title *</label>
          <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Local Himalayan Experts" />
        </div>

        <div>
          <label className="block font-bold mb-1">Description</label>
          <TipTapEditor value={form.description} onChange={(html) => setForm(prev => ({ ...prev, description: html }))} placeholder="Short description..." minHeight="120px" />
        </div>

        <div>
          <label className="block font-bold mb-1">Display Order</label>
          <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full p-2.5 border rounded-lg outline-none bg-gray-50" />
        </div>
      </div>
    </form>
  );
}
