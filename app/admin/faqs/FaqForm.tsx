'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import ToggleShow from '../components/ToggleShow';

interface RelatedPage {
  type: 'trek' | 'tour' | 'blog';
  slug: string;
  title: string;
}

interface Props {
  initialData?: any;
  isEditing?: boolean;
  relatedPages?: RelatedPage[];
}

export default function FaqForm({ initialData, isEditing = false, relatedPages = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    order: initialData?.order || 0,
    relatedType: initialData?.relatedType || '',
    relatedSlug: initialData?.relatedSlug || '',
  });

  const relatedTypeOptions = [
    { value: 'trek', label: 'Trek page' },
    { value: 'tour', label: 'Tour page' },
    { value: 'blog', label: 'Blog post' },
  ];

  const pagesOfType = relatedPages
    .filter(p => p.type === form.relatedType)
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'relatedType') {
      setForm(prev => ({ ...prev, [name]: value, relatedSlug: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
        relatedType: form.relatedType || null,
        relatedSlug: form.relatedSlug || null,
      };

      const url = isEditing ? `/api/faqs/${initialData?.id}` : '/api/faqs';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save FAQ');
      
      toast.success('FAQ saved successfully!');
      router.push('/admin/faqs');
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/faqs" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? `Edit FAQ: ${initialData?.question}` : 'Add New FAQ'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && <ToggleShow model="faqs" resource="faqs" id={initialData?.id as string} published={initialData?.published ?? true} />}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update FAQ' : 'Publish FAQ')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* FAQ Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">FAQ Details</h2>
            
            <div>
              <label className="block font-bold mb-1">Question *</label>
              <textarea name="question" rows={3} required value={form.question} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="What is the question?" />
            </div>

            <div>
              <label className="block font-bold mb-1">Answer *</label>
              <TipTapEditor value={form.answer} onChange={(html) => setForm(prev => ({ ...prev, answer: html }))} placeholder="Write the answer..." minHeight="160px" />
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">FAQ Attributes</h3>

            <div>
              <label className="block font-bold mb-1">Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full p-2.5 border rounded-lg outline-none bg-gray-50" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Show On Page</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Optionally feature this FAQ on a related trek, tour, or blog page. Leave unset to only appear on the FAQ listing.
            </p>

            <div>
              <label className="block font-bold mb-1">Page Type</label>
              <select name="relatedType" value={form.relatedType} onChange={handleChange} className="w-full p-2.5 border rounded-lg outline-none bg-gray-50">
                <option value="">None (FAQ page only)</option>
                {relatedTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {form.relatedType && (
              <div>
                <label className="block font-bold mb-1">Select {relatedTypeOptions.find(o => o.value === form.relatedType)?.label}</label>
                <select name="relatedSlug" value={form.relatedSlug} onChange={handleChange} className="w-full p-2.5 border rounded-lg outline-none bg-gray-50">
                  <option value="">Select a page...</option>
                  {pagesOfType.map(p => (
                    <option key={p.slug} value={p.slug}>{p.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

        </div>

      </div>
    </form>
  );
}
