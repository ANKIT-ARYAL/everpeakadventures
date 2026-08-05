'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function DepartureForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    heroImage: initialData?.heroImage || '',
    durationDays: initialData?.durationDays || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    status: initialData?.status || 'Guaranteed',
    seatsLeft: initialData?.seatsLeft ?? 12,
    price: initialData?.price || 0,
    originalPrice: initialData?.originalPrice || '',
    order: initialData?.order || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/departures/${initialData?.id}` : '/api/departures';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to save departure');
      
      toast.success('Departure saved successfully!');
      router.push('/admin/departures');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 text-xs text-gray-800">
      <Toaster position="top-center" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/departures" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? 'Edit Departure' : 'Add New Departure'}
          </h1>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Departure'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Trip Details */}
        <div className="md:col-span-2 border-b pb-2 mb-2">
          <h2 className="font-bold uppercase text-gray-500">Trip Display Info</h2>
        </div>
        
        <div>
          <label className="block font-bold mb-1">Trip Title *</label>
          <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. Everest Base Camp" className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>
        <div>
          <label className="block font-bold mb-1">Duration *</label>
          <input type="text" name="durationDays" required value={form.durationDays} onChange={handleChange} placeholder="e.g. 14 Days" className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">Hero Image URL *</label>
          <input type="url" name="heroImage" required value={form.heroImage} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>

        {/* Departure Details */}
        <div className="md:col-span-2 border-b pb-2 mt-4 mb-2">
          <h2 className="font-bold uppercase text-gray-500">Dates & Availability</h2>
        </div>

        <div>
          <label className="block font-bold mb-1">Start Date (String) *</label>
          <input type="text" name="startDate" required value={form.startDate} onChange={handleChange} placeholder="e.g. 15 Sep 2026" className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>
        <div>
          <label className="block font-bold mb-1">End Date (String)</label>
          <input type="text" name="endDate" value={form.endDate} onChange={handleChange} placeholder="e.g. 28 Sep 2026" className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
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
          <input type="number" name="seatsLeft" value={form.seatsLeft} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>

        {/* Pricing */}
        <div className="md:col-span-2 border-b pb-2 mt-4 mb-2">
          <h2 className="font-bold uppercase text-gray-500">Pricing & Order</h2>
        </div>

        <div>
          <label className="block font-bold mb-1 text-[#24a0ed]">Current Price (USD) *</label>
          <input type="number" name="price" required value={form.price} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>
        <div>
          <label className="block font-bold mb-1 text-gray-400">Original Price (Strikethrough)</label>
          <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
        </div>
        <div>
          <label className="block font-bold mb-1">Display Order</label>
          <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none bg-gray-50" />
        </div>

      </div>
    </form>
  );
}