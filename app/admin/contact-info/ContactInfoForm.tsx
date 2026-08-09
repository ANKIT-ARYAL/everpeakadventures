'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import ToggleShow from '../components/ToggleShow';

interface Props {
  contactData?: any;
}

export default function ContactInfoForm({ contactData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [contact, setContact] = useState({
    published: contactData?.published ?? true,
    address: contactData?.address || '',
    phone: contactData?.phone || '',
    email: contactData?.email || '',
    mapUrl: contactData?.mapUrl || '',
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contactRes = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: contact.address,
          phone: contact.phone,
          email: contact.email,
          mapUrl: contact.mapUrl,
        }),
      });
      if (!contactRes.ok) throw new Error('Failed to save contact info');

      toast.success('Contact info saved successfully!');
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
          <h1 className="text-xl font-black uppercase text-[#112233]">Contact Info</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleShow model="contact-info" resource="contact-info" id="__single__" published={contact.published ?? true} />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Contact Info</h2>

        <div>
          <label className="block font-bold mb-1">Address</label>
          <input type="text" name="address" value={contact.address} onChange={handleContactChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Kathmandu, Nepal" />
        </div>

        <div>
          <label className="block font-bold mb-1">Phone</label>
          <input type="text" name="phone" value={contact.phone} onChange={handleContactChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. 9851093960" />
        </div>

        <div>
          <label className="block font-bold mb-1">Email</label>
          <input type="email" name="email" value={contact.email} onChange={handleContactChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. info@everpeakadventures.com" />
        </div>

        <div>
          <label className="block font-bold mb-1">Map URL</label>
          <textarea name="mapUrl" rows={3} value={contact.mapUrl} onChange={handleContactChange} className="w-full p-3 border rounded-lg font-mono text-xs focus:border-[#24a0ed] outline-none" placeholder="https://www.google.com/maps/embed?pb=..." />
        </div>
      </div>
    </form>
  );
}
