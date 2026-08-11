'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type FooterLogo = { label: string; src: string; href?: string };

type SiteSettingsForm = {
  logoImage: string;
  emergencyLabel: string;
  emergencyLandline: string;
  emergencyPhone: string;
  whatsapp: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  addressMapUrl: string;
  footerBgImage: string;
  copyrightText: string;
  newsletterTitle: string;
  footerColumns: FooterColumn[];
  footerLogos: { associations: FooterLogo[]; payments: FooterLogo[] };
};

const defaultSettings: SiteSettingsForm = {
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
  newsletterTitle: '',
  footerColumns: [],
  footerLogos: { associations: [], payments: [] },
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
            newsletterTitle: json.data.newsletterTitle || '',
            footerColumns: Array.isArray(json.data.footerColumns) ? json.data.footerColumns : [],
            footerLogos:
              json.data.footerLogos && typeof json.data.footerLogos === 'object'
                ? json.data.footerLogos
                : { associations: [], payments: [] },
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

  const setColumns = (cols: FooterColumn[]) => setForm(prev => ({ ...prev, footerColumns: cols }));

  const setLogos = (logos: { associations: FooterLogo[]; payments: FooterLogo[] }) =>
    setForm(prev => ({ ...prev, footerLogos: logos }));

  // ----- column helpers -----
  const addColumn = () =>
    setColumns([...form.footerColumns, { title: '', links: [{ label: '', href: '' }] }]);
  const removeColumn = (i: number) =>
    setColumns(form.footerColumns.filter((_: unknown, idx: number) => idx !== i));
  const updateColumnTitle = (i: number, title: string) =>
    setColumns(form.footerColumns.map((c, idx) => (idx === i ? { ...c, title } : c)));
  const updateColumnLink = (colIdx: number, linkIdx: number, field: 'label' | 'href', val: string) =>
    setColumns(
      form.footerColumns.map((c, idx) =>
        idx === colIdx
          ? { ...c, links: c.links.map((l, li) => (li === linkIdx ? { ...l, [field]: val } : l)) }
          : c
      )
    );
  const addColumnLink = (i: number) =>
    setColumns(
      form.footerColumns.map((c, idx) =>
        idx === i ? { ...c, links: [...c.links, { label: '', href: '' }] } : c
      )
    );
  const removeColumnLink = (colIdx: number, linkIdx: number) =>
    setColumns(
      form.footerColumns.map((c, idx) =>
        idx === colIdx ? { ...c, links: c.links.filter((_, li) => li !== linkIdx) } : c
      )
    );

  // ----- logo helpers -----
  const updateLogo = (group: 'associations' | 'payments', i: number, field: 'label' | 'src' | 'href', val: string) =>
    setLogos({
      ...form.footerLogos,
      [group]: form.footerLogos[group].map((l, idx) => (idx === i ? { ...l, [field]: val } : l)),
    });
  const addLogo = (group: 'associations' | 'payments') =>
    setLogos({
      ...form.footerLogos,
      [group]: [...form.footerLogos[group], { label: '', src: '', href: '' }],
    });
  const removeLogo = (group: 'associations' | 'payments', i: number) =>
    setLogos({ ...form.footerLogos, [group]: form.footerLogos[group].filter((_, idx) => idx !== i) });

  const inputCls = 'w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none';
  const monoCls = `${inputCls} font-mono text-xs`;

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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
          <label className="block font-bold mb-1">Logo</label>
          <MediaUploader value={form.logoImage} onChange={(url) => setForm(prev => ({ ...prev, logoImage: url }))} label="Upload Logo" heightClass="h-32" />
        </div>

        <div>
          <label className="block font-bold mb-1">Footer Background</label>
          <MediaUploader value={form.footerBgImage} onChange={(url) => setForm(prev => ({ ...prev, footerBgImage: url }))} label="Upload Footer Background" />
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
          <label className="block font-bold mb-1">Newsletter Title</label>
          <input type="text" name="newsletterTitle" value={form.newsletterTitle} onChange={handleChange} className={inputCls} placeholder="e.g. Subscribe our Newsletter" />
        </div>

        <div>
          <label className="block font-bold mb-1">Copyright Text</label>
          <textarea name="copyrightText" rows={3} value={form.copyrightText} onChange={handleChange} className={inputCls} placeholder="e.g. Copyright © 2026 Everpeak Adventures | Design By Fly Up Technology" />
        </div>
      </div>

      {/* Link Columns Editor */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="font-bold text-gray-800 uppercase tracking-wider">Footer Link Columns</h2>
          <button type="button" onClick={addColumn} className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-3 py-1.5 rounded-lg text-xs">+ Add Column</button>
        </div>
        <p className="text-gray-500">Each column shows a title plus its list of links. Leave a column empty to delete it.</p>

        {form.footerColumns.length === 0 && <p className="text-gray-400 text-sm italic">No columns yet — add one to start editing.</p>}

        {form.footerColumns.map((col, ci) => (
          <div key={ci} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={col.title}
                onChange={(e) => updateColumnTitle(ci, e.target.value)}
                placeholder="Column title (e.g. Popular Trekking)"
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => removeColumn(ci)}
                className="text-rose-500 hover:text-rose-700 font-bold px-3 py-3 rounded-lg border border-rose-200 hover:border-rose-400 shrink-0"
                title="Remove column"
              >
                ✕
              </button>
            </div>

            {col.links.map((link, li) => (
              <div key={li} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateColumnLink(ci, li, 'label', e.target.value)}
                  placeholder="Link label"
                  className={inputCls}
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateColumnLink(ci, li, 'href', e.target.value)}
                  placeholder="/trekking or https://..."
                  className={monoCls}
                />
                <button
                  type="button"
                  onClick={() => removeColumnLink(ci, li)}
                  className="text-rose-500 hover:text-rose-700 font-bold px-3 py-3 rounded-lg border border-rose-200 hover:border-rose-400 shrink-0"
                  title="Remove link"
                >
                  ✕
                </button>
              </div>
            ))}

            <button type="button" onClick={() => addColumnLink(ci)} className="text-[#24a0ed] hover:text-[#1a85c6] font-bold text-xs">
              + Add Link
            </button>
          </div>
        ))}
      </div>

      {/* Logos Editor */}
      {(['associations', 'payments'] as const).map((group) => (
        <div key={group} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider capitalize">{group === 'associations' ? 'Association Logos' : 'Payment Logos'}</h2>
            <button type="button" onClick={() => addLogo(group)} className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-3 py-1.5 rounded-lg text-xs">+ Add Logo</button>
          </div>
          <p className="text-gray-500">Shown in the footer bottom bar. Fill in the image URL for each logo; the label is used for tooltips/alt text.</p>

          {form.footerLogos[group].length === 0 && <p className="text-gray-400 text-sm italic">No logos yet — add one to start editing.</p>}

          {form.footerLogos[group].map((logo, li) => (
            <div key={li} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={logo.label}
                    onChange={(e) => updateLogo(group, li, 'label', e.target.value)}
                    placeholder="Label / alt text (e.g. TAAN)"
                    className={inputCls}
                  />
                  <MediaUploader
                    value={logo.src}
                    onChange={(url) => updateLogo(group, li, 'src', url)}
                    label="Upload Logo Image"
                    heightClass="h-24"
                  />
                  {group === 'associations' && (
                    <input
                      type="text"
                      value={logo.href || ''}
                      onChange={(e) => updateLogo(group, li, 'href', e.target.value)}
                      placeholder="Link URL (optional)"
                      className={monoCls}
                    />
                  )}
                </div>
                {logo.src && (
                  <img src={logo.src} alt={logo.label} className="h-10 w-auto object-contain border border-gray-100 rounded" />
                )}
                <button
                  type="button"
                  onClick={() => removeLogo(group, li)}
                  className="text-rose-500 hover:text-rose-700 font-bold px-3 py-3 rounded-lg border border-rose-200 hover:border-rose-400 shrink-0"
                  title="Remove logo"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </form>
  );
}
