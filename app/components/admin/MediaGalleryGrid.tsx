'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Check, Film, Link2, Upload, Loader2, Trash2, Pencil, Save, Copy, Image as ImageIcon } from 'lucide-react';
import type { ImageSlot, ImageSlotKey } from '@/lib/media-slots';

export interface GalleryFile {
  id: string | null;
  url: string;
  kind: string;
  originalName?: string | null;
  size?: number | null;
  createdAt?: string | null;
  usedIn: { label: string; type: string }[];
}

export interface SlotValue extends ImageSlot {
  value: string | null;
}

interface Props {
  files: GalleryFile[];
  slots: SlotValue[];
}

function errMsg(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export default function MediaGalleryGrid({ files, slots }: Props) {
  const router = useRouter();
  const uploadRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'unused'>('all');
  const [preview, setPreview] = useState<GalleryFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const filtered = useMemo(() => {
    return files.filter((f) => {
      if (filter === 'image' && f.kind !== 'image') return false;
      if (filter === 'video' && f.kind !== 'video') return false;
      if (filter === 'unused' && f.usedIn.length > 0) return false;
      if (query && !f.url.toLowerCase().includes(query.toLowerCase()) && !(f.originalName || '').toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [files, query, filter]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = Array.from(e.target.files || []);
    if (filesList.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      for (const file of filesList) {
        const type = file.type.startsWith('video') ? 'video' : 'image';
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', type);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
      }
      router.refresh();
    } catch (err) {
      setUploadError(errMsg(err, 'Upload failed'));
    } finally {
      setUploading(false);
      if (uploadRef.current) uploadRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="px-5 py-3 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#24a0ed]"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'image', 'video', 'unused'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-sm font-bold capitalize transition-colors ${filter === f ? 'bg-white text-[#112233] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {f === 'unused' ? 'Unused' : f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos'}
            </button>
          ))}
        </div>
        <button
          onClick={() => uploadRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 bg-[#24a0ed] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#1289d1] disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
        <input
          ref={uploadRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {uploadError && (
        <div className="px-5 py-2 bg-rose-50 border-b border-rose-100 text-rose-600 text-xs font-bold">
          {uploadError}
        </div>
      )}

      <div className="p-5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No files found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((file) => (
              <div key={file.url} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50" onClick={() => setPreview(file)}>
                {file.kind === 'video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <video src={file.url} className="w-full h-full object-cover" preload="metadata" muted />
                    <Film className="absolute text-white/80 w-6 h-6" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt="" className="w-full h-full object-cover cursor-pointer" />
                )}
                <span className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {file.usedIn.length > 0 ? `${file.usedIn.length} use${file.usedIn.length > 1 ? 's' : ''}` : 'Unused'}
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 text-[10px] font-bold text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.originalName || file.url.split('/').pop()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {preview && (
        <FileLightbox
          key={preview.url}
          file={preview}
          slots={slots}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

export function FileLightbox({ file, slots, onClose }: { file: GalleryFile; slots: SlotValue[]; onClose: () => void }) {
  const router = useRouter();
  const [selectedSlots, setSelectedSlots] = useState<ImageSlotKey[]>(() =>
    slots.filter((s) => s.value === file.url).map((s) => s.key)
  );
  const [nameValue, setNameValue] = useState(() => file.originalName || file.url.split('/').pop() || '');
  const [copied, setCopied] = useState(false);
  const [savingSlots, setSavingSlots] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');

  const fmtSize = (n?: number | null) => {
    if (!n) return '';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  const copy = () => {
    navigator.clipboard.writeText(file.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const toggleSlot = (key: ImageSlotKey) => {
    setSelectedSlots((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const savePlacement = async () => {
    setSavingSlots(true);
    setActionError('');
    try {
      const res = await fetch('/api/media/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: file.url, slots: selectedSlots }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed');
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
      router.refresh();
    } catch (err) {
      setActionError(errMsg(err, 'Save failed'));
    } finally {
      setSavingSlots(false);
    }
  };

  const saveName = async () => {
    if (!file.id) return;
    const name = nameValue.trim();
    if (!name) return;
    setSavingName(true);
    setActionError('');
    try {
      const res = await fetch(`/api/media/${file.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Rename failed');
      router.refresh();
    } catch (err) {
      setActionError(errMsg(err, 'Rename failed'));
    } finally {
      setSavingName(false);
    }
  };

  const deleteFile = async () => {
    if (!file.id) return;
    const warn = file.usedIn.length > 0
      ? `This file is used in ${file.usedIn.length} place${file.usedIn.length > 1 ? 's' : ''}. Deleting it will break those pages. Delete anyway?`
      : 'Delete this file permanently?';
    if (!window.confirm(warn)) return;
    setDeleting(true);
    setActionError('');
    try {
      const res = await fetch(`/api/media/${file.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed');
      onClose();
      router.refresh();
    } catch (err) {
      setActionError(errMsg(err, 'Delete failed'));
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="font-black text-[#112233] truncate pr-4">{file.originalName || file.url.split('/').pop()}</div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#112233] text-white px-3 py-1.5 rounded-lg hover:bg-[#1e3a52]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy URL'}
            </button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-600">
              Close
            </button>
          </div>
        </div>

        {actionError && (
          <div className="mx-4 mt-4 px-3 py-2 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-lg">
            {actionError}
          </div>
        )}

        <div className="p-4 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
            {file.kind === 'video' ? (
              <video src={file.url} className="max-h-[50vh] w-full object-contain" controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={file.url} alt="" className="max-h-[50vh] w-full object-contain" />
            )}
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Link2 className="w-3 h-3" /> URL</div>
              <div className="font-mono text-xs text-gray-600 break-all mt-0.5">{file.url}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size</div>
              <div className="text-gray-600 mt-0.5">{fmtSize(file.size) || '—'}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Used in ({file.usedIn.length})</div>
              {file.usedIn.length === 0 ? (
                <p className="text-gray-400 italic text-xs mt-0.5">Not used anywhere yet.</p>
              ) : (
                <ul className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                  {file.usedIn.map((u, i) => (
                    <li key={i} className="text-xs bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-gray-600">
                      <span className="font-bold text-[#24a0ed]">{u.type}:</span> {u.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {file.kind === 'image' && (
          <div className="px-4 pb-4 space-y-4">
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-[#112233] uppercase tracking-wide text-xs flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#24a0ed]" /> Assign to website sections
              </h4>
              <p className="text-[11px] text-gray-400">Check the sections that should show this image. Saving overrides those sections.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto">
                {slots.map((slot) => {
                  const active = selectedSlots.includes(slot.key);
                  return (
                    <label key={slot.key} className={`flex items-center gap-2 border rounded-lg px-2.5 py-2 cursor-pointer transition-colors ${active ? 'border-[#24a0ed] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleSlot(slot.key)}
                        className="w-4 h-4 accent-[#24a0ed]"
                      />
                      <span className="w-8 h-8 rounded overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                        {slot.value ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={slot.value} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 font-bold">—</span>
                        )}
                      </span>
                      <span className="text-xs font-bold text-gray-700 leading-tight">{slot.label}</span>
                    </label>
                  );
                })}
              </div>
              <button
                onClick={savePlacement}
                disabled={savingSlots}
                className={`w-full mt-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg px-3 py-2 transition-colors ${savedFlash ? 'bg-emerald-500 text-white' : 'bg-[#24a0ed] text-white hover:bg-[#1289d1]'} disabled:opacity-60`}
              >
                {savingSlots ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : savedFlash ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {savingSlots ? 'Saving...' : savedFlash ? 'Saved' : 'Save placement'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-[#112233] uppercase tracking-wide text-xs flex items-center gap-1.5">
                <Pencil className="w-3.5 h-3.5 text-[#24a0ed]" /> Rename
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  disabled={!file.id}
                  placeholder="File name"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#24a0ed] disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  onClick={saveName}
                  disabled={!file.id || savingName}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-[#112233] text-white px-3 py-2 rounded-lg hover:bg-[#1e3a52] disabled:opacity-50"
                >
                  {savingName ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                </button>
              </div>
              {!file.id && <p className="text-[10px] text-gray-400">Legacy file (pre-database upload) - rename only works for files uploaded through the admin.</p>}
            </div>

            <button
              onClick={deleteFile}
              disabled={!file.id || deleting}
              className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 rounded-lg px-3 py-2 hover:bg-rose-100 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              {deleting ? 'Deleting...' : 'Delete file permanently'}
            </button>
            {!file.id && <p className="text-[10px] text-gray-400 text-center">Only files uploaded through the admin can be deleted from here.</p>}
          </div>
        )}
      </div>
    </div>
  );
}