'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickAddActivity() {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/^-|-$/g, '');

  const handleAdd = async () => {
    const t = title.trim();
    if (!t) return;
    setSaving(true);
    const payload = { title: t, slug: slugify(t) };

    try {
      const res = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to add activity');

      setTitle('');
      // refresh the current route so the server-side list updates
      router.refresh();
    } catch (err) {
      console.error(err);
      alert((err as any)?.message || 'Failed to add activity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <h3 className="font-bold text-gray-800 mb-2">Quick Add Activity</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Activity title (e.g. Mountain Flight)"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="bg-[#24a0ed] text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
        >
          {saving ? 'Adding...' : 'Add'}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Adds a simple activity (slug auto-generated). Use the full editor to add description or image.</p>
    </div>
  );
}
