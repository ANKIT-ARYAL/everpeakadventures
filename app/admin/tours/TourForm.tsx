/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import PackingItemSelector from '@/app/admin/components/PackingItemSelector';
import MediaUploader from '@/app/components/admin/MediaUploader';
import FieldGrid from '@/app/components/admin/FieldGrid';
import SectionCard from '@/app/components/admin/SectionCard';
import ToggleShow from '../components/ToggleShow';
import StickySectionNav from '@/app/components/admin/StickySectionNav';
import NumberInput from '@/app/components/NumberInput';

const toDateInput = (v?: string | null) => {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

interface TourFormProps {
  initialData?: any;
  isEditing?: boolean;
  categories?: {
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
  }[];
  activities?: {
    slug: string;
    title: string;
  }[];
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

export default function TourForm({
  initialData,
  isEditing = false,
  categories,
  activities = [],
}: TourFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newRegion, setNewRegion] = useState('');

  const parseSelectedActivities = (value: string | null | undefined) =>
    (value || '')
      .split(/[,/]+/)
      .map((item) => item.trim())
      .filter(Boolean);

  const activityOptions = useMemo(() => {
    // Only use activities provided by the Activities admin table (activities prop).
    // Do not fall back to hard-coded defaults — the user requested the list match the Activities admin.
    const values = activities.map((activity) => ({ slug: activity.slug, title: activity.title }));

    const seen = new Set<string>();
    return values.filter((option) => {
      const key = (option.title || option.slug || '').toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [activities]);

  const dynamicSlugMap = categories && categories.length > 0
    ? Object.fromEntries(categories.map((c) => [c.name, c.slug]))
    : REGION_SLUGS;

  const categoryOptions = categories && categories.length > 0
    ? categories.map((c) => c.name)
    : REGION_CATEGORIES;

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const allOptions = [...new Set([...categoryOptions, ...customCategories])];

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    heroImage: initialData?.heroImage || '',
    gallery: initialData?.gallery || [''],
    description: initialData?.description || '',
    overview: initialData?.overview || '',

    // Pricing & Quick Facts matching Prisma Schema
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
    routeMap: initialData?.routeMap ?? null,
    videoUrl: initialData?.videoUrl || '',
    videoType: initialData?.videoType || 'youtube',
    order: initialData?.order || 0,
    isBestSeller: initialData?.isBestSeller ?? false,
    isPopular: initialData?.isPopular ?? false,

    regions: initialData?.regions?.length
      ? initialData.regions
      : ['All Trekking Packages'],

    focusKeyphrase: initialData?.focusKeyphrase || '',
    seoTitle: initialData?.seoTitle || '',
    metaDescription: initialData?.metaDescription || '',

    groupPrices:
      Array.isArray(initialData?.groupPrices) && initialData.groupPrices.length > 0
        ? initialData.groupPrices.map((gp: any) => ({
            groupSize: gp.groupSize || '',
            groupType: gp.groupType || 'Best Value',
            price: gp.price || '',
          }))
        : [{ groupSize: '1 - 2 Pax', groupType: 'Small Group', price: '' }],

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
        : [{ startDate: '', endDate: '', groupSize: '1 - 10 Pax', status: 'Guaranteed', seatsLeft: 12, recurring: false }],

    highlights: initialData?.highlights || '',
    inclusions: initialData?.inclusions || '',
    exclusions: initialData?.exclusions || '',
    packingList: initialData?.packingList || '',
    packingItemIds: (initialData?.packingItems || []).map((item: { id: string }) => item.id) as string[],
    
    itinerary:
      Array.isArray(initialData?.itinerary) && initialData.itinerary.length > 0
        ? initialData.itinerary
        : [{ day: 1, title: '', desc: '', elev: 0 }],

    reviews:
      Array.isArray(initialData?.reviews) && initialData.reviews.length > 0
        ? initialData.reviews
        : [{ name: '', location: '', rating: 5, avatar: '', comment: '' }],
  });

  const selectedActivities = useMemo(
    () => parseSelectedActivities(formData.activity),
    [formData.activity],
  );

  const toggleActivity = (label: string) => {
    setFormData((prev) => {
      const next = parseSelectedActivities(prev.activity);
      const exists = next.includes(label);
      const updated = exists
        ? next.filter((item) => item !== label)
        : [...next, label];

      return { ...prev, activity: updated.join(', ') };
    });
  };

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

  const handleGroupPriceChange = (index: number, key: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.groupPrices];
      updated[index] = { ...updated[index], [key]: value };
      
      if (key === 'groupType') {
        if (value === 'Private') updated[index].groupSize = '1 person';
        else if (value === 'Small Group') updated[index].groupSize = '2-4 people';
        else if (value === 'Best Value') updated[index].groupSize = '5-9 people';
        else if (value === 'Super Group') updated[index].groupSize = '10+ people';
      }
      
      return { ...prev, groupPrices: updated };
    });
  };

  const addGroupPriceRow = () => {
    setFormData(prev => ({
      ...prev,
      groupPrices: [...prev.groupPrices, { groupSize: '5-9 people', groupType: 'Best Value', price: '' }],
    }));
  };

  const removeGroupPriceRow = (index: number) => {
    setFormData(prev => ({ ...prev, groupPrices: prev.groupPrices.filter((_: any, i: number) => i !== index) }));
  };

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

  const toggleRegion = (cat: string) => {
    setFormData(prev => {
      const has = prev.regions.includes(cat);
      const regions = has ? prev.regions.filter((r: string) => r !== cat) : [...prev.regions, cat];
      const specific = regions.filter((r: string) => r !== 'All Trekking Packages');
      const primary = specific.length > 0 ? specific[specific.length - 1] : regions[regions.length - 1] || '';
      const primaryDestination = regions.find((r: string) => PRIMARY_DESTINATIONS.includes(r)) || prev.primaryDestination;
      const newDestination = primary ? (dynamicSlugMap[primary] || slugify(primary)) : prev.destination;

      return { ...prev, regions, primaryDestination, destination: newDestination };
    });
  };

  const addNewRegion = async () => {
    const v = newRegion.trim();
    if (!v) return;
    const existsInDb = categoryOptions.includes(v);
    if (!existsInDb && !customCategories.includes(v)) {
      setCustomCategories(prev => [...prev, v]);
      try {
        await fetch('/api/tour-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: v }),
        });
      } catch (err) {
        console.error(err);
      }
    }
    if (!formData.regions.includes(v)) toggleRegion(v);
    setNewRegion('');
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

  const handleReviewChange = (index: number, key: string, value: any) => {
    setFormData(prev => {
      const updated = [...prev.reviews];
      updated[index][key] = value;
      return { ...prev, reviews: updated };
    });
  };

  const addReview = () => {
    setFormData(prev => ({
      ...prev,
      reviews: [...prev.reviews, { name: '', location: '', rating: 5, avatar: '', comment: '' }],
    }));
  };

  const removeReview = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reviews: prev.reviews.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanGroupPrices = (formData.groupPrices || []).filter((g: any) => {
        const groupSize = String(g?.groupSize ?? '').trim();
        const price = String(g?.price ?? '').trim();
        return groupSize !== '' || price !== '';
      });
      const cleanSchedules = (formData.departures || []).filter((s: any) => {
        const startDate = String(s?.startDate ?? '').trim();
        return startDate !== '';
      });

      const payload: Record<string, any> = {
        ...formData,
        gallery: (formData.gallery || []).filter((i: string) => String(i ?? '').trim() !== ''),
        groupPrices: cleanGroupPrices,
        departures: cleanSchedules,
        price: derived.priceFrom || Number(formData.price) || 0,
        originalPrice: derived.originalPrice || Number(formData.originalPrice) || Number(formData.price) || 0,
        priceRange: derived.range,
        duration: derived.durationDays ? `${derived.durationDays}` : formData.duration || '0 Days',
        groupSize: derived.groupSize,
        maxAltitude: derived.maxAltitude,
        activity: selectedActivities.join(', ') || null,
        packingItemIds: formData.packingItemIds,
      };

      const url = isEditing ? `/api/admin/tours/${initialData?.id}` : '/api/admin/tours';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || errorData.message || 'Failed to save tour package');
      }

      router.push('/admin/tours');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error saving tour package.');
    } finally {
      setLoading(false);
    }
  };

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
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 pb-20 text-md font-sans text-gray-800 min-w-0">

      {/* Top Header Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Link href="/admin/tours" className="self-start sm:self-auto p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-black text-[#112233] oswald uppercase tracking-wider">
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
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors uppercase tracking-wider text-xs sm:text-sm"
            >
              <ExternalLink className="w-4 h-4" /> View Live
            </Link>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Tour' : 'Publish Tour')}
          </button>
        </div>
      </div>

      <div className="hidden xl:block">
        <StickySectionNav sections={['Overview', 'Pricing & Booking', 'Itinerary', 'Inclusions', 'Reviews', 'Media', 'Categories', 'SEO']} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">

        {/* ============ LEFT / MAIN COLUMN ============ */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">

          <div id="sec-overview" className="space-y-6 scroll-mt-24">
            <SectionCard title="Title & Permalink" defaultOpen>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none focus:border-[#24a0ed]" />
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
              <TipTapEditor value={formData.overview} onChange={(html) => setFormData(prev => ({ ...prev, overview: html }))} placeholder="Full descriptive overview of the tour..." minHeight="200px" />
            </SectionCard>


            <SectionCard title="Highlights">
              <TipTapEditor value={formData.highlights} onChange={(html) => setFormData(prev => ({ ...prev, highlights: html }))} placeholder="Enter tour highlights..." minHeight="120px" />
              <p className="text-[10px] text-gray-400">Use the bullet list button for each highlight.</p>
            </SectionCard>
          </div>

          <div id="sec-pricing-booking" className="space-y-6 scroll-mt-24">
            <SectionCard title="Advanced Pricing / Group Price">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-800 uppercase tracking-wider">Advanced Pricing / Group Price</h3>
                <button type="button" onClick={addGroupPriceRow} className="text-[#24a0ed] font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              <div className="space-y-3">
                <div className="hidden xl:grid grid-cols-4 gap-3 px-3 py-2 bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-bold rounded-t-lg border-b border-gray-100">
                  <span>Group Type</span>
                  <span>Pax / No. of Persons</span>
                  <span>Price per Person</span>
                  <span className="text-right">Action</span>
                </div>

                {formData.groupPrices.map((g: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 xl:bg-transparent xl:rounded-none xl:border-t xl:border-gray-100 xl:p-2">
                    <FieldGrid cols={4} className="items-end">
                      <div>
                        <label className="xl:hidden block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Group Type</label>
                        <select value={g.groupType} onChange={(e) => handleGroupPriceChange(idx, 'groupType', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
                          <option>Private</option>
                          <option>Small Group</option>
                          <option>Best Value</option>
                          <option>Super Group</option>
                        </select>
                      </div>
                      <div>
                        <label className="xl:hidden block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pax / No. of Persons</label>
                        <input type="text" value={g.groupSize} readOnly disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="xl:hidden block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price per Person</label>
                        <input type="text" value={g.price} onChange={(e) => handleGroupPriceChange(idx, 'price', e.target.value)} placeholder="US$ 1,599" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                      </div>
                      <div className="flex justify-end">
                        <button type="button" onClick={() => removeGroupPriceRow(idx)} className="text-red-500 p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </FieldGrid>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Group Date Schedule / Departure Slots">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-800 uppercase tracking-wider">Group Date Schedule / Departure Slots</h3>
                <button type="button" onClick={addScheduleRow} className="text-[#24a0ed] font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

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
                    <select value={s.groupSize} onChange={(e) => handleScheduleChange(idx, 'groupSize', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
                      <option value="">Select Size...</option>
                      <option value="1 Person (Private)">1 Person (Private)</option>
                      <option value="2-4 Persons (Small Group)">2-4 Persons (Small Group)</option>
                      <option value="5-9 Persons (Best Value)">5-9 Persons (Best Value)</option>
                      <option value="10+ Persons (Super Group)">10+ Persons (Super Group)</option>
                    </select>
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
                    <NumberInput type="number" value={s.seatsLeft} onChange={(e) => handleScheduleChange(idx, 'seatsLeft', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  </div>
                  <button type="button" onClick={() => removeScheduleRow(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded flex items-center gap-1 font-bold">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ))}
            </SectionCard>
          </div>

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
                  <input type="text" value={dayObj.title} onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)} placeholder="Day title..." className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                  <FieldGrid cols={4}>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Starting Point</label>
                      <input type="text" value={dayObj.startPoint ?? ''} onChange={(e) => handleItineraryChange(idx, 'startPoint', e.target.value)} placeholder="Kathmandu" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Ending Point</label>
                      <input type="text" value={dayObj.endPoint ?? ''} onChange={(e) => handleItineraryChange(idx, 'endPoint', e.target.value)} placeholder="Pokhara" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Distance</label>
                      <input type="text" value={dayObj.distance ?? ''} onChange={(e) => handleItineraryChange(idx, 'distance', e.target.value)} placeholder="Approx. 200 km" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Duration / Hours</label>
                      <input type="text" value={dayObj.hours ?? ''} onChange={(e) => handleItineraryChange(idx, 'hours', e.target.value)} placeholder="6-7 hrs drive" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                    </div>
                  </FieldGrid>
                  <TipTapEditor value={dayObj.desc} onChange={(html) => handleItineraryChange(idx, 'desc', html)} placeholder="Day description..." minHeight="100px" />
                </div>
              ))}
            </SectionCard>

            <SectionCard title="Altitude Chart (Day Wise)">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-800 uppercase tracking-wider">Altitude Chart Addon</h3>
                <button type="button" onClick={addAltitudeDay} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Day
                </button>
              </div>
              {formData.altitudeData.map((ad: any, idx: number) => (
                <div key={idx} className="p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 relative">
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
                      <input type="text" value={ad.place ?? ''} onChange={(e) => handleAltitudeChange(idx, 'place', e.target.value)} placeholder="Place name" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Altitude (m)</label>
                      <input type="text" value={ad.altitude ?? ''} onChange={(e) => handleAltitudeChange(idx, 'altitude', e.target.value)} placeholder="1,350 m" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Day Note</label>
                      <input type="text" value={ad.note ?? ''} onChange={(e) => handleAltitudeChange(idx, 'note', e.target.value)} placeholder="Note..." className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
                    </div>
                  </FieldGrid>
                </div>
              ))}
            </SectionCard>
          </div>

          <div id="sec-inclusions" className="space-y-6 scroll-mt-24">
            <SectionCard title="Package Inclusions">
              <TipTapEditor value={formData.inclusions} onChange={(html) => setFormData(prev => ({ ...prev, inclusions: html }))} placeholder="Enter inclusions..." minHeight="150px" />
            </SectionCard>

            <SectionCard title="Package Exclusions">
              <TipTapEditor value={formData.exclusions} onChange={(html) => setFormData(prev => ({ ...prev, exclusions: html }))} placeholder="Enter exclusions..." minHeight="150px" />
            </SectionCard>

            <SectionCard title="Packing List Items">
              <PackingItemSelector
                selectedIds={formData.packingItemIds}
                onChange={(ids) => setFormData(prev => ({ ...prev, packingItemIds: ids }))}
              />
            </SectionCard>
          </div>

          <div id="sec-reviews" className="scroll-mt-24">
            <SectionCard title="Client Reviews">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h3 className="font-bold text-gray-800 uppercase tracking-wider">Reviews</h3>
                <button
                  type="button"
                  onClick={addReview}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#24a0ed] hover:text-white border border-[#24a0ed] hover:bg-[#24a0ed] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Review
                </button>
              </div>

              <div className="space-y-4">
                {formData.reviews.map((rev: any, idx: number) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-700">Review {idx + 1}</div>
                      <button type="button" onClick={() => removeReview(idx)} className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <FieldGrid>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                        <input type="text" value={rev.name} onChange={(e) => handleReviewChange(idx, 'name', e.target.value)} placeholder="John Doe" className="w-full px-3 py-2 border border-gray-200 rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rating (1-5)</label>
                        <input type="number" min="1" max="5" value={rev.rating} onChange={(e) => handleReviewChange(idx, 'rating', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required />
                      </div>
                    </FieldGrid>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Comment</label>
                      <textarea value={rev.comment} onChange={(e) => handleReviewChange(idx, 'comment', e.target.value)} rows={3} placeholder="Write comment..." className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none" required />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div id="sec-media" className="scroll-mt-24">
            <SectionCard title="Tour Gallery Slider">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#24a0ed]" /> Tour Gallery Slider
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
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start min-w-0 admin-right-scrollable">

          <SectionCard title="Featured Image">
            <MediaUploader value={formData.heroImage} onChange={(url) => setFormData(prev => ({ ...prev, heroImage: url }))} heightClass="h-44" />
          </SectionCard>

          <SectionCard title="Pricing & Quick Facts">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px]">On-Page Preview</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Auto</span>
              </div>
              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Regular Price</label>
                <NumberInput type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="1595" className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Destination Slug</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Primary Destination</label>
                <select name="primaryDestination" value={formData.primaryDestination} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold bg-white">
                  {PRIMARY_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Grade</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g. Easy" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Start Point</label>
                <input type="text" name="startPoint" value={formData.startPoint} onChange={handleChange} placeholder="Kathmandu" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">End Point</label>
                <input type="text" name="endPoint" value={formData.endPoint} onChange={handleChange} placeholder="Kathmandu" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Meals</label>
                <input type="text" name="meals" value={formData.meals} onChange={handleChange} placeholder="B.B." className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Transport</label>
                <input type="text" name="transport" value={formData.transport} onChange={handleChange} placeholder="Private Vehicle" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rating Number</label>
                <NumberInput type="number" step="0.01" name="rate" value={formData.rate} onChange={handleChange} placeholder="e.g. 4.9" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rating out of 5</label>
                <NumberInput type="number" step="0.01" name="rating" value={formData.rating} onChange={handleChange} placeholder="e.g. 5" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                <NumberInput type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="isFeatured/Best Seller">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                  className="w-4 h-4 text-[#24a0ed] rounded border-gray-300 focus:ring-[#24a0ed]"
                />
                <label htmlFor="isBestSeller" className="font-bold text-gray-700 cursor-pointer select-none">
                  Mark as Best Seller
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPopular"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                  className="w-4 h-4 text-[#24a0ed] rounded border-gray-300 focus:ring-[#24a0ed]"
                />
                <label htmlFor="isPopular" className="font-bold text-gray-700 cursor-pointer select-none">
                  Mark as Most Popular
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Enabling these will display the respective badges on the trip cards and feature them in the homepage sections.
            </p>
          </SectionCard>

          <SectionCard title="Tour Categories" defaultOpen>
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
          </SectionCard>

          <SectionCard title="Activity" defaultOpen>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {activityOptions.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No activities found. Manage activities in the <a className="text-[#24a0ed] font-semibold hover:underline" href="/admin/activities">Activities</a> admin to make them available here.
                </div>
              ) : (
                activityOptions.map((option) => {
                  const checked = selectedActivities.includes(option.title);
                  return (
                    <label key={option.slug || option.title} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleActivity(option.title)}
                        className="w-4 h-4 accent-[#24a0ed]"
                      />
                      <span className="font-medium text-gray-700">{option.title}</span>
                    </label>
                  );
                })
              )}
            </div>
          </SectionCard>

        </div>
      </div>
    </form>
  );
}