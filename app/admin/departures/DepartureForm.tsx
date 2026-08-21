'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, CalendarDays, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import ToggleShow from '../components/ToggleShow';
import NumberInput from '@/app/components/NumberInput';

interface TripOption {
  id: string;
  title: string;
  groupSizes?: string[];
}

interface Props {
  initialData?: any;
  isEditing?: boolean;
  treks?: TripOption[];
  tours?: TripOption[];
}

function toDateInput(v?: string | null) {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toIso(v: string) {
  if (!v) return null;
  return new Date(`${v}T12:00:00`).toISOString();
}

export default function DepartureForm({ initialData, isEditing = false, treks = [], tours = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialTripType = initialData?.tripType || 'trek';
  const [tripType, setTripType] = useState<string>(initialTripType);
  const [tripId, setTripId] = useState<string>(initialData?.trekId || initialData?.tourId || '');
  const [form, setForm] = useState({
    startDate: toDateInput(initialData?.startDate),
    endDate: toDateInput(initialData?.endDate) || '',
    groupSize: initialData?.groupSize || '',
    status: initialData?.status || 'Guaranteed',
    seatsLeft: initialData?.seatsLeft ?? 12,
    recurring: !!initialData?.recurring,
    price: initialData?.price || '',
  });

  const options = tripType === 'trek' ? treks : tours;
  const selectedTripOpt = options.find(o => o.id === tripId);
  const matrixSizes = selectedTripOpt?.groupSizes || [];
  const groupSizeOptions = Array.from(new Set([
    ...(matrixSizes.length > 0 ? matrixSizes : ['1 - 12 Pax']),
    ...(form.groupSize ? [form.groupSize] : []),
  ]));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        tripType,
        trekId: tripType === 'trek' ? tripId : null,
        tourId: tripType === 'tour' ? tripId : null,
        startDate: toIso(form.startDate),
        endDate: toIso(form.endDate),
        groupSize: form.groupSize,
        status: form.status,
        seatsLeft: Number(form.seatsLeft),
        recurring: form.recurring,
        price: form.price || null,
      };

      if (!tripId) throw new Error('Please select a trek or tour');
      if (!form.startDate) throw new Error('Please pick a start date');

      const url = isEditing ? `/api/departures/${initialData?.id}` : '/api/departures';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save departure');

      toast.success('Departure saved successfully!');
      router.push('/admin/departures');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save departure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl xl:max-w-none mx-auto space-y-6 text-xs text-gray-800">
      <Toaster position="top-center" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/departures" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? 'Edit Departure' : 'Add New Departure'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && <ToggleShow model="departures" resource="departures" id={initialData?.id as string} published={initialData?.published ?? true} />}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Departure'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 border-b pb-2 mb-2">
          <h2 className="font-bold uppercase text-gray-500 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#24a0ed]" /> Trip</h2>
        </div>

        <div className="md:col-span-2">
          <label className="block font-bold mb-1">Trip Type *</label>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {['trek', 'tour'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTripType(t); setTripId(''); setForm(prev => ({ ...prev, groupSize: '' })); }}
                className={`px-6 py-2 rounded text-xs font-bold uppercase transition-colors ${tripType === t ? 'bg-white text-[#112233] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t === 'trek' ? 'Trek' : 'Tour'}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block font-bold mb-1">Select {tripType === 'trek' ? 'Trek' : 'Tour'} *</label>
          <select
            value={tripId}
            onChange={(e) => {
              const id = e.target.value;
              setTripId(id);
              const trip = options.find(o => o.id === id);
              const sizes = trip?.groupSizes || [];
              setForm(prev => ({
                ...prev,
                groupSize: sizes.length > 0 && !sizes.includes(prev.groupSize) ? sizes[0] : prev.groupSize,
              }));
            }}
            required
            className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none bg-white"
          >
            <option value="">-- Choose a {tripType === 'trek' ? 'trek' : 'tour'} --</option>
            {options.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 border-b pb-2 mt-4 mb-2">
          <h2 className="font-bold uppercase text-gray-500 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#24a0ed]" /> Dates & Availability</h2>
        </div>

        <div>
          <label className="block font-bold mb-1">Start Date *</label>
          <input type="date" name="startDate" required value={form.startDate} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none bg-white" />
        </div>
        <div>
          <label className="block font-bold mb-1">End Date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none bg-white" />
        </div>

        <div>
          <label className="block font-bold mb-1">Group Size</label>
          <select name="groupSize" value={form.groupSize} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none bg-white">
            {groupSizeOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
<div>
          <label className="block font-bold mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none bg-white">
            <option value="Guaranteed">Guaranteed</option>
            <option value="Available">Available</option>
            <option value="Filling Fast">Filling Fast</option>
            <option value="Sold Out">Sold Out</option>
          </select>
        </div>

        <div>
          <label className="block font-bold mb-1">Seats Left</label>
          <NumberInput type="number" name="seatsLeft" value={form.seatsLeft} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>

        <div>
          <label className="block font-bold mb-1">Price Override (optional)</label>
          <input type="text" name="price" value={form.price} onChange={handleChange} placeholder="e.g. US$ 2,499" className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
            <input
              type="checkbox"
              checked={form.recurring}
              onChange={(e) => setForm(prev => ({ ...prev, recurring: e.target.checked }))}
              className="w-4 h-4 accent-[#24a0ed]"
            />
            <span className="inline-flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-violet-600" /> Repeats every year</span>
          </label>
        </div>

        {form.recurring && (
          <div className="md:col-span-2 bg-violet-50 border border-violet-200 rounded-lg p-3 text-[11px] text-violet-800">
            This departure will automatically get new dated instances created for the next 2 years (e.g. a 15 Mar departure
            becomes 2027 &amp; 2028 rows). You never need to re-enter it.
          </div>
        )}
      </div>
    </form>
  );
}
