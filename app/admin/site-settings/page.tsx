/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import MediaUploader from '@/app/components/admin/MediaUploader';
import SectionCard from '@/app/components/admin/SectionCard';

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
  loginHeroImage: string;
  footerColumns: FooterColumn[];
  footerLogos: { associations: FooterLogo[]; payments: FooterLogo[] };
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
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
  loginHeroImage: '',
  footerColumns: [],
  footerLogos: { associations: [], payments: [] },
  smtpHost: '',
  smtpPort: '',
  smtpUser: '',
  smtpPassword: '',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
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
            loginHeroImage: json.data.loginHeroImage || '',
            footerColumns: Array.isArray(json.data.footerColumns) ? json.data.footerColumns : [],
            footerLogos:
              json.data.footerLogos && typeof json.data.footerLogos === 'object'
                ? json.data.footerLogos
                : { associations: [], payments: [] },
            smtpHost: json.data.smtpHost || '',
            smtpPort: json.data.smtpPort ? String(json.data.smtpPort) : '',
            smtpUser: json.data.smtpUser || '',
            smtpPassword: json.data.smtpPassword || '',
            facebookUrl: json.data.facebookUrl || '',
            instagramUrl: json.data.instagramUrl || '',
            youtubeUrl: json.data.youtubeUrl || '',
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
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

  const inputCls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#24a0ed] bg-white';
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
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
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
          <Link href="/admin" className="self-start sm:self-auto p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-black text-[#112233] oswald uppercase tracking-wider">Site Settings</h1>
        </div>
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          
          <SectionCard title="Emergency Contact" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Emergency Label</label>
                <input type="text" name="emergencyLabel" value={form.emergencyLabel} onChange={handleChange} className={inputCls} placeholder="e.g. Emergency SOS (24/7):" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Landline</label>
                <input type="text" name="emergencyLandline" value={form.emergencyLandline} onChange={handleChange} className={inputCls} placeholder="e.g. +977 98000000" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Phone</label>
                <input type="text" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} className={inputCls} placeholder="e.g. 9851093960" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">WhatsApp</label>
                <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className={inputCls} placeholder="e.g. 9851093960" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="SMTP Configuration (Email Server)">
            <div className="space-y-4">
              <p className="text-gray-500 text-xs sm:text-sm mb-2">Required for sending password reset emails and contact form submissions. Example for Gmail: smtp.gmail.com, 587, your email, your app password.</p>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">SMTP Host</label>
                <input type="text" name="smtpHost" value={form.smtpHost} onChange={handleChange} className={inputCls} placeholder="e.g. smtp.gmail.com" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">SMTP Port</label>
                <input type="text" name="smtpPort" value={form.smtpPort} onChange={handleChange} className={inputCls} placeholder="e.g. 587" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">SMTP Username</label>
                <input type="text" name="smtpUser" value={form.smtpUser} onChange={handleChange} className={inputCls} placeholder="e.g. you@gmail.com" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">SMTP App Password</label>
                <input type="password" name="smtpPassword" value={form.smtpPassword} onChange={handleChange} className={inputCls} placeholder="Enter app password" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Contact Details">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Email</label>
                <input type="text" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="e.g. info@example.com" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Address Line 1</label>
                <input type="text" name="addressLine1" value={form.addressLine1} onChange={handleChange} className={inputCls} placeholder="e.g. Payutar Dhara" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Address Line 2</label>
                <input type="text" name="addressLine2" value={form.addressLine2} onChange={handleChange} className={inputCls} placeholder="e.g. Kathmandu, Nepal" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Address Map URL</label>
                <input type="text" name="addressMapUrl" value={form.addressMapUrl} onChange={handleChange} className={inputCls} placeholder="e.g. https://maps.app.goo.gl/..." />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Social Media URLs">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Facebook URL</label>
                <input type="text" name="facebookUrl" value={form.facebookUrl} onChange={handleChange} className={inputCls} placeholder="e.g. https://facebook.com/everpeak" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Instagram URL</label>
                <input type="text" name="instagramUrl" value={form.instagramUrl} onChange={handleChange} className={inputCls} placeholder="e.g. https://instagram.com/everpeak" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">YouTube URL</label>
                <input type="text" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} className={inputCls} placeholder="e.g. https://youtube.com/c/everpeak" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Footer">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Newsletter Title</label>
                <input type="text" name="newsletterTitle" value={form.newsletterTitle} onChange={handleChange} className={inputCls} placeholder="e.g. Subscribe our Newsletter" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Copyright Text</label>
                <textarea name="copyrightText" rows={3} value={form.copyrightText} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="e.g. Copyright © 2026 Everpeak Adventures | Design By Fly Up Technology" />
              </div>
            </div>
          </SectionCard>

          {/* Link Columns Editor */}
          <SectionCard title="Footer Link Columns">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs text-gray-500">Each column shows a title plus its list of links.</span>
                <button type="button" onClick={addColumn} className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer">+ Add Column</button>
              </div>

              {form.footerColumns.length === 0 && <p className="text-gray-400 text-sm italic py-2">No columns yet — add one to start editing.</p>}

              {form.footerColumns.map((col, ci) => (
                <div key={ci} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
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
                      className="text-rose-500 hover:text-rose-700 font-bold px-3.5 py-2.5 rounded-lg border border-rose-200 hover:border-rose-400 shrink-0 bg-white transition-colors cursor-pointer"
                      title="Remove column"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-gray-200">
                    {col.links.map((link, li) => (
                      <div key={li} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
                          className="text-rose-500 hover:text-rose-700 font-bold px-3.5 py-2.5 rounded-lg border border-rose-200 hover:border-rose-400 shrink-0 bg-white transition-colors cursor-pointer"
                          title="Remove link"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={() => addColumnLink(ci)} className="text-[#24a0ed] hover:text-[#1a85c6] font-bold text-xs transition-colors cursor-pointer inline-block pt-1">
                    + Add Link
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Logos Editor */}
          {(['associations', 'payments'] as const).map((group) => (
            <SectionCard key={group} title={group === 'associations' ? 'Association Logos' : 'Payment Logos'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-xs text-gray-500">Shown in footer bottom bar.</span>
                  <button type="button" onClick={() => addLogo(group)} className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer">+ Add Logo</button>
                </div>

                {form.footerLogos[group].length === 0 && <p className="text-gray-400 text-sm italic py-2">No logos yet — add one to start editing.</p>}

                {form.footerLogos[group].map((logo, li) => (
                  <div key={li} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex-1 w-full space-y-3">
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
                          heightClass="h-28"
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
                      <div className="flex items-center gap-3 shrink-0 self-center sm:self-start">
                        {logo.src && (
                          <img src={logo.src} alt={logo.label} className="h-12 w-auto object-contain border border-gray-200 rounded-lg p-1 bg-white shadow-sm" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeLogo(group, li)}
                          className="text-rose-500 hover:text-rose-700 font-bold px-3.5 py-2.5 rounded-lg border border-rose-200 hover:border-rose-400 bg-white transition-colors cursor-pointer"
                          title="Remove logo"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ))}

        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start min-w-0">
          
          <SectionCard title="Logo">
            <MediaUploader value={form.logoImage} onChange={(url) => setForm(prev => ({ ...prev, logoImage: url }))} label="Upload Logo" heightClass="h-36" />
          </SectionCard>

          <SectionCard title="Login Page Hero Image">
            <MediaUploader value={form.loginHeroImage} onChange={(url) => setForm(prev => ({ ...prev, loginHeroImage: url }))} label="Upload Login Image" heightClass="h-36" />
          </SectionCard>

          <SectionCard title="Footer Background">
            <MediaUploader value={form.footerBgImage} onChange={(url) => setForm(prev => ({ ...prev, footerBgImage: url }))} label="Upload Footer Background" heightClass="h-44" />
          </SectionCard>

        </div>

      </div>
    </form>
  );
}