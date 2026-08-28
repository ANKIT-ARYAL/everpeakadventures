'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';
import ToggleShow from '../components/ToggleShow';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import SectionCard from '@/app/components/admin/SectionCard';

interface Props {
  initialData?: any;
}

export default function HeroContentForm({ initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    published: initialData?.published ?? true,
    topLabel: initialData?.topLabel || '',
    mainHeading: initialData?.mainHeading || '',
    subtext: initialData?.subtext || '',
    heroMediaType: initialData?.heroMediaType || 'youtube',
    heroMediaUrl: initialData?.heroMediaUrl || '',
    youtubeVideoId: initialData?.youtubeVideoId || '',
    searchPlaceholder: initialData?.searchPlaceholder || '',
    primaryButtonText: initialData?.primaryButtonText || '',
    primaryButtonLink: initialData?.primaryButtonLink || '',
    secondaryButtonText: initialData?.secondaryButtonText || '',
    secondaryButtonLink: initialData?.secondaryButtonLink || '',
    showPopupVideo: initialData?.showPopupVideo ?? false,
    popupVideoUrl: initialData?.popupVideoUrl || '',
  });

  // Updated to handle both text inputs and checkboxes properly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/hero-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topLabel: form.topLabel,
          mainHeading: form.mainHeading,
          subtext: form.subtext,
          heroMediaType: form.heroMediaType,
          heroMediaUrl: form.heroMediaUrl,
          youtubeVideoId: form.youtubeVideoId,
          searchPlaceholder: form.searchPlaceholder,
          primaryButtonText: form.primaryButtonText,
          primaryButtonLink: form.primaryButtonLink,
          secondaryButtonText: form.secondaryButtonText,
          secondaryButtonLink: form.secondaryButtonLink,
          showPopupVideo: form.showPopupVideo,
          popupVideoUrl: form.popupVideoUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed to save hero content');

      toast.success('Hero content saved successfully!');
      router.push('/admin/hero-content');
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
          <Link href="/admin" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">Hero Content</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleShow model="hero-content" resource="hero-content" id="__single__" published={form.published ?? true} />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <SectionCard title="Hero Section Content" defaultOpen>
        
        {/* Core Text Content */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block font-bold mb-1">Top Label</label>
            <input type="text" name="topLabel" value={form.topLabel} onChange={handleChange} className="w-full p-3 border rounded-lg text-lg font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Explore the Himalayas with..." />
          </div>

          <div>
            <label className="block font-bold mb-1">Main Heading</label>
            <input type="text" name="mainHeading" value={form.mainHeading} onChange={handleChange} className="w-full p-3 border rounded-lg text-lg font-medium focus:border-[#24a0ed] outline-none" placeholder="Main headline..." />
          </div>

          <div>
            <label className="block font-bold mb-1">Subtext</label>
            <TipTapEditor value={form.subtext} onChange={(html) => setForm(prev => ({ ...prev, subtext: html }))} placeholder="Short description..." minHeight="160px" />
          </div>
        </div>

        {/* Hero Background Media */}
        <div className="space-y-4 py-6 border-t border-gray-100">
          <div>
            <label className="block font-bold mb-1">Background Media Type</label>
            <p className="text-[10px] text-gray-400 mb-2">Choose what plays in the hero background.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { value: 'youtube', label: 'YouTube Link', desc: 'Paste a YouTube video ID' },
                { value: 'video', label: 'Upload Video', desc: 'MP4 / WebM file' },
                { value: 'image', label: 'Upload Image', desc: 'JPG, PNG, SVG, GIF' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, heroMediaType: opt.value }))}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    form.heroMediaType === opt.value
                      ? 'border-[#24a0ed] bg-[#e8f5fe] text-[#112233]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="block font-bold text-[11px]">{opt.label}</span>
                  <span className="block text-[10px] text-gray-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {form.heroMediaType === 'youtube' && (
            <div>
              <label className="block font-bold mb-1">YouTube Video ID</label>
              <input type="text" name="youtubeVideoId" value={form.youtubeVideoId} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. gCRNEJxDJKM" />
            </div>
          )}

          {(form.heroMediaType === 'video' || form.heroMediaType === 'image') && (
            <MediaUploader
              type={form.heroMediaType === 'video' ? 'video' : 'image'}
              value={form.heroMediaUrl}
              onChange={(url) => setForm(prev => ({ ...prev, heroMediaUrl: url }))}
              label={form.heroMediaType === 'video' ? 'Hero Video File' : 'Hero Image'}
              heightClass={form.heroMediaType === 'video' ? 'h-48' : 'h-44'}
            />
          )}
        </div>

        {/* Call to Actions & Search */}
        <div className="space-y-4 py-6 border-t border-gray-100">
          <h3 className="text-lg font-bold text-[#112233] mb-4">Call to Action Buttons & Search</h3>
          
          <div>
            <label className="block font-bold mb-1">Search Placeholder</label>
            <input type="text" name="searchPlaceholder" value={form.searchPlaceholder} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. Search treks, tours, destinations..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-bold mb-1">Primary Button Text</label>
              <input type="text" name="primaryButtonText" value={form.primaryButtonText} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. ▲ View Treks" />
            </div>

            <div>
              <label className="block font-bold mb-1">Primary Button Link</label>
              <input type="text" name="primaryButtonLink" value={form.primaryButtonLink} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. /trekking" />
            </div>

            <div>
              <label className="block font-bold mb-1">Secondary Button Text</label>
              <input type="text" name="secondaryButtonText" value={form.secondaryButtonText} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. Book Now" />
            </div>

            <div>
              <label className="block font-bold mb-1">Secondary Button Link</label>
              <input type="text" name="secondaryButtonLink" value={form.secondaryButtonLink} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. /send-inquiry" />
            </div>
          </div>
        </div>

        {/* NEW SETTINGS: Floating Popup Video */}
        <div className="space-y-4 py-6 border-t border-gray-100 bg-gray-50/50 -mx-6 px-6 rounded-b-xl">
           <h3 className="text-lg font-bold text-[#112233] mb-4">Floating Popup Video Settings</h3>
           
           <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <input 
               type="checkbox" 
               id="showPopupVideo" 
               name="showPopupVideo" 
               checked={form.showPopupVideo} 
               onChange={handleChange}
               className="w-5 h-5 text-[#24a0ed] rounded cursor-pointer border-gray-300"
             />
             <label htmlFor="showPopupVideo" className="font-bold cursor-pointer text-[#112233] select-none">
               Enable Floating Play Button on Frontend
             </label>
           </div>

           {form.showPopupVideo && (
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
               <label className="block font-bold mb-1">Popup YouTube Video URL</label>
               <input 
                 type="text" 
                 name="popupVideoUrl" 
                 value={form.popupVideoUrl} 
                 onChange={handleChange} 
                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#24a0ed] outline-none" 
                 placeholder="e.g. https://www.youtube.com/watch?v=gCRNEJxDJKM" 
               />
               <p className="text-[11px] text-gray-500 mt-1.5 font-medium">
                 Enter the full YouTube URL. This video will pop up and autoplay when users click the floating play button.
               </p>
             </div>
           )}
        </div>

      </SectionCard>
    </form>
  );
}