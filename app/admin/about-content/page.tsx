'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';
import ToggleShow from '../components/ToggleShow';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import SectionCard from '@/app/components/admin/SectionCard';
import FieldGrid from '@/app/components/admin/FieldGrid';

const defaultContent = {
  published: true,
  title: 'About Us',
  featuredImage: '',
  happyTravelers: '',
  yearsExperience: '',
  successfulTrips: '',
  expertGuides: '',
  paragraph1: '',
  paragraph2: '',
  paragraph3: '',
  paragraph4: '',
  cultureTitle: '',
  cultureText: '',
  missionText: '',
  visionText: '',
  goalsText: '',
};

export default function AboutContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultContent);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/about-content');
        const json = await res.json();
        if (json.success && json.data) {
          setForm({
            published: json.data.published ?? true,
            title: json.data.title || '',
            featuredImage: json.data.featuredImage || '',
            happyTravelers: json.data.happyTravelers || '',
            yearsExperience: json.data.yearsExperience || '',
            successfulTrips: json.data.successfulTrips || '',
            expertGuides: json.data.expertGuides || '',
            paragraph1: json.data.paragraph1 || '',
            paragraph2: json.data.paragraph2 || '',
            paragraph3: json.data.paragraph3 || '',
            paragraph4: json.data.paragraph4 || '',
            cultureTitle: json.data.cultureTitle || '',
            cultureText: json.data.cultureText || '',
            missionText: json.data.missionText || '',
            visionText: json.data.visionText || '',
            goalsText: json.data.goalsText || '',
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
      const res = await fetch('/api/about-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save About page content');

      toast.success('About page content saved successfully!');
      router.push('/admin/about-content');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl xl:max-w-none mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl xl:max-w-none mx-auto space-y-6 text-xs text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">About Page Content</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleShow model="about-content" resource="about-content" id="__single__" published={form.published ?? true} />
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <SectionCard title="Hero Section" defaultOpen>
        <div>
          <label className="block font-bold mb-1">Page Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="About Us" />
        </div>

        <div>
          <label className="block font-bold mb-1 text-[10px] uppercase tracking-wider">Featured Image</label>
          <p className="text-[10px] text-gray-400 mb-2">Main hero image for the About page.</p>
          <MediaUploader
            type="image"
            value={form.featuredImage}
            onChange={(url) => setForm(prev => ({ ...prev, featuredImage: url }))}
            label="Upload Featured Image"
            heightClass="h-44"
          />
        </div>

        <FieldGrid cols={4}>
          <div>
            <label className="block font-bold mb-1">Happy Travelers</label>
            <input type="text" name="happyTravelers" value={form.happyTravelers} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="1,000+" />
          </div>
          <div>
            <label className="block font-bold mb-1">Years Experience</label>
            <input type="text" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="10+" />
          </div>
          <div>
            <label className="block font-bold mb-1">Successful Trips</label>
            <input type="text" name="successfulTrips" value={form.successfulTrips} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="100+" />
          </div>
          <div>
            <label className="block font-bold mb-1">Expert Guides</label>
            <input type="text" name="expertGuides" value={form.expertGuides} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="20+" />
          </div>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Intro Paragraphs">
        <div>
          <label className="block font-bold mb-1">Paragraph 1</label>
          <TipTapEditor value={form.paragraph1} onChange={(html) => setForm(prev => ({ ...prev, paragraph1: html }))} placeholder="Ever Peak Adventure is a leading..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Paragraph 2</label>
          <TipTapEditor value={form.paragraph2} onChange={(html) => setForm(prev => ({ ...prev, paragraph2: html }))} placeholder="We specialize in trekking..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Paragraph 3</label>
          <TipTapEditor value={form.paragraph3} onChange={(html) => setForm(prev => ({ ...prev, paragraph3: html }))} placeholder="We strictly follow government..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Paragraph 4</label>
          <TipTapEditor value={form.paragraph4} onChange={(html) => setForm(prev => ({ ...prev, paragraph4: html }))} placeholder="Our guides are highly trained..." />
        </div>
      </SectionCard>

      <SectionCard title="Company Culture & Vision">
        <div>
          <label className="block font-bold mb-1">Culture Title</label>
          <input type="text" name="cultureTitle" value={form.cultureTitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Our Company Culture" />
        </div>

        <div>
          <label className="block font-bold mb-1">Culture Text</label>
          <TipTapEditor value={form.cultureText} onChange={(html) => setForm(prev => ({ ...prev, cultureText: html }))} placeholder="Driven by passion, integrity, and respect." />
        </div>

        <div>
          <label className="block font-bold mb-1">Mission</label>
          <TipTapEditor value={form.missionText} onChange={(html) => setForm(prev => ({ ...prev, missionText: html }))} placeholder="To deliver safe, authentic..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Vision</label>
          <TipTapEditor value={form.visionText} onChange={(html) => setForm(prev => ({ ...prev, visionText: html }))} placeholder="To become a globally trusted..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Goals</label>
          <TipTapEditor value={form.goalsText} onChange={(html) => setForm(prev => ({ ...prev, goalsText: html }))} placeholder="To design and operate..." />
        </div>
      </SectionCard>
    </form>
  );
}