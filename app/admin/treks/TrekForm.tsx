'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon, Video } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/app/components/admin/RichTextEditor';
import MediaUploader from '@/app/components/admin/MediaUploader';

interface TrekFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const REGION_CATEGORIES = [
  'Everest Region',
  'Annapurna Region',
  'Manaslu Region',
  'Langtang Region',
  'Mustang Region',
  'Kanchenjunga Region',
  'Makalu Region',
  'Dolpo Region',
  'All Trekking Packages',
];

const REGION_SLUGS: Record<string, string> = {
  'Everest Region': 'everest',
  'Annapurna Region': 'annapurna',
  'Manaslu Region': 'manaslu',
  'Langtang Region': 'langtang',
  'Mustang Region': 'mustang',
  'Kanchenjunga Region': 'kanchenjunga-region-trekking',
  'Makalu Region': 'makalu-region-trekking',
  'Dolpo Region': 'dolpo',
};

const REGION_FROM_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(REGION_SLUGS).map(([k, v]) => [v, k])
);

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

    // Pricing / Quick Facts
    price: initialData?.price || 0,
    discountedPrice: initialData?.discountedPrice || 0,
    originalPrice: initialData?.originalPrice || 0,
    priceRange: initialData?.priceRange || '',
    isAllInclusive: initialData?.isAllInclusive ?? false,
    durationDays: initialData?.durationDays || '',
    maxAltitude: initialData?.maxAltitude || '',
    region: initialData?.region || 'Everest Region',
    accommodation: initialData?.accommodation || 'Teahouse / Lodge',
    difficulty: initialData?.difficulty || 'Moderate',
    bestSeason: initialData?.bestSeason || '',
    meals: initialData?.meals || 'Breakfast, Lunch, Dinner',
    activity: initialData?.activity || '',
    groupSize: initialData?.groupSize || '1 - 12 Pax',
    transport: initialData?.transport || '',
    mapUrl: initialData?.mapUrl || '',
    videoUrl: initialData?.videoUrl || '',
    videoType: initialData?.videoType || 'youtube',
    order: initialData?.order || 0,

    // Region taxonomy (checkboxes)
    regions: initialData?.regions?.length
      ? initialData.regions
      : initialData?.region
        ? [REGION_FROM_SLUG[initialData.region] || 'All Trekking Packages']
        : ['All Trekking Packages'],

    // Group Pricing Repeater (Advanced PageManager)
    groupPrices:
      Array.isArray(initialData?.groupPrices) && initialData.groupPrices.length > 0
        ? initialData.groupPrices.map((gp: any) => ({
            groupSize: gp.groupSize || '',
            groupType: gp.groupType || 'Best Value',
            price: gp.price || '',
          }))
        : [{ groupSize: '2 - 4', groupType: 'Small Group', price: '' }],

    // Group Date Schedule Repeater (Quick Facts)
    fixedSchedules:
      Array.isArray(initialData?.fixedSchedules) && initialData.fixedSchedules.length > 0
        ? initialData.fixedSchedules.map((fs: any) => ({
            groupSize: fs.groupSize || '',
            dateRange: fs.dateRange || '',
            status: fs.status || 'Book',
          }))
        : [{ groupSize: '2 - 12 Pax', dateRange: '', status: 'Book' }],

    highlights: initialData?.highlights || [''],
    inclusions: initialData?.inclusions || [''],
    exclusions: initialData?.exclusions || [''],
    packingList: initialData?.packingList || [''],
    itinerary:
      Array.isArray(initialData?.itinerary) && initialData.itinerary.length > 0
        ? initialData.itinerary
        : [{ day: 1, title: '', desc: '', elev: 0 }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'order' || name === 'price' || name === 'discountedPrice' || name === 'originalPrice'
          ? Number(value)
          : value,
      ...(name === 'title' && !isEditing
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        : {}),
    }));
  };

  const handleListChange = (
    index: number,
    value: string,
    field: 'highlights' | 'inclusions' | 'exclusions' | 'packingList' | 'gallery'
  ) => {
    setFormData(prev => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addListItem = (field: 'highlights' | 'inclusions' | 'exclusions' | 'packingList' | 'gallery') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (
    index: number,
    field: 'highlights' | 'inclusions' | 'exclusions' | 'packingList' | 'gallery'
  ) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_: any, i: number) => i !== index) }));
  };

  // --- Group Pricing Repeater ---
  const handleGroupPriceChange = (index: number, key: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.groupPrices];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, groupPrices: updated };
    });
  };

  const addGroupPriceRow = () => {
    setFormData(prev => ({
      ...prev,
      groupPrices: [...prev.groupPrices, { groupSize: '', groupType: 'Best Value', price: '' }],
    }));
  };

  const removeGroupPriceRow = (index: number) => {
    setFormData(prev => ({ ...prev, groupPrices: prev.groupPrices.filter((_: any, i: number) => i !== index) }));
  };

  // --- Departure Schedule Repeater ---
  const handleScheduleChange = (index: number, key: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.fixedSchedules];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, fixedSchedules: updated };
    });
  };

  const addScheduleRow = () => {
    setFormData(prev => ({
      ...prev,
      fixedSchedules: [...prev.fixedSchedules, { groupSize: '', dateRange: '', status: 'Book' }],
    }));
  };

  const removeScheduleRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fixedSchedules: prev.fixedSchedules.filter((_: any, i: number) => i !== index),
    }));
  };

  // --- Region Taxonomy ---
  const toggleRegion = (cat: string) => {
    setFormData(prev => {
      const has = prev.regions.includes(cat);
      const regions = has ? prev.regions.filter((r: string) => r !== cat) : [...prev.regions, cat];
      const region = REGION_SLUGS[regions.find((r: string) => REGION_SLUGS[r]) || ''] || prev.region;
      return { ...prev, regions, region };
    });
  };

  const handleItineraryChange = (index: number, key: string, value: any) => {
    setFormData(prev => {
      const updated = [...prev.itinerary];
      updated[index][key] = value;
      return { ...prev, itinerary: updated };
    });
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', desc: '', elev: 0 }],
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_: any, i: number) => i !== index).map((item: any, idx: number) => ({ ...item, day: idx + 1 })),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanGroupPrices = formData.groupPrices.filter(
        (g: any) => g.groupSize.trim() !== '' || g.price.trim() !== ''
      );
      const cleanSchedules = formData.fixedSchedules.filter((s: any) => s.dateRange.trim() !== '');

      const payload = {
        ...formData,
        gallery: formData.gallery.filter((i: string) => i.trim() !== ''),
        highlights: formData.highlights.filter((i: string) => i.trim() !== ''),
        inclusions: formData.inclusions.filter((i: string) => i.trim() !== ''),
        exclusions: formData.exclusions.filter((i: string) => i.trim() !== ''),
        packingList: formData.packingList.filter((i: string) => i.trim() !== ''),
        groupPrices: cleanGroupPrices,
        fixedSchedules: cleanSchedules,
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
    <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto space-y-6 pb-20 text-xs font-sans text-gray-800">

      {/* Top Header Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/treks" className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black text-[#112233] oswald uppercase tracking-wider">
            {isEditing ? `Edit Trekking: ${initialData?.title}` : 'Add New Trekking Package'}
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

        {/* ============ LEFT / MAIN COLUMN ============ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title & Permalink */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Title &amp; Permalink</h2>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#24a0ed]" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Permalink / Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono bg-gray-50 focus:outline-none focus:border-[#24a0ed]" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Short Card Description (Excerpt)</label>
              <RichTextEditor value={formData.description} onChange={(html) => setFormData(prev => ({ ...prev, description: html }))} placeholder="Short excerpt shown on cards..." minHeight="80px" />
            </div>
          </div>

          {/* Main Content Editor (Overview) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Trip Overview / Description</h2>
            <RichTextEditor value={formData.overview} onChange={(html) => setFormData(prev => ({ ...prev, overview: html }))} placeholder="Full descriptive overview of the trek..." minHeight="200px" />
          </div>

          {/* Advanced PageManager - Group Pricing Repeater */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-800 uppercase tracking-wider">Advanced Pricing / Group Price</h2>
              <button type="button" onClick={addGroupPriceRow} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-100 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                    <th className="px-3 py-2 font-bold">Pax / No. of Persons</th>
                    <th className="px-3 py-2 font-bold">Group Type</th>
                    <th className="px-3 py-2 font-bold">Price per Person</th>
                    <th className="px-3 py-2 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.groupPrices.map((g: any, idx: number) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="px-2 py-2">
                        <input type="text" value={g.groupSize} onChange={(e) => handleGroupPriceChange(idx, 'groupSize', e.target.value)} placeholder="2 - 4 Pax" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                      </td>
                      <td className="px-2 py-2">
                        <select value={g.groupType} onChange={(e) => handleGroupPriceChange(idx, 'groupType', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
                          <option>Small Group</option>
                          <option>Best Value</option>
                          <option>Super Group</option>
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input type="text" value={g.price} onChange={(e) => handleGroupPriceChange(idx, 'price', e.target.value)} placeholder="US$ 2,599" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                      </td>
                      <td className="px-2 py-2 text-right">
                        <button type="button" onClick={() => removeGroupPriceRow(idx)} className="text-red-500 p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Facts - Group Date Schedule / Departure Slots */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-800 uppercase tracking-wider">Group Date Schedule / Departure Slots</h2>
              <button type="button" onClick={addScheduleRow} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
            <p className="text-gray-400 text-[11px] -mt-2">Choose the departure date and group size with this site you would love.</p>

            {formData.fixedSchedules.map((s: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-end gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 relative">
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Group Size</label>
                  <input type="text" value={s.groupSize} onChange={(e) => handleScheduleChange(idx, 'groupSize', e.target.value)} placeholder="2 - 12 Pax" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Date Range</label>
                  <input type="text" value={s.dateRange} onChange={(e) => handleScheduleChange(idx, 'dateRange', e.target.value)} placeholder="15 Sep - 28 Sep" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                </div>
                <div className="w-24">
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Status</label>
                  <select value={s.status} onChange={(e) => handleScheduleChange(idx, 'status', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
                    <option>Book</option>
                    <option>Guaranteed</option>
                    <option>Filling Fast</option>
                  </select>
                </div>
                <button type="button" onClick={() => removeScheduleRow(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded flex items-center gap-1 font-bold">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-800 uppercase tracking-wider">Highlights</h2>
              <button type="button" onClick={() => addListItem('highlights')} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {formData.highlights.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <RichTextEditor value={item} onChange={(html) => handleListChange(idx, html, 'highlights')} minHeight="60px" />
                <button type="button" onClick={() => removeListItem(idx, 'highlights')} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
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
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Elevation (metres)</label>
                    <input type="number" value={dayObj.elev ?? ''} onChange={(e) => handleItineraryChange(idx, 'elev', Number(e.target.value))} placeholder="e.g. 3440" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                </div>
                <textarea rows={3} value={dayObj.desc} onChange={(e) => handleItineraryChange(idx, 'desc', e.target.value)} placeholder="Day description..." className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
              </div>
            ))}
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-emerald-700 uppercase tracking-wider">Package Inclusions</h2>
                <button type="button" onClick={() => addListItem('inclusions')} className="text-emerald-600 font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {formData.inclusions.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <RichTextEditor value={item} onChange={(html) => handleListChange(idx, html, 'inclusions')} minHeight="60px" />
                  <button type="button" onClick={() => removeListItem(idx, 'inclusions')} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-rose-700 uppercase tracking-wider">Package Exclusions</h2>
                <button type="button" onClick={() => addListItem('exclusions')} className="text-rose-600 font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {formData.exclusions.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <RichTextEditor value={item} onChange={(html) => handleListChange(idx, html, 'exclusions')} minHeight="60px" />
                  <button type="button" onClick={() => removeListItem(idx, 'exclusions')} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & Packing */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-800 uppercase tracking-wider">Equipment &amp; Trekking Gears</h2>
              <button type="button" onClick={() => addListItem('packingList')} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {formData.packingList.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <RichTextEditor value={item} onChange={(html) => handleListChange(idx, html, 'packingList')} minHeight="60px" />
                <button type="button" onClick={() => removeListItem(idx, 'packingList')} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {/* Gallery */}
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
                  <MediaUploader value={imgUrl} onChange={(url) => handleListChange(idx, url, 'gallery')} heightClass="h-32" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ============ RIGHT SIDEBAR ============ */}
        <div className="space-y-6">

          {/* Featured Image Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Featured Image *</h3>
            <MediaUploader value={formData.heroImage} onChange={(url) => setFormData(prev => ({ ...prev, heroImage: url }))} heightClass="h-44" />
          </div>

          {/* Pricing, Tour - Quick Fact Meta-Fields */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Pricing &amp; Quick Facts</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Price (USD)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold text-[#24a0ed]" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Regular Price</label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="2975" className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-400" />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Price Range</label>
                <input type="text" name="priceRange" value={formData.priceRange} onChange={handleChange} placeholder="US$ 2,499 - US$ 2,975" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Duration *</label>
                <input type="text" name="durationDays" required value={formData.durationDays} onChange={handleChange} placeholder="e.g. 19 Days" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Max Altitude (Maxl)</label>
                <input type="text" name="maxAltitude" value={formData.maxAltitude} onChange={handleChange} placeholder="6,189 m" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Destination</label>
                <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Accommodation</label>
                <input type="text" name="accommodation" value={formData.accommodation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Difficulty</label>
                <input type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} placeholder="e.g. Strenuous" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Best Time</label>
                <input type="text" name="bestSeason" value={formData.bestSeason} onChange={handleChange} placeholder="Spring & Autumn" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Meals</label>
                <input type="text" name="meals" value={formData.meals} onChange={handleChange} placeholder="BLD" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Activity</label>
                <input type="text" name="activity" value={formData.activity} onChange={handleChange} placeholder="Trekking/Peak Climbing" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Group (Size)</label>
                <input type="text" name="groupSize" value={formData.groupSize} onChange={handleChange} placeholder="1 - 10" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Transport</label>
                <input type="text" name="transport" value={formData.transport} onChange={handleChange} placeholder="Flight / Bus" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50" />
              </div>
            </div>

            <label className="flex items-center justify-between cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
              <span className="font-bold text-gray-700">All Inclusive Price</span>
              <input
                type="checkbox"
                name="isAllInclusive"
                checked={formData.isAllInclusive}
                onChange={(e) => setFormData(prev => ({ ...prev, isAllInclusive: e.target.checked }))}
                className="w-4 h-4 accent-[#24a0ed]"
              />
            </label>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Elevation Map URL</label>
              <input type="url" name="mapUrl" value={formData.mapUrl} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>

          {/* Trek Video */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
              <Video className="w-4 h-4 text-[#24a0ed]" /> Trek Video
            </h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, videoType: 'youtube' }))}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-colors ${formData.videoType === 'youtube' ? 'bg-[#24a0ed] text-white border-[#24a0ed]' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
              >
                YouTube URL
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, videoType: 'upload' }))}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-colors ${formData.videoType === 'upload' ? 'bg-[#24a0ed] text-white border-[#24a0ed]' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
              >
                Upload Video
              </button>
            </div>

            {formData.videoType === 'youtube' ? (
              <div>
                <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">YouTube Video URL</label>
                <input type="url" value={formData.videoUrl} onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                {formData.videoUrl && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <iframe
                      src={formData.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title="Video preview"
                    />
                  </div>
                )}
              </div>
            ) : (
              <MediaUploader type="video" value={formData.videoUrl} onChange={(url) => setFormData(prev => ({ ...prev, videoUrl: url }))} label="Upload Video File (MP4)" heightClass="h-36" />
            )}
          </div>

          {/* Trekking Categories (Taxonomy Checklist) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Trekking Categories</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {REGION_CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.regions.includes(cat)}
                    onChange={() => toggleRegion(cat)}
                    className="w-4 h-4 accent-[#24a0ed]"
                  />
                  <span className="font-medium text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
