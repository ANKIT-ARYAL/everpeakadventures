'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import MediaUploader from '@/app/components/admin/MediaUploader';
import RouteMapEditor, { EMPTY_ROUTE_MAP } from '@/app/components/admin/RouteMapEditor';
import FieldGrid from '@/app/components/admin/FieldGrid';
import SectionCard from '@/app/components/admin/SectionCard';
import ToggleShow from '../components/ToggleShow';
import StickySectionNav from '@/app/components/admin/StickySectionNav';

const toDateInput = (v?: string | null) => {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

interface TourFormProps {
  initialData?: any;
  isEditing?: boolean;
  categories?: { name: string; slug: string; description?: string | null; image?: string | null }[];
}

const PRIMARY_DESTINATIONS = ['Nepal', 'Bhutan', 'Tibet'];

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
  'Cultural Tours',
  'Wildlife Safaris',
  'Adventure Sports',
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

export default function TourForm({ initialData, isEditing = false, categories }: TourFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newRegion, setNewRegion] = useState('');
  const [newPrimaryDestination, setNewPrimaryDestination] = useState('');

  const categoryOptions = categories && categories.length > 0
    ? categories.map((c) => c.name)
    : REGION_CATEGORIES;

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const allOptions = [...new Set([...categoryOptions, ...customCategories])];

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    heroImage: initialData?.heroImage || initialData?.image || '',
    gallery: initialData?.gallery || [''],
    description: initialData?.description || '',
    overview: initialData?.overview || '',

    // Pricing / Quick Facts
    price: initialData?.price || 0,
    discountedPrice: initialData?.discountedPrice || 0,
    originalPrice: initialData?.originalPrice || 0,
    priceRange: initialData?.priceRange || '',
    isAllInclusive: initialData?.isAllInclusive ?? false,
    duration: initialData?.duration || '',
    bestTime: initialData?.bestTime || '',
    destination: initialData?.destination || 'nepal',
    primaryDestination: initialData?.primaryDestination || 'Nepal',
    grade: initialData?.grade || 'Easy / Moderate',
    maxAltitude: initialData?.maxAltitude || '1,350 m',
    startPoint: initialData?.startPoint || 'Kathmandu',
    endPoint: initialData?.endPoint || 'Kathmandu',
    meals: initialData?.meals || 'B.B.',
    activity: initialData?.activity || '',
    groupSize: initialData?.groupSize || '1 - 10',
    transport: initialData?.transport || '',
    rate: initialData?.rate ?? '',
    rating: initialData?.rating ?? '',
    altitudeData:
      Array.isArray(initialData?.altitudeData) && initialData.altitudeData.length > 0
        ? initialData.altitudeData
        : [{ day: 1, place: '', altitude: '', note: '' }],
    mapUrl: initialData?.mapUrl || '',
    mapImage: initialData?.mapImage || '',
    routeMap:
      initialData?.routeMap &&
      typeof initialData.routeMap === 'object' &&
      Array.isArray(initialData.routeMap.peaks)
        ? initialData.routeMap
        : { ...EMPTY_ROUTE_MAP },
    videoUrl: initialData?.videoUrl || '',
    videoType: initialData?.videoType || 'youtube',
    order: initialData?.order || 0,
    isBestSeller: initialData?.isBestSeller ?? false,

    // Region taxonomy (checkboxes)
    regions: initialData?.regions?.length
      ? initialData.regions
      : ['All Trekking Packages'],

    // SEO
    focusKeyphrase: initialData?.focusKeyphrase || '',
    seoTitle: initialData?.seoTitle || '',
    metaDescription: initialData?.metaDescription || '',

    // Group Pricing Repeater (Advanced PageManager)
    groupPrices:
      Array.isArray(initialData?.groupPrices) && initialData.groupPrices.length > 0
        ? initialData.groupPrices.map((gp: any) => ({
            groupSize: gp.groupSize || '',
            groupType: gp.groupType || 'Best Value',
            price: gp.price || '',
          }))
        : [{ groupSize: '1 - 2 Pax', groupType: 'Small Group', price: '' }],

    // Departure date slots (unified departure model)
    departures:
      Array.isArray(initialData?.departures) && initialData.departures.length > 0
        ? initialData.departures.map((fs: any) => ({
            startDate: toDateInput(fs.startDate),
            endDate: toDateInput(fs.endDate),
            groupSize: fs.groupSize || '',
            status: fs.status || 'Guaranteed',
            seatsLeft: fs.seatsLeft ?? 12,
            recurring: !!fs.recurring,
          }))
        : [{ startDate: '', endDate: '', groupSize: '2 - 12 Pax', status: 'Guaranteed', seatsLeft: 12, recurring: false }],

    highlights: initialData?.highlights || '',
    inclusions: initialData?.inclusions || '',
    exclusions: initialData?.exclusions || '',
    packingList: initialData?.packingList || '',
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
        name === 'order' || name === 'price' || name === 'discountedPrice' || name === 'originalPrice' || name === 'rate' || name === 'rating'
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
  const handleScheduleChange = (index: number, key: string, value: string | boolean) => {
    setFormData(prev => {
      const updated = [...prev.departures];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, departures: updated };
    });
  };

  const addScheduleRow = () => {
    setFormData(prev => ({
      ...prev,
      departures: [...prev.departures, { startDate: '', endDate: '', groupSize: '', status: 'Guaranteed', seatsLeft: 12, recurring: false }],
    }));
  };

  const removeScheduleRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      departures: prev.departures.filter((_: any, i: number) => i !== index),
    }));
  };

  // --- Region Taxonomy ---
  const toggleRegion = (cat: string) => {
    setFormData(prev => {
      const has = prev.regions.includes(cat);
      const regions = has ? prev.regions.filter((r: string) => r !== cat) : [...prev.regions, cat];
      return { ...prev, regions };
    });
  };

  const addNewRegion = () => {
    const v = newRegion.trim();
    if (v && !allOptions.includes(v)) setCustomCategories(prev => [...prev, v]);
    if (v && !formData.regions.includes(v)) toggleRegion(v);
    setNewRegion('');
  };

  const addNewPrimaryDestination = () => {
    if (newPrimaryDestination.trim() && !PRIMARY_DESTINATIONS.includes(newPrimaryDestination.trim())) {
      setFormData(prev => ({ ...prev, primaryDestination: newPrimaryDestination.trim() }));
      setNewPrimaryDestination('');
    }
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

  const removeAltitudeDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      altitudeData: prev.altitudeData.filter((_: any, i: number) => i !== index).map((item: any, idx: number) => ({ ...item, day: idx + 1 })),
    }));
  };

  const addAltitudeDay = () => {
    setFormData(prev => ({
      ...prev,
      altitudeData: [...prev.altitudeData, { day: prev.altitudeData.length + 1, place: '', altitude: '', note: '' }],
    }));
  };

  const handleAltitudeChange = (index: number, key: string, value: any) => {
    setFormData(prev => {
      const updated = [...prev.altitudeData];
      updated[index][key] = value;
      return { ...prev, altitudeData: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanGroupPrices = formData.groupPrices.filter(
        (g: any) => g.groupSize.trim() !== '' || g.price.trim() !== ''
      );
      const cleanSchedules = formData.departures.filter((s: any) => s.startDate.trim() !== '');

      const payload = {
        ...formData,
        gallery: formData.gallery.filter((i: string) => i.trim() !== ''),
        groupPrices: cleanGroupPrices,
        departures: cleanSchedules,
        price: derived.priceFrom || Number(formData.price) || 0,
        originalPrice: derived.originalPrice || Number(formData.price) || 0,
        priceRange: derived.range,
        duration: derived.durationDays ? `${derived.durationDays}` : formData.duration || '0 Days',
        groupSize: derived.groupSize,
        maxAltitude: derived.maxAltitude,
      };

      const url = isEditing ? `/api/admin/tours/${initialData?.id}` : '/api/admin/tours';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save tour package');

      router.push('/admin/tours');
      router.refresh();
    } catch (error) {
      alert('Error saving tour package.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Live-derived preview computation ----
  const parseUsd = (s?: string | null): number => {
    const n = Number(String(s ?? '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const parsePax = (s?: string): { min: number; max: number } => {
    const nums = (String(s ?? '').match(/\d+/g) || []).map(Number);
    if (nums.length === 0) return { min: 0, max: 0 };
    return { min: Math.min(...nums), max: Math.max(...nums) };
  };
  const fmtUsd = (n: number): string => (n > 0 ? 'US$ ' + n.toLocaleString('en-US') : '—');

  const derived = useMemo(() => {
    const groupPrices = (formData.groupPrices || []).filter((g: any) => parseUsd(g.price) > 0);
    const prices = groupPrices.map((g: any) => parseUsd(g.price));
    const paxes = (formData.groupPrices || []).map((g: any) => parsePax(g.groupSize));
    const paxMins = paxes.map((p: { min: number; max: number }) => p.min).filter((n: number) => n > 0);
    const paxMaxs = paxes.map((p: { min: number; max: number }) => p.max).filter((n: number) => n > 0);
    const itineraryDays = Array.isArray(formData.itinerary) ? formData.itinerary.filter((d: any) => d && (d.title || d.desc || d.elev)).length : 0;
    const altitudes = (Array.isArray(formData.itinerary) ? formData.itinerary : [])
      .map((d: any) => Number(d.elev || 0))
      .filter((n: number) => n > 0);
    const priceFrom = prices.length ? Math.min(...prices) : (parseUsd(String(formData.discountedPrice)) || Number(formData.price) || 0);
    const original = parseUsd(String(formData.originalPrice));
    const range =
      prices.length > 1
        ? `US$ ${Math.min(...prices).toLocaleString('en-US')} - US$ ${Math.max(...prices).toLocaleString('en-US')}`
        : prices.length === 1
          ? `US$ ${priceFrom.toLocaleString('en-US')}`
          : formData.priceRange;

    return {
      priceFrom,
      originalPrice: original,
      saveAmount: original > priceFrom ? original - priceFrom : 0,
      range,
      groupSize:
        paxMins.length && paxMaxs.length
          ? (Math.min(...paxMins) === Math.max(...paxMaxs)
              ? `${Math.min(...paxMins)} Pax`
              : `${Math.min(...paxMins)} - ${Math.max(...paxMaxs)} Pax`)
          : '—',
      durationDays: itineraryDays,
      maxAltitude: altitudes.length ? `${Math.max(...altitudes).toLocaleString('en-US')} M` : '—',
    };
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto space-y-6 pb-20 text-xs font-sans text-gray-800">
      {/* Top Header Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/tours" className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black text-[#112233] oswald uppercase tracking-wider">
            {isEditing ? `Edit Tour: ${initialData?.title}` : 'Add New Tour Package'}
          </h1>
        </div>

        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          {isEditing && <ToggleShow model="tours" resource="tours" id={initialData?.id as string} published={initialData?.published ?? true} />}
          {isEditing && formData.slug && (
            <Link
              href={`/tour/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors uppercase tracking-wider"
            >
              <ExternalLink className="w-4 h-4" /> View Live
            </Link>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Tour' : 'Publish Tour')}
          </button>
        </div>
      </div>

      <StickySectionNav sections={['Overview', 'Pricing & Booking', 'Itinerary', 'Inclusions', 'Route Map', 'Media', 'Categories', 'SEO']} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============ LEFT / MAIN COLUMN ============ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Overview group */}
          <div id="sec-overview" className="space-y-6 scroll-mt-24">
          <SectionCard title="Title & Permalink" defaultOpen>
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
              <TipTapEditor value={formData.description} onChange={(html) => setFormData(prev => ({ ...prev, description: html }))} placeholder="Short excerpt shown on cards..." minHeight="80px" />
            </div>
          </SectionCard>

          <SectionCard title="Trip Overview / Description">
            <TipTapEditor value={formData.overview} onChange={(html) => setFormData(prev => ({ ...prev, overview: html }))} placeholder="Full descriptive overview of the trek..." minHeight="200px" />
          </SectionCard>

          <SectionCard title="Highlights">
            <TipTapEditor value={formData.highlights} onChange={(html) => setFormData(prev => ({ ...prev, highlights: html }))} placeholder="Enter trek highlights..." minHeight="120px" />
            <p className="text-[10px] text-gray-400">Use the bullet list button for each highlight.</p>
          </SectionCard>
          </div>

          {/* Pricing & Booking group */}
          <div id="sec-pricing-booking" className="space-y-6 scroll-mt-24">
          <SectionCard title="Advanced Pricing / Group Price">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider">Advanced Pricing / Group Price</h3>
              <button type="button" onClick={addGroupPriceRow} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            {/* Desktop: Table-like Grid | Mobile: Stacked Cards */}
            <div className="space-y-3">
              {/* Desktop Header */}
              <div className="hidden lg:grid grid-cols-4 gap-3 px-3 py-2 bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-bold rounded-t-lg border-b border-gray-100">
                <span>Pax / No. of Persons</span>
                <span>Group Type</span>
                <span>Price per Person</span>
                <span className="text-right">Action</span>
              </div>

              {formData.groupPrices.map((g: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 lg:bg-transparent lg:rounded-none lg:border-t lg:border-gray-100 lg:p-2">
                  <FieldGrid cols={4} className="items-end">
                  <div>
                    <label className="lg:hidden block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pax / No. of Persons</label>
                    <input type="text" value={g.groupSize} onChange={(e) => handleGroupPriceChange(idx, 'groupSize', e.target.value)} placeholder="2 - 4 Pax" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="lg:hidden block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Group Type</label>
                    <select value={g.groupType} onChange={(e) => handleGroupPriceChange(idx, 'groupType', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
                      <option>Small Group</option>
                      <option>Best Value</option>
                      <option>Super Group</option>
                    </select>
                  </div>
                  <div>
                    <label className="lg:hidden block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price per Person</label>
                    <input type="text" value={g.price} onChange={(e) => handleGroupPriceChange(idx, 'price', e.target.value)} placeholder="US$ 2,599" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeGroupPriceRow(idx)} className="text-red-500 p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  </FieldGrid>
                </div>
              ))}

              {formData.groupPrices.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No group pricing rows yet. Click "Add Row" to add pricing tiers.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Group Date Schedule / Departure Slots">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider">Group Date Schedule / Departure Slots</h3>
              <button type="button" onClick={addScheduleRow} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
            <p className="text-gray-400 text-[11px] -mt-2">Pick real dates with the calendar. Checking "Every Year" auto-creates an instance for each of the next 2 years.</p>

            {formData.departures.map((s: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-end gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 relative">
                <div>
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Start Date</label>
                  <input type="date" value={s.startDate} onChange={(e) => handleScheduleChange(idx, 'startDate', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">End Date</label>
                  <input type="date" value={s.endDate} onChange={(e) => handleScheduleChange(idx, 'endDate', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                </div>
                <div className="min-w-[120px]">
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Group Size</label>
                  <input type="text" value={s.groupSize} onChange={(e) => handleScheduleChange(idx, 'groupSize', e.target.value)} placeholder="2 - 12 Pax" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Status</label>
                  <select value={s.status} onChange={(e) => handleScheduleChange(idx, 'status', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
                    <option>Guaranteed</option>
                    <option>Available</option>
                    <option>Filling Fast</option>
                    <option>Sold Out</option>
                  </select>
                </div>
                <div className="w-20">
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Seats</label>
                  <input type="number" value={s.seatsLeft} onChange={(e) => handleScheduleChange(idx, 'seatsLeft', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                </div>
                <label className="flex items-center gap-1.5 pb-2 text-[11px] font-bold text-gray-600">
                  <input type="checkbox" checked={s.recurring} onChange={(e) => handleScheduleChange(idx, 'recurring', e.target.checked)} className="w-4 h-4 accent-[#24a0ed]" />
                  Every Year
                </label>
                <button type="button" onClick={() => removeScheduleRow(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded flex items-center gap-1 font-bold">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            ))}
          </SectionCard>
          </div>

          {/* Itinerary group */}
          <div id="sec-itinerary" className="space-y-6 scroll-mt-24">
          <SectionCard title="Day-by-Day Itinerary">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider">Day-by-Day Itinerary</h3>
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
                <FieldGrid cols={4}>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Starting Point</label>
                    <input type="text" value={dayObj.startPoint ?? ''} onChange={(e) => handleItineraryChange(idx, 'startPoint', e.target.value)} placeholder="Kathmandu" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Ending Point</label>
                    <input type="text" value={dayObj.endPoint ?? ''} onChange={(e) => handleItineraryChange(idx, 'endPoint', e.target.value)} placeholder="Phakding" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Distance</label>
                    <input type="text" value={dayObj.distance ?? ''} onChange={(e) => handleItineraryChange(idx, 'distance', e.target.value)} placeholder="Approx. 8 km" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Duration / Hours</label>
                    <input type="text" value={dayObj.hours ?? ''} onChange={(e) => handleItineraryChange(idx, 'hours', e.target.value)} placeholder="30-minute flight &amp; 3-4 hrs trek" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                </FieldGrid>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Elevation (metres)</label>
                    <input type="number" value={dayObj.elev ?? ''} onChange={(e) => handleItineraryChange(idx, 'elev', Number(e.target.value))} placeholder="e.g. 3440" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                </div>
                <TipTapEditor value={dayObj.desc} onChange={(html) => handleItineraryChange(idx, 'desc', html)} placeholder="Day description (focus line)..." />
                <div>
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Important Note</label>
                  <input type="text" value={dayObj.note ?? ''} onChange={(e) => handleItineraryChange(idx, 'note', e.target.value)} placeholder="e.g. Keep your day flexible." className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Day Gallery Images</label>
                  <div className="space-y-2">
                    {(Array.isArray(dayObj.gallery) ? dayObj.gallery : dayObj.gallery ? [dayObj.gallery] : []).map((gUrl: string, gi: number) => (
                      <MediaUploader
                        key={gi}
                        value={gUrl}
                        onChange={(url) => {
                          const arr: string[] = Array.isArray(dayObj.gallery) ? [...dayObj.gallery] : [];
                          arr[gi] = url;
                          handleItineraryChange(idx, 'gallery', arr.filter(Boolean));
                        }}
                        heightClass="h-28"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const arr: string[] = Array.isArray(dayObj.gallery) ? [...dayObj.gallery] : [];
                        arr.push('');
                        handleItineraryChange(idx, 'gallery', arr);
                      }}
                      className="text-[#24a0ed] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Image
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Altitude Chart (Day Wise)">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider">Tour Details Page Manager - Altitude Chart Addon</h3>
              <button type="button" onClick={addAltitudeDay} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Day
              </button>
            </div>
            <p className="text-gray-400 text-[11px] -mt-2">Use day number to control order. Empty rows are ignored on save.</p>
            {formData.altitudeData.map((ad: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Day {ad.day || idx + 1}</span>
                  {formData.altitudeData.length > 1 && (
                    <button type="button" onClick={() => removeAltitudeDay(idx)} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>
                <FieldGrid cols={3}>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Place</label>
                    <input type="text" value={ad.place ?? ''} onChange={(e) => handleAltitudeChange(idx, 'place', e.target.value)} placeholder="e.g. Koto" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Altitude (m)</label>
                    <input type="text" value={ad.altitude ?? ''} onChange={(e) => handleAltitudeChange(idx, 'altitude', e.target.value)} placeholder="e.g. 1300" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Day Note</label>
                    <input type="text" value={ad.note ?? ''} onChange={(e) => handleAltitudeChange(idx, 'note', e.target.value)} placeholder="Arrival and trek..." className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                </FieldGrid>
              </div>
            ))}
          </SectionCard>
          </div>

          {/* Inclusions group */}
          <div id="sec-inclusions" className="space-y-6 scroll-mt-24">
          <SectionCard title="Package Inclusions">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-emerald-700 uppercase tracking-wider">Package Inclusions</h3>
            </div>
            <TipTapEditor value={formData.inclusions} onChange={(html) => setFormData(prev => ({ ...prev, inclusions: html }))} placeholder="Enter what is included in the package..." minHeight="150px" />
            <p className="text-[10px] text-gray-400">Use the bullet list button for each inclusion.</p>
          </SectionCard>

          <SectionCard title="Package Exclusions">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-rose-700 uppercase tracking-wider">Package Exclusions</h3>
            </div>
            <TipTapEditor value={formData.exclusions} onChange={(html) => setFormData(prev => ({ ...prev, exclusions: html }))} placeholder="Enter what is excluded from the package..." minHeight="150px" />
            <p className="text-[10px] text-gray-400">Use the bullet list button for each exclusion.</p>
          </SectionCard>

          <SectionCard title="Equipment & Trekking Gears">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider">Equipment &amp; Trekking Gears</h3>
            </div>
            <TipTapEditor value={formData.packingList} onChange={(html) => setFormData(prev => ({ ...prev, packingList: html }))} placeholder="Enter required equipment & packing list..." minHeight="150px" />
            <p className="text-[10px] text-gray-400">Use the bullet list button for each gear item.</p>
          </SectionCard>
          </div>

          {/* Route Map group */}
          <div id="sec-route-map" className="scroll-mt-24">
          <RouteMapEditor
            value={formData.routeMap}
            onChange={(v) => setFormData(prev => ({ ...prev, routeMap: v }))}
          />
          </div>

          {/* Media group */}
          <div id="sec-media" className="scroll-mt-24">
          <SectionCard title="Trek Gallery Slider">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#24a0ed]" /> Trek Gallery Slider
              </h3>
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
          </SectionCard>
          </div>
        </div>

        {/* ============ RIGHT SIDEBAR ============ */}
        <div className="space-y-6">

          {/* Media group */}
          <div id="sec-media" className="scroll-mt-24">
          <SectionCard title="Featured Image">
            <MediaUploader value={formData.heroImage} onChange={(url) => setFormData(prev => ({ ...prev, heroImage: url }))} heightClass="h-44" />
          </SectionCard>

          <SectionCard title="Pricing & Quick Facts">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px]">On-Page Preview</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Auto from Itinerary &amp; Pricing</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Price / Person</div>
                  <div className="text-base font-extrabold text-[#24a0ed]">{fmtUsd(derived.priceFrom)}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">You Save</div>
                  <div className="text-base font-extrabold text-emerald-600">
                    {derived.saveAmount > 0 ? fmtUsd(derived.saveAmount) : '—'}
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Price Range</div>
                  <div className="font-bold text-emerald-800 truncate">{derived.range || '—'}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Group Size</div>
                  <div className="font-bold text-emerald-800">{derived.groupSize}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Duration</div>
                  <div className="font-bold text-emerald-800">
                    {derived.durationDays > 0 ? `${derived.durationDays} Days` : '—'}
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Max Altitude</div>
                  <div className="font-bold text-emerald-800">{derived.maxAltitude}</div>
                </div>
              </div>
              <p className="text-[10px] text-emerald-700 leading-snug">
                Computed live from the Pricing Matrix below and itinerary days/elevations. Regular (strikethrough) price below is manual.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Regular Price</label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="2975" className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-400" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Destination</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Primary Destination</label>
                <select name="primaryDestination" value={formData.primaryDestination} onChange={(e) => setFormData(prev => ({ ...prev, primaryDestination: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold">
                  {PRIMARY_DESTINATIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Grade</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g. Strenuous" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Start Point</label>
                <input type="text" name="startPoint" value={formData.startPoint} onChange={handleChange} placeholder="Start" className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">End Point</label>
                <input type="text" name="endPoint" value={formData.endPoint} onChange={handleChange} placeholder="End" className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Meals</label>
                <input type="text" name="meals" value={formData.meals} onChange={handleChange} placeholder="BLD" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Activity</label>
                <input type="text" name="activity" value={formData.activity} onChange={handleChange} placeholder="Trekking" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Transport</label>
                <input type="text" name="transport" value={formData.transport} onChange={handleChange} placeholder="Flight / Bus" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rating Number</label>
                <input type="number" step="0.01" name="rate" value={formData.rate} onChange={handleChange} placeholder="e.g. 4.8" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rating out of 5</label>
                <input type="number" step="0.01" name="rating" value={formData.rating} onChange={handleChange} placeholder="e.g. 5" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
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
              <label className="block font-bold text-gray-700 mb-1">Elevation Map Image</label>
              <MediaUploader value={formData.mapUrl} onChange={(url) => setFormData(prev => ({ ...prev, mapUrl: url }))} label="Upload Elevation Map Image" heightClass="h-36" />
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Route Map Image</label>
              <p className="text-[10px] text-gray-400 mb-2">Upload a map graphic (JPG/PNG/WebP). Shown above the elevation chart on the tour page.</p>
              <MediaUploader
                type="image"
                value={formData.mapImage}
                onChange={(url) => setFormData(prev => ({ ...prev, mapImage: url }))}
                label="Upload Route Map Image"
                heightClass="h-48"
              />
            </div>
          </SectionCard>

          <SectionCard title="Trek Video">
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
          </SectionCard>
          </div>

          {/* Categories group */}
          <div id="sec-categories" className="scroll-mt-24">
          <SectionCard title="Trekking Categories">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider">Trekking Categories</h3>
              <Link href="/admin/tour-categories" className="text-[#24a0ed] font-bold text-xs hover:underline flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Manage Categories
              </Link>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {allOptions.map((cat) => (
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
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <input
                type="text"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNewRegion(); } }}
                placeholder="Add a new category name…"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#24a0ed]"
              />
              <button type="button" onClick={addNewRegion} className="bg-[#112233] text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-[#1e3a52]">
                + Add
              </button>
            </div>
          </SectionCard>
          </div>

          {/* SEO group */}
          <div id="sec-seo" className="scroll-mt-24">
          <SectionCard title="SEO Meta Box">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Focus Keyphrase</label>
              <input
                type="text"
                name="focusKeyphrase"
                value={formData.focusKeyphrase}
                onChange={handleChange}
                placeholder="e.g. Everest Base Camp Trek"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="SEO title (max ~60 characters)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Meta description (max ~160 characters)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </SectionCard>
          </div>

        </div>
      </div>
    </form>
  );
}