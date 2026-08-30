/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import MediaUploader from '@/app/components/admin/MediaUploader';
import ToggleShow from '../components/ToggleShow';
import NumberInput from '@/app/components/NumberInput';
import SectionCard from '@/app/components/admin/SectionCard';

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function BlogForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    published: initialData?.published ?? true,
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    image: initialData?.image || '',
    category: initialData?.category || 'Trekking / Hiking',
    date: initialData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    seoTitle: initialData?.seoTitle || '',
    metaDescription: initialData?.metaDescription || '',
    focusKeyphrase: initialData?.focusKeyphrase || '',
    order: initialData?.order || 0,
  });

  const [faqs, setFaqs] = useState<any[]>(
    Array.isArray(initialData?.faqs) && initialData.faqs.length > 0 
      ? initialData.faqs 
      : [{ question: '', answer: '' }]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !isEditing ? { 
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
      } : {})
    }));
  };

  const handleFaqChange = (index: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
        faqs: faqs.filter(f => f.question.trim() !== ''),
      };

      const url = isEditing ? `/api/blogs/${initialData?.id}` : '/api/blogs';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save blog post');
      
      toast.success('Blog post saved successfully!');
      router.push('/admin/blogs');
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
          <Link href="/admin/blogs" className="self-start sm:self-auto p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-black text-[#112233] oswald uppercase tracking-wider">
            {isEditing ? `Edit Post: ${initialData?.title}` : 'Add New Post'}
          </h1>
        </div>

        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          {isEditing && <ToggleShow model="blogs" resource="blogs" id={initialData?.id as string} published={form.published ?? true} />}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        
        {/* Left Column: Editor & SEO */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          
          {/* Core Post Details */}
          <SectionCard title="Main Content" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Post Title *</label>
                <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none focus:border-[#24a0ed]" placeholder="Add title..." />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">URL Slug *</label>
                <input type="text" name="slug" required value={form.slug} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono bg-gray-50 focus:outline-none focus:border-[#24a0ed]" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Excerpt (Card text)</label>
                <TipTapEditor value={form.excerpt} onChange={(html) => setForm(prev => ({ ...prev, excerpt: html }))} placeholder="Brief summary..." />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full HTML Content (Blog Body)</label>
                <TipTapEditor value={form.content} onChange={(html) => setForm(prev => ({ ...prev, content: html }))} placeholder="Write full article here..." minHeight="240px" />
              </div>
            </div>
          </SectionCard>

          {/* Yoast SEO Box */}
          <SectionCard title="Yoast SEO Settings">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Focus Keyphrase</label>
                <input type="text" name="focusKeyphrase" value={form.focusKeyphrase} onChange={handleChange} placeholder="e.g. Everest trek guide" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">SEO Title</label>
                <input type="text" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="Custom title for Google search..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Meta Description</label>
                <textarea name="metaDescription" rows={3} value={form.metaDescription} onChange={handleChange} placeholder="Snippet visible on Google results..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] resize-none" />
              </div>
            </div>
          </SectionCard>

          {/* Related FAQs Repeater */}
          <SectionCard title="Related FAQs">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-xs">FAQs List</h3>
                <button type="button" onClick={addFaq} className="text-[#24a0ed] font-bold flex items-center gap-1 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>

              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 bg-gray-50/50 border border-gray-200 rounded-xl space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-500 uppercase tracking-wider">FAQ #{idx + 1}</span>
                    <button type="button" onClick={() => removeFaq(idx)} className="text-red-500 font-bold flex items-center gap-1 text-xs">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={faq.question} 
                    onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} 
                    placeholder="Question..." 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#24a0ed]" 
                  />
                  <textarea 
                    rows={2} 
                    value={faq.answer} 
                    onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} 
                    placeholder="Answer..." 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#24a0ed] resize-none" 
                  />
                </div>
              ))}
            </div>
          </SectionCard>

        </div>

        {/* Right Sidebar: Meta Attributes */}
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start min-w-0">
          
          <SectionCard title="Featured Image *">
            <MediaUploader value={form.image} onChange={(url) => setForm(prev => ({ ...prev, image: url }))} label="Upload Featured Image" heightClass="h-44" />
          </SectionCard>

          <SectionCard title="Post Attributes">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Display Date</label>
                <input type="text" name="date" value={form.date} onChange={handleChange} placeholder="September 15, 2026" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                <NumberInput type="number" name="order" value={form.order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none" />
              </div>
            </div>
          </SectionCard>

        </div>

      </div>
    </form>
  );
}