'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import ToggleShow from '../components/ToggleShow';
import SectionCard from '@/app/components/admin/SectionCard';
import MediaUploader from '@/app/components/admin/MediaUploader';

const defaultContent = {
  published: true,
  title: 'Why Ever Peak Adventures',
  subtitle: 'Have questions or ready to plan your Himalayan adventure?',
  contentHtml: '', // This will hold our JSON stringified cards
};

type Card = {
  title: string;
  description: string;
  image: string;
};

export default function WhyPagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultContent);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/why-page');
        const json = await res.json();
        if (json.success && json.data) {
          setForm({
            published: json.data.published ?? true,
            title: json.data.title || '',
            subtitle: json.data.subtitle || '',
            contentHtml: json.data.contentHtml || '',
          });

          // Parse cards
          if (json.data.contentHtml) {
            try {
              // Try parsing as JSON first
              const parsedCards = JSON.parse(json.data.contentHtml);
              if (Array.isArray(parsedCards)) {
                setCards(parsedCards);
              }
            } catch (e) {
              // Fallback: Parse the old HTML structure using regex
              const htmlStr = json.data.contentHtml;
              const h3Matches = [...htmlStr.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)];
              const pMatches = [...htmlStr.matchAll(/<p[^>]*>(.*?)<\/p>/g)];
              const legacyCards: Card[] = [];
              for (let i = 0; i < h3Matches.length; i++) {
                legacyCards.push({
                  title: h3Matches[i][1].replace(/<[^>]+>/g, '').trim(),
                  description: pMatches[i] ? pMatches[i][1].replace(/<[^>]+>/g, '').trim() : '',
                  image: ''
                });
              }
              setCards(legacyCards);
            }
          }
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addCard = () => {
    setCards(prev => [...prev, { title: '', description: '', image: '' }]);
  };

  const removeCard = (idx: number) => {
    setCards(prev => prev.filter((_, i) => i !== idx));
  };

  const updateCard = (idx: number, field: keyof Card, value: string) => {
    setCards(prev => {
      const clone = [...prev];
      clone[idx][field] = value;
      return clone;
    });
  };

  const moveCard = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx > 0) {
      setCards(prev => {
        const clone = [...prev];
        [clone[idx], clone[idx - 1]] = [clone[idx - 1], clone[idx]];
        return clone;
      });
    } else if (direction === 'down' && idx < cards.length - 1) {
      setCards(prev => {
        const clone = [...prev];
        [clone[idx], clone[idx + 1]] = [clone[idx + 1], clone[idx]];
        return clone;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const dataToSave = {
      ...form,
      contentHtml: JSON.stringify(cards),
    };

    try {
      const res = await fetch('/api/why-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      if (!res.ok) throw new Error('Failed to save Why page');

      toast.success('Why page saved successfully!');
      router.push('/admin/why-page');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl xl:max-w-none mx-auto space-y-6 text-md text-gray-800 font-sans pb-20">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl xl:max-w-none mx-auto space-y-6 text-md text-gray-800 font-sans pb-20">
      <Toaster position="top-center" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-black uppercase text-[#112233]">Why Ever Peak Adventures</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleShow model="why-page" resource="why-page" id="__single__" published={form.published ?? true} />
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <SectionCard title="Page Header" defaultOpen>
        <div>
          <label className="block font-bold mb-1">Page Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg text-lg font-medium focus:border-[#24a0ed] outline-none" placeholder="Why Ever Peak Adventures" />
        </div>

        <div>
          <label className="block font-bold mb-1">Subtitle</label>
          <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full p-3 border rounded-lg text-lg font-medium focus:border-[#24a0ed] outline-none text-justify" placeholder="Have questions or ready to plan..." />
        </div>
      </SectionCard>

      <SectionCard title="Bento Grid Cards (Why Us)">
        <div className="space-y-6">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 p-6 rounded-xl flex flex-col gap-4 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button type="button" onClick={() => moveCard(idx, 'up')} disabled={idx === 0} className="p-1.5 bg-white border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                  ↑
                </button>
                <button type="button" onClick={() => moveCard(idx, 'down')} disabled={idx === cards.length - 1} className="p-1.5 bg-white border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                  ↓
                </button>
                <button type="button" onClick={() => removeCard(idx)} className="p-1.5 bg-white border border-red-200 rounded text-red-500 hover:text-red-700 hover:bg-red-50 ml-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-2">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <h3 className="font-bold text-[#112233] text-lg uppercase">Card {idx + 1}</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-1 text-[10px] uppercase tracking-wider text-gray-500">Title</label>
                    <input 
                      type="text" 
                      value={card.title} 
                      onChange={(e) => updateCard(idx, 'title', e.target.value)} 
                      className="w-full p-3 border rounded-lg font-medium focus:border-[#24a0ed] outline-none" 
                      placeholder="e.g. Local Himalayan Experts" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-[10px] uppercase tracking-wider text-gray-500">Description</label>
                    <textarea 
                      value={card.description} 
                      onChange={(e) => updateCard(idx, 'description', e.target.value)} 
                      className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none min-h-[120px]" 
                      placeholder="Write the reason here..." 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block font-bold mb-1 text-[10px] uppercase tracking-wider text-gray-500">Background Image (Optional)</label>
                  <p className="text-[10px] text-gray-400 mb-2">Upload a stunning background image for this card.</p>
                  <MediaUploader
                    type="image"
                    value={card.image}
                    onChange={(url) => updateCard(idx, 'image', url)}
                    label={`Upload Card ${idx + 1} Image`}
                    heightClass="h-[210px]"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addCard}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-500 font-bold hover:bg-gray-50 hover:text-[#24a0ed] hover:border-[#24a0ed] transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <Plus className="w-5 h-5" /> Add New Card
          </button>
        </div>
      </SectionCard>
    </form>
  );
}