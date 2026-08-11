'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import ToggleShow from '../components/ToggleShow';
import SectionCard from '@/app/components/admin/SectionCard';

const defaultContent = {
  published: true,
  contentHtml: '',
  founderName: 'Dipesh Aryal',
  founderTitle: 'Founder, Ever Peak Adventures',
  founderEmail: 'dipesh@everpeakadventure.com',
  founderImage: '',
};

export default function DirectorMessagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultContent);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/director-message');
        const json = await res.json();
        if (json.success && json.data) {
          setForm({
            published: json.data.published ?? true,
            contentHtml: json.data.contentHtml || '',
            founderName: json.data.founderName || '',
            founderTitle: json.data.founderTitle || '',
            founderEmail: json.data.founderEmail || '',
            founderImage: json.data.founderImage || '',
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
      const res = await fetch('/api/director-message', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save Director Message');

      toast.success('Director Message saved successfully!');
      router.push('/admin/director-message');
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
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">Message From Founder</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleShow model="director-message" resource="director-message" id="__single__" published={form.published ?? true} />
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <SectionCard title="Founder Details" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Founder Name</label>
            <input type="text" name="founderName" value={form.founderName} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Dipesh Aryal" />
          </div>
          <div>
            <label className="block font-bold mb-1">Founder Title</label>
            <input type="text" name="founderTitle" value={form.founderTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Founder, Ever Peak Adventures" />
          </div>
        </div>

        <div>
          <label className="block font-bold mb-1">Founder Email</label>
          <input type="email" name="founderEmail" value={form.founderEmail} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="dipesh@everpeakadventure.com" />
        </div>

        <div>
          <label className="block font-bold mb-1 text-[10px] uppercase tracking-wider">Founder Image</label>
          <p className="text-[10px] text-gray-400 mb-2">Profile photo for the founder's message.</p>
          <MediaUploader
            type="image"
            value={form.founderImage}
            onChange={(url) => setForm(prev => ({ ...prev, founderImage: url }))}
            label="Upload Founder Image"
            heightClass="h-44"
          />
        </div>
      </SectionCard>

      <SectionCard title="Message Content">
        <div>
          <label className="block font-bold mb-1">Content</label>
          <TipTapEditor
            value={form.contentHtml}
            onChange={(html) => setForm(prev => ({ ...prev, contentHtml: html }))}
            placeholder="Write the founder's message here..."
            minHeight="300px"
          />
        </div>
      </SectionCard>
    </form>
  );
}