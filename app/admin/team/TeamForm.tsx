'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import MediaUploader from '@/app/components/admin/MediaUploader';
import ToggleShow from '../components/ToggleShow';

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function TeamForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    image: initialData?.image || '',
    bio: initialData?.bio || '',
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

      const url = isEditing ? `/api/team/${initialData?.id}` : '/api/team';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save team member');
      
      toast.success('Team member saved successfully!');
      router.push('/admin/team');
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
          <Link href="/admin/team" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? `Edit Member: ${initialData?.name}` : 'Add New Team Member'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && <ToggleShow model="team" resource="team" id={initialData?.id as string} published={initialData?.published ?? true} />}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Member' : 'Publish Member')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Member Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Member Details</h2>
            
            <div>
              <label className="block font-bold mb-1">Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Dipesh Aryal" />
            </div>

            <div>
              <label className="block font-bold mb-1">Role *</label>
              <input type="text" name="role" required value={form.role} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. Founder & Lead Guide" />
            </div>

            <div>
              <label className="block font-bold mb-1">Bio</label>
              <TipTapEditor value={form.bio} onChange={(html) => setForm(prev => ({ ...prev, bio: html }))} placeholder="Short biography..." minHeight="160px" />
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Member Photo *</h3>
            <MediaUploader value={form.image} onChange={(url) => setForm(prev => ({ ...prev, image: url }))} label="Upload Member Photo" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Member Attributes</h3>

            <div>
              <label className="block font-bold mb-1">Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full p-2.5 border rounded-lg outline-none bg-gray-50" />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
