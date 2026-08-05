'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface TrekFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function TrekForm({ initialData, isEditing = false }: TrekFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    heroImage: initialData?.heroImage || '',
    gallery: initialData?.gallery || [''],
    description: initialData?.description || '',
    overview: initialData?.overview || '',
    durationDays: initialData?.durationDays || '',
    price: initialData?.price || 0,
    region: initialData?.region || 'Everest Region',
    difficulty: initialData?.difficulty || 'Moderate',
    maxAltitude: initialData?.maxAltitude || '',
    bestSeason: initialData?.bestSeason || '',
    accommodation: initialData?.accommodation || 'Teahouse / Lodge',
    meals: initialData?.meals || 'Breakfast, Lunch, Dinner',
    groupSize: initialData?.groupSize || '1 - 12 Pax',
    transport: initialData?.transport || '',
    mapUrl: initialData?.mapUrl || '',
    order: initialData?.order || 0,
    highlights: initialData?.highlights || [''],
    inclusions: initialData?.inclusions || [''],
    exclusions: initialData?.exclusions || [''],
    packingList: initialData?.packingList || [''],
    itinerary: Array.isArray(initialData?.itinerary) && initialData.itinerary.length > 0 
      ? initialData.itinerary 
      : [{ day: 1, title: '', desc: '' }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' || name === 'price' ? Number(value) : value,
      ...(name === 'title' && !isEditing ? { 
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
      } : {})
    }));
  };

  const handleListChange = (index: number, value: string, field: 'highlights' | 'inclusions' | 'exclusions' | 'packingList' | 'gallery') => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const addListItem = (field: 'highlights' | 'inclusions' | 'exclusions' | 'packingList' | 'gallery') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (index: number, field: 'highlights' | 'inclusions' | 'exclusions' | 'packingList' | 'gallery') => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_: any, i: number) => i !== index) }));
  };

  const handleItineraryChange = (index: number, key: string, value: any) => {
    const updated = [...formData.itinerary];
    updated[index][key] = value;
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', desc: '' }]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_: any, i: number) => i !== index).map((item: any, idx: number) => ({...item, day: idx + 1}))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up empty array items before submission
      const payload = {
        ...formData,
        gallery: formData.gallery.filter((i: string) => i.trim() !== ''),
        highlights: formData.highlights.filter((i: string) => i.trim() !== ''),
        inclusions: formData.inclusions.filter((i: string) => i.trim() !== ''),
        exclusions: formData.exclusions.filter((i: string) => i.trim() !== ''),
        packingList: formData.packingList.filter((i: string) => i.trim() !== ''),
      };

      const url = isEditing ? `/api/treks/${initialData?.id}` : '/api/treks';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save trek package');

      router.push('/admin/treks');
      router.refresh();
    } catch (error) {
      alert('Error saving trekking package.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6 pb-20 text-xs font-sans text-gray-800">
      
      {/* Top Header Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/treks" className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black text-[#112233] oswald uppercase tracking-wider">
            {isEditing ? `Edit Trek: ${initialData?.title}` : 'Add New Trek Package'}
          </h1>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Trek' : 'Publish Trek')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details Column (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Basic Information</h2>
            
            <div>
              <label className="block font-bold text-gray-700 mb-1">Trek Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#24a0ed]" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">URL Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono bg-gray-50 focus:outline-none focus:border-[#24a0ed]" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Short Card Description (Excerpt)</label>
              <textarea name="description" rows={2} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Overview Description</label>
              <textarea name="overview" rows={6} value={formData.overview} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" />
            </div>
          </div>

          {/* Highlights & Packing List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-gray-800 uppercase tracking-wider">Highlights</h2>
                <button type="button" onClick={() => addListItem('highlights')} className="text-[#24a0ed] font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {formData.highlights.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={item} onChange={(e) => handleListChange(idx, e.target.value, 'highlights')} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg" />
                  <button type="button" onClick={() => removeListItem(idx, 'highlights')} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-gray-800 uppercase tracking-wider">Packing Checklist</h2>
                <button type="button" onClick={() => addListItem('packingList')} className="text-[#24a0ed] font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {formData.packingList.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={item} onChange={(e) => handleListChange(idx, e.target.value, 'packingList')} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg" />
                  <button type="button" onClick={() => removeListItem(idx, 'packingList')} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-800 uppercase tracking-wider">Day-by-Day Itinerary</h2>
              <button type="button" onClick={addItineraryDay} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Day
              </button>
            </div>
            {formData.itinerary.map((dayObj: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Day {dayObj.day || idx + 1}</span>
                  {formData.itinerary.length > 1 && (
                    <button type="button" onClick={() => removeItineraryDay(idx)} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>
                <input type="text" value={dayObj.title} onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)} placeholder="Day title (e.g. Arrival in Kathmandu)" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                <textarea rows={3} value={dayObj.desc} onChange={(e) => handleItineraryChange(idx, 'desc', e.target.value)} placeholder="Day description..." className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
              </div>
            ))}
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-emerald-700 uppercase tracking-wider">Inclusions</h2>
                <button type="button" onClick={() => addListItem('inclusions')} className="text-emerald-600 font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {formData.inclusions.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={item} onChange={(e) => handleListChange(idx, e.target.value, 'inclusions')} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg" />
                  <button type="button" onClick={() => removeListItem(idx, 'inclusions')} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-rose-700 uppercase tracking-wider">Exclusions</h2>
                <button type="button" onClick={() => addListItem('exclusions')} className="text-rose-600 font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {formData.exclusions.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={item} onChange={(e) => handleListChange(idx, e.target.value, 'exclusions')} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg" />
                  <button type="button" onClick={() => removeListItem(idx, 'exclusions')} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Images Manager */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#24a0ed]" /> Trek Gallery Slider
              </h2>
              <button type="button" onClick={() => addListItem('gallery')} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Image
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.gallery.map((imgUrl: string, idx: number) => (
                <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-500">Image #{idx + 1}</span>
                    <button type="button" onClick={() => removeListItem(idx, 'gallery')} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input type="url" value={imgUrl} onChange={(e) => handleListChange(idx, e.target.value, 'gallery')} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  {imgUrl && (
                    <div className="h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img src={imgUrl} alt="Gallery Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Attributes Column (Right 1 col) */}
        <div className="space-y-6">
          
          {/* Featured Image Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Hero Image *</h3>
            <div>
              <input type="url" name="heroImage" required value={formData.heroImage} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" />
              {formData.heroImage && (
                <div className="mt-3 relative h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={formData.heroImage} alt="Featured Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Trek Attributes Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Trek Attributes</h3>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Destination Region</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Price (USD) *</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold text-[#24a0ed]" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Duration *</label>
              <input type="text" name="durationDays" required value={formData.durationDays} onChange={handleChange} placeholder="e.g. 14 Days" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Trek Difficulty</label>
              <input type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} placeholder="e.g. Moderate" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Max Altitude</label>
              <input type="text" name="maxAltitude" value={formData.maxAltitude} onChange={handleChange} placeholder="e.g. 5,364m" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Best Season</label>
              <input type="text" name="bestSeason" value={formData.bestSeason} onChange={handleChange} placeholder="e.g. Mar-May, Sep-Nov" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Accommodation</label>
              <input type="text" name="accommodation" value={formData.accommodation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Meals Provided</label>
              <input type="text" name="meals" value={formData.meals} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Group Size</label>
              <input type="text" name="groupSize" value={formData.groupSize} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Transport</label>
              <input type="text" name="transport" value={formData.transport} onChange={handleChange} placeholder="e.g. Flight / Bus" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50" />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}