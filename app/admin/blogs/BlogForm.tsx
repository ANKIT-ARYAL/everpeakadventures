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

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function BlogForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />
      
      {/* Top Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? `Edit Post: ${initialData?.title}` : 'Add New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && <ToggleShow model="blogs" resource="blogs" id={initialData?.id as string} published={initialData?.published ?? true} />}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Editor & SEO */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Core Post Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Main Content</h2>
            
            <div>
              <label className="block font-bold mb-1">Post Title *</label>
              <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Add title..." />
            </div>

            <div>
              <label className="block font-bold mb-1">URL Slug *</label>
              <input type="text" name="slug" required value={form.slug} onChange={handleChange} className="w-full p-2.5 border rounded-lg font-mono bg-gray-50 focus:border-[#24a0ed] outline-none" />
            </div>

            <div>
              <label className="block font-bold mb-1">Short Excerpt (Card text)</label>
              <TipTapEditor value={form.excerpt} onChange={(html) => setForm(prev => ({ ...prev, excerpt: html }))} placeholder="Brief summary..." />
            </div>

            <div>
              <label className="block font-bold mb-1">Full HTML Content (Blog Body)</label>
              <TipTapEditor value={form.content} onChange={(html) => setForm(prev => ({ ...prev, content: html }))} placeholder="Write full article here..." minHeight="240px" />
            </div>
          </div>

          {/* Yoast SEO Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="border-b pb-2 flex items-center justify-between">
              <h2 className="font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                Yoast SEO Settings
              </h2>
            </div>

            <div>
              <label className="block font-bold mb-1">Focus Keyphrase</label>
              <input type="text" name="focusKeyphrase" value={form.focusKeyphrase} onChange={handleChange} placeholder="e.g. Everest trek guide" className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
            </div>

            <div>
              <label className="block font-bold mb-1">SEO Title</label>
              <input type="text" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="Custom title for Google search..." className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
            </div>

            <div>
              <label className="block font-bold mb-1">Meta Description</label>
              <textarea name="metaDescription" rows={3} value={form.metaDescription} onChange={handleChange} placeholder="Snippet visible on Google results..." className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
            </div>
          </div>

          {/* Related FAQs Repeater */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-800 uppercase tracking-wider">Related FAQs</h2>
              <button type="button" onClick={addFaq} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>

            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold">FAQ #{idx + 1}</span>
                  <button type="button" onClick={() => removeFaq(idx)} className="text-red-500 font-bold flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
                <input 
                  type="text" 
                  value={faq.question} 
                  onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} 
                  placeholder="Question..." 
                  className="w-full p-2.5 border rounded-lg bg-white outline-none" 
                />
                <textarea 
                  rows={2} 
                  value={faq.answer} 
                  onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} 
                  placeholder="Answer..." 
                  className="w-full p-2.5 border rounded-lg bg-white outline-none" 
                />
              </div>
            ))}
          </div>

        </div>

        {/* Right Sidebar: Meta Attributes */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Featured Image *</h3>
            <MediaUploader value={form.image} onChange={(url) => setForm(prev => ({ ...prev, image: url }))} label="Upload Featured Image" heightClass="h-36" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Post Attributes</h3>

            <div>
              <label className="block font-bold mb-1">Category</label>
              <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full p-2.5 border rounded-lg outline-none" />
            </div>

            <div>
              <label className="block font-bold mb-1">Display Date</label>
              <input type="text" name="date" value={form.date} onChange={handleChange} placeholder="September 15, 2026" className="w-full p-2.5 border rounded-lg outline-none" />
            </div>

            <div>
              <label className="block font-bold mb-1">Display Order</label>
              <NumberInput type="number" name="order" value={form.order} onChange={handleChange} className="w-full p-2.5 border rounded-lg outline-none bg-gray-50" />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}