'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import TipTapEditor from '@/app/components/admin/TipTapEditor';
import ToggleShow from '../components/ToggleShow';
import NumberInput from '@/app/components/NumberInput';
import Select from 'react-select';

interface RelatedPage {
  type: 'trek' | 'tour' | 'blog' | 'page';
  slug: string;
  title: string;
}

interface SingleFaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface Props {
  initialData?: any;
  isEditing?: boolean;
  relatedPages?: RelatedPage[];
}

export default function FaqForm({ initialData, isEditing = false, relatedPages = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Common target page settings for bulk or single
  const [targetType, setTargetType] = useState<string>(initialData?.relatedType || '');
  const [targetSlug, setTargetSlug] = useState<string>(initialData?.relatedSlug || '');

  // Multi-FAQ state for new creation
  const [faqItems, setFaqItems] = useState<SingleFaqItem[]>([
    {
      id: 'faq-1',
      question: initialData?.question || '',
      answer: initialData?.answer || '',
      order: initialData?.order || 0,
    },
  ]);

  const relatedTypeOptions = [
    { value: 'trek', label: 'Trek' },
    { value: 'tour', label: 'Tour' },
  ];

  const pagesOfType = relatedPages
    .filter(p => p.type === targetType)
    .sort((a, b) => a.title.localeCompare(b.title));

  const addFaqItem = () => {
    setFaqItems(prev => [
      ...prev,
      {
        id: `faq-${Date.now()}`,
        question: '',
        answer: '',
        order: prev.length,
      },
    ]);
  };

  const removeFaqItem = (id: string) => {
    if (faqItems.length <= 1) {
      toast.error('You must keep at least one FAQ.');
      return;
    }
    setFaqItems(prev => prev.filter(item => item.id !== id));
  };

  const updateFaqItem = (id: string, field: keyof SingleFaqItem, value: any) => {
    setFaqItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const payload = {
          question: faqItems[0].question,
          answer: faqItems[0].answer,
          order: Number(faqItems[0].order) || 0,
          relatedType: targetType || null,
          relatedSlug: targetSlug || null,
        };

        const res = await fetch(`/api/faqs/${initialData?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Failed to update FAQ');
        toast.success('FAQ updated successfully!');
      } else {
        // Validate items
        const validItems = faqItems.filter(item => item.question.trim());
        if (validItems.length === 0) {
          throw new Error('Please provide at least one valid question.');
        }

        const payload = {
          items: validItems.map(item => ({
            question: item.question.trim(),
            answer: item.answer || '',
            order: Number(item.order) || 0,
            relatedType: targetType || null,
            relatedSlug: targetSlug || null,
          })),
        };

        const res = await fetch('/api/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Failed to save FAQs');
        toast.success(`Successfully published ${validItems.length} FAQ${validItems.length > 1 ? 's' : ''}!`);
      }

      router.push('/admin/faqs');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl xl:max-w-none mx-auto space-y-6 text-md text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />

      {/* Top Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/faqs" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase text-[#112233]">
              {isEditing ? `Edit FAQ` : 'Add FAQs'}
            </h1>
            {!isEditing && (
              <p className="text-xs text-gray-500 mt-0.5">
                Add one or multiple FAQs at the same time and optionally attach them to a trek or tour page.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <ToggleShow
              model="faqs"
              resource="faqs"
              id={initialData?.id as string}
              published={initialData?.published ?? true}
            />
          )}

          {!isEditing && (
            <button
              type="button"
              onClick={addFaqItem}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Another FAQ
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider text-sm shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {loading
              ? 'Saving...'
              : isEditing
              ? 'Update FAQ'
              : `Publish ${faqItems.length > 1 ? `${faqItems.length} FAQs` : 'FAQ'}`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: FAQ Item Cards */}
        <div className="lg:col-span-2 space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 relative group"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#24a0ed]/10 text-[#24a0ed] flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <h2 className="font-bold text-gray-800 uppercase tracking-wider text-sm">
                    {isEditing ? 'FAQ Details' : `FAQ #${index + 1}`}
                  </h2>
                </div>

                {!isEditing && faqItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFaqItem(item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove this FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1 text-sm text-gray-700">
                  Question *
                </label>
                <textarea
                  rows={2}
                  required
                  value={item.question}
                  onChange={(e) => updateFaqItem(item.id, 'question', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none text-sm font-medium"
                  placeholder="e.g. How many days does the trek usually take?"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-sm text-gray-700">
                  Answer *
                </label>
                <TipTapEditor
                  value={item.answer}
                  onChange={(html) => updateFaqItem(item.id, 'answer', html)}
                  placeholder="Write the full answer here..."
                  minHeight="140px"
                />
              </div>

              <div className="w-32 pt-1">
                <label className="block font-bold mb-1 text-xs text-gray-500 uppercase">
                  Display Order
                </label>
                <NumberInput
                  type="number"
                  name={`order-${item.id}`}
                  value={item.order}
                  onChange={(e) => updateFaqItem(item.id, 'order', Number(e.target.value) || 0)}
                  className="w-full p-2 border rounded-lg outline-none bg-gray-50 text-sm"
                />
              </div>
            </div>
          ))}

          {/* Bottom Add FAQ Button */}
          {!isEditing && (
            <button
              type="button"
              onClick={addFaqItem}
              className="w-full py-4 border-2 border-dashed border-gray-200 hover:border-[#24a0ed] bg-white hover:bg-[#24a0ed]/5 rounded-xl font-bold text-gray-600 hover:text-[#24a0ed] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-sm"
            >
              <Plus className="w-5 h-5" /> + Add Another FAQ
            </button>
          )}
        </div>

        {/* Right Sidebar: Target Page / Destination */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 sticky top-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <HelpCircle className="w-4 h-4 text-accent-amber" />
              <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">
                Show On Page
              </h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Optionally feature {isEditing ? 'this FAQ' : 'all these FAQs'} on a specific trek or tour page. Leave unset to only appear on the general FAQ listing.
            </p>

            <div>
              <label className="block font-bold mb-1 text-sm text-gray-700">
                Page Type
              </label>
              <select
                name="relatedType"
                value={targetType}
                onChange={(e) => {
                  setTargetType(e.target.value);
                  setTargetSlug('');
                }}
                className="w-full p-2.5 border rounded-lg outline-none bg-gray-50 text-sm"
              >
                <option value="">None (FAQ page only)</option>
                {relatedTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {targetType && (
              <div>
                <label className="block font-bold mb-1 text-sm text-gray-700">
                  Select {relatedTypeOptions.find((o) => o.value === targetType)?.label}
                </label>
                <Select
                  options={pagesOfType.map((p) => ({ value: p.slug, label: p.title }))}
                  value={
                    targetSlug
                      ? {
                          value: targetSlug,
                          label: pagesOfType.find((p) => p.slug === targetSlug)?.title || targetSlug,
                        }
                      : null
                  }
                  onChange={(selected: any) => setTargetSlug(selected ? selected.value : '')}
                  isClearable
                  placeholder="Search and select a slug..."
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      padding: '2px',
                      borderRadius: '0.5rem',
                      borderColor: '#e5e7eb',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#24a0ed',
                      },
                    }),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
