'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import ToggleShow from '../components/ToggleShow';
import SectionCard from '@/app/components/admin/SectionCard';

const defaultSettings = {
  published: true,
  enabled: true,
  whatsapp: '',
  viber: '',
  phone: '',
  email: '',
};

export default function ContactWidgetSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(defaultSettings);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/contact-widget');
        const json = await res.json();
        if (json.success && json.data) {
          setForm({
            published: json.data.published ?? true,
            enabled: json.data.enabled !== undefined ? Boolean(json.data.enabled) : true,
            whatsapp: json.data.whatsapp || '',
            viber: json.data.viber || '',
            phone: json.data.phone || '',
            email: json.data.email || '',
          });
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact-widget', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save contact widget settings');

      toast.success('Contact widget settings saved successfully!');
      router.push('/admin/contact-widget');
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">Contact Widget</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleShow model="contact-widget" resource="contact-widget" id="__single__" published={form.published ?? true} />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <SectionCard title="Visibility" defaultOpen>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="enabled"
            checked={form.enabled}
            onChange={handleChange}
            className="w-4 h-4 accent-[#24a0ed]"
          />
          <span className="font-bold">Show floating contact widget on the website</span>
        </label>
      </SectionCard>

      <SectionCard title="Contact Channels">
        <div>
          <label className="block font-bold mb-1">WhatsApp Number</label>
          <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. 9851093960" />
        </div>

        <div>
          <label className="block font-bold mb-1">Viber Number</label>
          <input type="text" name="viber" value={form.viber} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. 9851093960" />
        </div>

        <div>
          <label className="block font-bold mb-1">Phone Number</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. 9851093960" />
        </div>

        <div>
          <label className="block font-bold mb-1">Email</label>
          <input type="text" name="email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. info@everpeakadventures.com" />
        </div>
      </SectionCard>
    </form>
  );
}
