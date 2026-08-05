'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const defaultSettings = {
  logoImage: '',
  emergencyLabel: '',
  emergencyLandline: '',
  emergencyPhone: '',
  whatsapp: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  addressMapUrl: '',
  footerBgImage: '',
  copyrightText: '',
};

export default function SiteSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(defaultSettings);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/site-settings');
        const json = await res.json();
        if (json.success && json.data) {
          setForm({
            logoImage: json.data.logoImage || '',
            emergencyLabel: json.data.emergencyLabel || '',
            emergencyLandline: json.data.emergencyLandline || '',
            emergencyPhone: json.data.emergencyPhone || '',
            whatsapp: json.data.whatsapp || '',
            email: json.data.email || '',
            addressLine1: json.data.addressLine1 || '',
            addressLine2: json.data.addressLine2 || '',
            addressMapUrl: json.data.addressMapUrl || '',
            footerBgImage: json.data.footerBgImage || '',
            copyrightText: json.data.copyrightText || '',
          });
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save site settings');

      toast.success('Site settings saved successfully!');
      router.push('/admin/site-settings');
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
          <h1 className="text-xl font-black uppercase text-[#112233]">Site Settings</h1>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Logo</h2>

        <div>
          <label className="block font-bold mb-1">Logo Image URL</label>
          <input type="text" name="logoImage" value={form.logoImage} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. https://.../logo.png" />
        </div>

        <div>
          <label className="block font-bold mb-1">Footer Background Image URL</label>
          <input type="text" name="footerBgImage" value={form.footerBgImage} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. https://.../bg.jpg" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Emergency Contact</h2>

        <div>
          <label className="block font-bold mb-1">Emergency Label</label>
          <input type="text" name="emergencyLabel" value={form.emergencyLabel} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Emergency SOS (24/7):" />
        </div>

        <div>
          <label className="block font-bold mb-1">Landline</label>
          <input type="text" name="emergencyLandline" value={form.emergencyLandline} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. +977 98000000" />
        </div>

        <div>
          <label className="block font-bold mb-1">Phone</label>
          <input type="text" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. 9851093960" />
        </div>

        <div>
          <label className="block font-bold mb-1">WhatsApp</label>
          <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. 9851093960" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Contact Details</h2>

        <div>
          <label className="block font-bold mb-1">Email</label>
          <input type="text" name="email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. info@example.com" />
        </div>

        <div>
          <label className="block font-bold mb-1">Address Line 1</label>
          <input type="text" name="addressLine1" value={form.addressLine1} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Payutar Dhara" />
        </div>

        <div>
          <label className="block font-bold mb-1">Address Line 2</label>
          <input type="text" name="addressLine2" value={form.addressLine2} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. Kathmandu, Nepal" />
        </div>

        <div>
          <label className="block font-bold mb-1">Address Map URL</label>
          <input type="text" name="addressMapUrl" value={form.addressMapUrl} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="e.g. https://maps.app.goo.gl/..." />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Footer</h2>

        <div>
          <label className="block font-bold mb-1">Copyright Text</label>
          <textarea name="copyrightText" rows={3} value={form.copyrightText} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="e.g. Copyright © 2026 Everpeak Adventures | Design By Fly Up Technology" />
        </div>
      </div>
    </form>
  );
}
