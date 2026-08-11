'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminPerms } from '../AdminPermsContext';
import { hasPerm } from '@/lib/permissions';

interface DeleteButtonProps {
  id: string;
  model: string; // e.g., 'tours', 'treks', 'blogs'
  title: string;
}

const RESOURCE_BY_MODEL: Record<string, string> = {
  treks: 'treks',
  tours: 'tours',
  blogs: 'blogs',
  testimonials: 'testimonials',
  faqs: 'faqs',
  team: 'team',
  'legal-documents': 'legal-documents',
  'why-choose-us-items': 'why-choose-us',
  'why-choose-us-features': 'why-choose-us',
  'welcome-features': 'welcome-features',
  'subpage-heroes': 'subpage-hero',
  departures: 'departures',
  'trust-items': 'trust-items',
  'trek-categories': 'trek-categories',
  'tour-categories': 'tour-categories',
  'page-categories': 'page-categories',
  pages: 'pages',
};

export default function DeleteButton({ id, model, title }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isSuperAdmin, permissions } = useAdminPerms();

  const resource = RESOURCE_BY_MODEL[model] ?? model;

  if (!isSuperAdmin && !hasPerm(permissions, resource, 'delete')) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${model}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete item');

      router.refresh();
    } catch (error) {
      alert('Error deleting item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      title="Delete Item"
      aria-label={`Delete ${title}`}
      className="inline-flex items-center gap-1 px-3 py-3 sm:px-2 sm:py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span className="hidden md:inline text-xs font-medium">Delete</span>
    </button>
  );
}