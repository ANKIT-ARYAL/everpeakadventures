/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import NumberInput from '@/app/components/NumberInput';
import SectionCard from '@/app/components/admin/SectionCard';

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function TrustItemForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    iconName: initialData?.iconName || '',
    order: initialData?.order || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
      };

      const url = isEditing ? `/api/trust-items/${initialData?.id}` : '/api/trust-items';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save trust item');
      
      toast.success('Trust item saved successfully!');
      router.push('/admin/trust-items');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 pb-20 text-md font-sans text-gray-800 min-w-0">
      <Toaster position="top-center" />
      
      {/* Top Header Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Link href="/admin/trust-items" className="self-start sm:self-auto p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-black text-[#112233] oswald uppercase tracking-wider">
            {isEditing ? `Edit Item: ${initialData?.title}` : 'Add New Trust Item'}
          </h1>
        </div>

        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Item' : 'Publish Item')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          
          <SectionCard title="Item Details" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Title *</label>
                <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none focus:border-[#24a0ed]" placeholder="e.g. Licensed & Certified" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtitle</label>
                <TipTapEditor value={form.subtitle} onChange={(html) => setForm(prev => ({ ...prev, subtitle: html }))} placeholder="Short supporting text..." minHeight="120px" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Icon Name</label>
                <input type="text" name="iconName" value={form.iconName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed]" placeholder="e.g. ShieldCheck, Award, Map" />
              </div>
            </div>
          </SectionCard>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start min-w-0">
          
          <SectionCard title="Item Attributes">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Display Order</label>
              <NumberInput type="number" name="order" value={form.order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none" />
            </div>
          </SectionCard>

        </div>

      </div>
    </form>
  );
}