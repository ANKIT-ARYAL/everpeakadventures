'use client';

import React, { useEffect, useState } from 'react';
import { X, Search, Loader2, Film } from 'lucide-react';

interface MedFile {
  url: string;
  kind: string;
  originalName?: string | null;
  size?: number | null;
  createdAt?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  kind?: 'image' | 'video' | 'any';
}

export default function MediaLibraryPicker({ open, onClose, onSelect, kind = 'any' }: Props) {
  const [files, setFiles] = useState<MedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setFiles([]);
    fetch('/api/media')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.files)) setFiles(data.files);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const filtered = files.filter((f) => {
    if (kind === 'image' && f.kind !== 'image') return false;
    if (kind === 'video' && f.kind !== 'video') return false;
    if (filter === 'image' && f.kind !== 'image') return false;
    if (filter === 'video' && f.kind !== 'video') return false;
    if (query && !f.url.toLowerCase().includes(query.toLowerCase()) && !(f.originalName || '').toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="font-black text-[#112233] uppercase tracking-wide">Media Library</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#24a0ed] text-sm"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'image', 'video'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded text-sm font-bold capitalize transition-colors ${filter === f ? 'bg-white text-[#112233] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading media...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No files found. Upload images using the upload button in any form.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((file) => (
                <button
                  key={file.url}
                  onClick={() => onSelect(file.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-[#24a0ed] transition-colors bg-gray-50"
                  title={file.originalName || file.url}
                >
                  {file.kind === 'video' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <video src={file.url} className="w-full h-full object-cover" preload="metadata" muted />
                      <Film className="absolute text-white/80 w-6 h-6" />
                    </div>
                  ) : (
                    <img src={file.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] font-bold px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    Select
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}