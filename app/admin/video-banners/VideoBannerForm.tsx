'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  videoBannerData?: any;
  ctaBannerData?: any;
}

export default function VideoBannerForm({ videoBannerData, ctaBannerData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [videoBanner, setVideoBanner] = useState({
    title: videoBannerData?.title || '',
    subtitle: videoBannerData?.subtitle || '',
    buttonText: videoBannerData?.buttonText || '',
    buttonLink: videoBannerData?.buttonLink || '',
    videoUrl: videoBannerData?.videoUrl || '',
  });

  const [backgroundImages, setBackgroundImages] = useState<string[]>(
    Array.isArray(videoBannerData?.backgroundImages) && videoBannerData.backgroundImages.length > 0
      ? videoBannerData.backgroundImages
      : ['']
  );

  const [ctaBanner, setCtaBanner] = useState({
    title: ctaBannerData?.title || '',
    subtitle: ctaBannerData?.subtitle || '',
    bgImage: ctaBannerData?.bgImage || '',
    primaryLink: ctaBannerData?.primaryLink || '',
    secondaryLink: ctaBannerData?.secondaryLink || '',
  });

  const handleVideoBannerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVideoBanner(prev => ({ ...prev, [name]: value }));
  };

  const handleCtaBannerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCtaBanner(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...backgroundImages];
    updated[index] = value;
    setBackgroundImages(updated);
  };

  const addImage = () => setBackgroundImages([...backgroundImages, '']);
  const removeImage = (index: number) => setBackgroundImages(backgroundImages.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const videoRes = await fetch('/api/video-banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...videoBanner,
          backgroundImages: backgroundImages.filter(img => img.trim() !== ''),
        }),
      });
      if (!videoRes.ok) throw new Error('Failed to save video banner');

      const ctaRes = await fetch('/api/cta-banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctaBanner),
      });
      if (!ctaRes.ok) throw new Error('Failed to save CTA banner');

      toast.success('Banners saved successfully!');
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">Video & CTA Banners</h1>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Video Banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Video Banner</h2>

        <div>
          <label className="block font-bold mb-1">Title</label>
          <input type="text" name="title" value={videoBanner.title} onChange={handleVideoBannerChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Banner title..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <textarea name="subtitle" rows={3} value={videoBanner.subtitle} onChange={handleVideoBannerChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="Banner subtitle..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Button Text</label>
          <input type="text" name="buttonText" value={videoBanner.buttonText} onChange={handleVideoBannerChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. START JOURNEY" />
        </div>

        <div>
          <label className="block font-bold mb-1">Button Link</label>
          <input type="text" name="buttonLink" value={videoBanner.buttonLink} onChange={handleVideoBannerChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. /tours" />
        </div>

        <div>
          <label className="block font-bold mb-1">Video URL</label>
          <input type="text" name="videoUrl" value={videoBanner.videoUrl} onChange={handleVideoBannerChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="https://www.youtube.com/watch?v=..." />
        </div>

        <div>
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider">Background Images</h3>
            <button type="button" onClick={addImage} className="text-[#24a0ed] font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Image
            </button>
          </div>

          {backgroundImages.map((img, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="font-bold">Image #{idx + 1}</span>
                <button type="button" onClick={() => removeImage(idx)} className="text-red-500 font-bold flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
              <input 
                type="url" 
                value={img} 
                onChange={(e) => handleImageChange(idx, e.target.value)} 
                placeholder="https://..." 
                className="w-full p-2.5 border rounded-lg bg-white outline-none" 
              />
              {img && (
                <div className="h-24 rounded-lg overflow-hidden border">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">CTA Banner</h2>

        <div>
          <label className="block font-bold mb-1">Title</label>
          <input type="text" name="title" value={ctaBanner.title} onChange={handleCtaBannerChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="CTA title..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <textarea name="subtitle" rows={3} value={ctaBanner.subtitle} onChange={handleCtaBannerChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="CTA subtitle..." />
        </div>

        <div>
          <label className="block font-bold mb-1">Background Image</label>
          <input type="url" name="bgImage" value={ctaBanner.bgImage} onChange={handleCtaBannerChange} placeholder="https://..." className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
          {ctaBanner.bgImage && (
            <div className="h-36 rounded-lg overflow-hidden border mt-3">
              <img src={ctaBanner.bgImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block font-bold mb-1">Primary Link</label>
          <input type="text" name="primaryLink" value={ctaBanner.primaryLink} onChange={handleCtaBannerChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. /contact" />
        </div>

        <div>
          <label className="block font-bold mb-1">Secondary Link</label>
          <input type="text" name="secondaryLink" value={ctaBanner.secondaryLink} onChange={handleCtaBannerChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. /tours" />
        </div>
      </div>
    </form>
  );
}
