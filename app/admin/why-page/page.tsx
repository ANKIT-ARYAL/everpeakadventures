'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import ToggleShow from '../components/ToggleShow';
import SectionCard from '@/app/components/admin/SectionCard';

const defaultContent = {
  published: true,
  title: 'Why Ever Peak Adventures',
  subtitle: 'Have questions or ready to plan your Himalayan adventure?',
  contentHtml: '',
};

export default function WhyPagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultContent);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/why-page');
        const json = await res.json();
        if (json.success && json.data) {
          setForm({
            published: json.data.published ?? true,
            title: json.data.title || '',
            subtitle: json.data.subtitle || '',
            contentHtml: json.data.contentHtml || '',
          });
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/why-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save Why page');

      toast.success('Why page saved successfully!');
      router.push('/admin/why-page');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">Why Ever Peak Adventures</h1>
        </div>
<div className="flex items-center gap-2">
          <ToggleShow model="why-page" resource="why-page" id="__single__" published={form.published ?? true} />
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <SectionCard title="Page Header" defaultOpen>
        <div>
          <label className="block font-bold mb-1">Page Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Why Ever Peak Adventures" />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Have questions or ready to plan..." />
        </div>
      </SectionCard>

      <SectionCard title="Content">
        <div>
          <label className="block font-bold mb-1">Content</label>
          <TipTapEditor
            value={form.contentHtml}
            onChange={(html) => setForm(prev => ({ ...prev, contentHtml: html }))}
            placeholder="Write the Why page content here..."
            minHeight="400px"
          />
        </div>
      </SectionCard>
    </form>
  );
}