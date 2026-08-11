'use client';

import { Eye, EyeOff } from 'lucide-react';

interface Props {
  published: boolean;
  onChange: (p: boolean) => void;
  size?: 'sm' | 'md';
}

export default function PublishedToggle({ published, onChange, size = 'md' }: Props) {
  const base =
    'inline-flex items-center gap-1 rounded-lg transition-colors disabled:opacity-50';
  const pad = size === 'sm' ? 'p-1.5' : 'px-2 py-1.5';
  const stateCls = published
    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
    : 'bg-gray-100 text-gray-500 hover:bg-gray-200';
  return (
    <button
      type="button"
      onClick={() => onChange(!published)}
      title={published ? 'Hide from frontend' : 'Show on frontend'}
      aria-label={published ? 'Hide from frontend' : 'Show on frontend'}
      className={`${base} ${pad} ${stateCls}`}
    >
      {published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      <span className="hidden md:inline text-xs font-medium">
        {published ? 'Hide' : 'Show'}
      </span>
    </button>
  );
}
