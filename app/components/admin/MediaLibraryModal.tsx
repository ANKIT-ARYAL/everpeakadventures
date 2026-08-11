'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Search, Loader2, Film, UploadCloud, Copy, Check, FileText } from 'lucide-react';

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
  insertLabel?: string;
}

function formatSize(bytes?: number | null) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryModal({
  open,
  onClose,
  onSelect,
  kind = 'any',
  insertLabel = 'Insert',
}: Props) {
  const [tab, setTab] = useState<'upload' | 'library'>('library');
  const [files, setFiles] = useState<MedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<MedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data && Array.isArray(data.files)) setFiles(data.files);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setTab('library');
    setSelected(null);
    setQuery('');
    setFilter('all');
    setUploadError('');
    setCopied(false);
    load();
  }, [open]);

  if (!open) return null;

  const allowed = (f: MedFile) => {
    if (kind === 'image' && f.kind !== 'image') return false;
    if (kind === 'video' && f.kind !== 'video') return false;
    return true;
  };

  const filtered = files.filter((f) => {
    if (!allowed(f)) return false;
    if (filter === 'image' && f.kind !== 'image') return false;
    if (filter === 'video' && f.kind !== 'video') return false;
    if (query && !f.url.toLowerCase().includes(query.toLowerCase()) && !(f.originalName || '').toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const uploadFiles = async (list: FileList | File[]) => {
    const arr = Array.from(list);
    if (!arr.length) return;
    setUploading(true);
    setUploadError('');
    let uploaded = 0;
    for (const file of arr) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', kind === 'video' ? 'video' : 'image');
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
        uploaded++;
      } catch (e: any) {
        setUploadError(e.message || 'Upload failed');
      }
    }
    setUploading(false);
    if (uploaded > 0) {
      await load();
      setTab('library');
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  const insert = (f: MedFile) => {
    onSelect(f.url);
    onClose();
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="font-black text-[#112233] uppercase tracking-wide">Add Media</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 py-2 border-b border-gray-200 flex items-center gap-1">
          {(['library', 'upload'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wide transition-colors ${tab === t ? 'bg-[#24a0ed] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {t === 'library' ? 'Media Library' : 'Upload Files'}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {tab === 'library' ? (
              <>
                <div className="px-5 py-3 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search media..."
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
                    <div className="text-center py-16 text-gray-400">
                      No files found. Switch to "Upload Files" to add new media.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filtered.map((file) => {
                        const isSelected = selected?.url === file.url;
                        return (
                          <button
                            key={file.url}
                            onClick={() => setSelected(file)}
                            onDoubleClick={() => insert(file)}
                            className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-colors bg-gray-50 ${isSelected ? 'border-[#24a0ed] ring-2 ring-[#24a0ed]/30' : 'border-transparent hover:border-gray-200'}`}
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
                            {isSelected && (
                              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#24a0ed] text-white flex items-center justify-center text-[10px] font-black">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div
                  onDragEnter={(e) => { e.preventDefault(); dragDepth.current++; setDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (dragDepth.current === 0) setDragging(false); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${dragging ? 'border-[#24a0ed] bg-blue-50' : 'border-gray-300 hover:border-[#24a0ed] hover:bg-blue-50/40'}`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-10 h-10 animate-spin text-[#24a0ed] mx-auto mb-3" />
                      <p className="font-bold text-gray-700">Uploading files…</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="font-bold text-gray-700">Drop files here to upload</p>
                      <p className="text-gray-400 text-sm mt-1">or click to browse your computer</p>
                      <p className="text-[11px] text-gray-400 mt-2">
                        {kind === 'video' ? 'Videos up to 500 MB' : 'Images up to 15 MB'}
                      </p>
                    </>
                  )}
                </div>
                {uploadError && <p className="text-rose-600 text-sm font-bold mt-3">{uploadError}</p>}
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept={kind === 'video' ? 'video/*' : kind === 'image' ? 'image/*' : 'image/*,video/*'}
                  onChange={(e) => { const files = e.target.files; if (files) uploadFiles(files); }}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Details panel */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50 flex flex-col">
            {selected ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    {selected.kind === 'video' ? (
                      <video src={selected.url} controls className="w-full h-full object-contain bg-black" />
                    ) : (
                      <img src={selected.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">File name</span>
                    <p className="text-sm font-bold text-gray-800 break-all">{selected.originalName || selected.url.split('/').pop()}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{selected.kind === 'video' ? 'Video' : 'Image'}</span>
                    {formatSize(selected.size) && <span>{formatSize(selected.size)}</span>}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">File URL</span>
                    <div className="flex items-center gap-1.5">
                      <input readOnly value={selected.url} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-xs text-gray-600" />
                      <button onClick={() => copyUrl(selected.url)} className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-600" title="Copy URL">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-white">
                  <button
                    onClick={() => insert(selected)}
                    className="w-full bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold py-2.5 rounded-lg text-sm"
                  >
                    Insert into {insertLabel}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400 p-6">
                <FileText className="w-8 h-8" />
                <p className="text-sm font-medium text-center">Select an item from the library<br />to see its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
