'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  initialData?: any;
  isEditing?: boolean;
}

export default function PageForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    subtitle: initialData?.subtitle || '',
    heroImage: initialData?.heroImage || '',
    content: initialData?.content || '',
  });

  const [sections, setSections] = useState<any[]>(
    Array.isArray(initialData?.sections) && initialData.sections.length > 0
      ? initialData.sections
      : [{ title: '', description: '', image: '', icon: '', order: 0 }]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !isEditing ? {
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      } : {})
    }));
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const addSection = () => setSections([...sections, { title: '', description: '', image: '', icon: '', order: sections.length }]);
  const removeSection = (index: number) => setSections(sections.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        sections: sections.filter(s => s.title.trim() !== ''),
      };

      const url = isEditing ? `/api/pages/${initialData?.id}` : '/api/pages';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save page');

      toast.success('Page saved successfully!');
      router.push('/admin/pages');
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
          <Link href="/admin/pages" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black uppercase text-[#112233]">
            {isEditing ? `Edit Page: ${initialData?.title}` : 'Add New Page'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Page' : 'Publish Page')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Page Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Page Details</h2>

            <div>
              <label className="block font-bold mb-1">Page Title *</label>
              <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm font-medium focus:border-[#24a0ed] outline-none" placeholder="Add title..." />
            </div>

            <div>
              <label className="block font-bold mb-1">URL Slug *</label>
              <input type="text" name="slug" required value={form.slug} onChange={handleChange} className="w-full p-2.5 border rounded-lg font-mono bg-gray-50 focus:border-[#24a0ed] outline-none" />
            </div>

            <div>
              <label className="block font-bold mb-1">Subtitle</label>
              <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" placeholder="Short subtitle..." />
            </div>

            <div>
              <label className="block font-bold mb-1">Page Content (Rich text / HTML)</label>
              <textarea name="content" rows={10} value={form.content} onChange={handleChange} className="w-full p-3 border rounded-lg font-mono text-xs focus:border-[#24a0ed] outline-none" placeholder="Write page content here..." />
            </div>
          </div>

          {/* Page Sections Repeater */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-800 uppercase tracking-wider">Page Sections</h2>
              <button type="button" onClick={addSection} className="text-[#24a0ed] font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Section
              </button>
            </div>

            {sections.map((section, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Section #{idx + 1}</span>
                  <button type="button" onClick={() => removeSection(idx)} className="text-red-500 font-bold flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                  placeholder="Section title..."
                  className="w-full p-2.5 border rounded-lg bg-white outline-none"
                />
                <textarea
                  rows={3}
                  value={section.description}
                  onChange={(e) => handleSectionChange(idx, 'description', e.target.value)}
                  placeholder="Section description..."
                  className="w-full p-2.5 border rounded-lg bg-white outline-none"
                />
                <input
                  type="url"
                  value={section.image}
                  onChange={(e) => handleSectionChange(idx, 'image', e.target.value)}
                  placeholder="Image URL..."
                  className="w-full p-2.5 border rounded-lg bg-white outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={section.icon}
                    onChange={(e) => handleSectionChange(idx, 'icon', e.target.value)}
                    placeholder="Icon..."
                    className="w-full p-2.5 border rounded-lg bg-white outline-none"
                  />
                  <input
                    type="number"
                    value={section.order}
                    onChange={(e) => handleSectionChange(idx, 'order', e.target.value)}
                    placeholder="Order"
                    className="w-full p-2.5 border rounded-lg bg-white outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2">Hero Image</h3>
            <input type="url" name="heroImage" value={form.heroImage} onChange={handleChange} placeholder="https://..." className="w-full p-2.5 border rounded-lg focus:border-[#24a0ed] outline-none" />
            {form.heroImage && (
              <div className="h-36 rounded-lg overflow-hidden border">
                <img src={form.heroImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

        </div>

      </div>
    </form>
  );
}
