/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const dragDepth = useRef(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'unused'>('all');
  const [preview, setPreview] = useState<GalleryFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging] = useState(false);

  const filtered = useMemo(() => {
    return files.filter((f) => {
      if (filter === 'image' && f.kind !== 'image') return false;
      if (filter === 'video' && f.kind !== 'video') return false;
      if (filter === 'unused' && f.usedIn.length > 0) return false;
      if (query && !f.url.toLowerCase().includes(query.toLowerCase()) && !(f.originalName || '').toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [files, query, filter]);

  const doUpload = async (filesList: File[]) => {
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await doUpload(Array.from(e.target.files || []));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    doUpload(Array.from(e.dataTransfer.files || []));
  };

  return (
    <>
      <div
        onDragEnter={(e) => { e.preventDefault(); dragDepth.current++; setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (dragDepth.current === 0) setDragging(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={dragging ? 'bg-blue-50 transition-colors min-w-0' : 'transition-colors min-w-0'}
      >
        <div className="px-4 sm:px-5 py-3.5 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
          <div className="relative flex-1 w-full min-w-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#24a0ed] text-sm bg-white"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto shrink-0">
            {(['all', 'image', 'video', 'unused'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded text-xs sm:text-sm font-bold capitalize transition-colors whitespace-nowrap cursor-pointer ${filter === f ? 'bg-white text-[#112233] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {f === 'unused' ? 'Unused' : f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos'}
              </button>
            ))}
          </div>
          <button
            onClick={() => uploadRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-1.5 bg-[#24a0ed] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-[#1289d1] disabled:opacity-60 disabled:cursor-not-allowed shrink-0 transition-colors cursor-pointer"
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
          <div className="mx-4 sm:mx-5 mt-4 px-4 py-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs sm:text-sm font-bold rounded-lg">
            {uploadError}
          </div>
        )}

        <div
          onDragEnter={(e) => { e.preventDefault(); dragDepth.current++; setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (dragDepth.current === 0) setDragging(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => uploadRef.current?.click()}
          className={`m-4 sm:m-5 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors p-6 sm:p-8 ${dragging ? 'border-[#24a0ed] bg-blue-50' : 'border-gray-300 hover:border-[#24a0ed] hover:bg-blue-50/40'}`}
        >
          {uploading ? (
            <div>
              <Loader2 className="w-8 h-8 animate-spin text-[#24a0ed] mx-auto mb-2" />
              <p className="font-bold text-gray-700 text-sm">Uploading files...</p>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-bold text-gray-700 text-sm sm:text-base">Drop files here to upload</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">or click to browse your computer</p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm font-medium">No files found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 min-w-0">
              {filtered.map((file) => (
                <div key={file.url} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer shadow-sm hover:border-[#24a0ed] transition-all min-w-0" onClick={() => setPreview(file)}>
                  {file.kind === 'video' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <video src={file.url} className="w-full h-full object-cover" preload="metadata" muted />
                      <Film className="absolute text-white/80 w-6 h-6" />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {file.usedIn.length > 0 ? `${file.usedIn.length} use${file.usedIn.length > 1 ? 's' : ''}` : 'Unused'}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2.5 pt-6 pb-2 text-[11px] font-bold text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.originalName || file.url.split('/').pop()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {preview && (
        <FileLightbox
          key={preview.url}
          file={preview}
          slots={slots}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}

export function FileLightbox({ file, slots, onClose }: { file: GalleryFile; slots: SlotValue[]; onClose: () => void }) {
  const router = useRouter();
  const [selectedSlots, setSelectedSlots] = useState<ImageSlotKey[]>(() =>
    slots.filter((s) => s.value === file.url).map((s) => s.key)
  );
  const [slotSearch, setSlotSearch] = useState('');
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
        body: JSON.stringify({ url: file.url, slots: selectedSlots, availableSlots: slots.map(s => s.key) }),
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
    if (!file.id && !file.url.startsWith('/uploads')) return;
    const warn = file.usedIn.length > 0
      ? `This file is used in ${file.usedIn.length} place${file.usedIn.length > 1 ? 's' : ''}. Deleting it will break those pages. Delete anyway?`
      : 'Delete this file permanently?';
    if (!window.confirm(warn)) return;
    setDeleting(true);
    setActionError('');
    try {
      const res = file.id
        ? await fetch(`/api/media/${file.id}`, { method: 'DELETE' })
        : await fetch('/api/media', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: file.url }),
          });
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-4 md:p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-4 sm:p-6 min-w-0" onClick={(e) => e.stopPropagation()}>
        <div className="p-2 sm:p-3 border-b border-gray-200 flex items-center justify-between gap-3 flex-wrap min-w-0">
          <div className="font-black text-[#112233] text-base sm:text-lg truncate pr-4 min-w-0 flex-1">
            {file.originalName || file.url.split('/').pop()}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#112233] text-white px-3 py-2 rounded-lg hover:bg-[#1e3a52] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy URL'}
            </button>
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm font-bold text-gray-600 transition-colors cursor-pointer">
              Close
            </button>
          </div>
        </div>

        {actionError && (
          <div className="mx-4 mt-4 px-4 py-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs sm:text-sm font-bold rounded-lg">
            {actionError}
          </div>
        )}

        <div className="p-4 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 min-w-0">
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[260px] p-2">
            {file.kind === 'video' ? (
              <video src={file.url} className="max-h-[50vh] w-full object-contain rounded-lg" controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={file.url} alt="" className="max-h-[50vh] w-full object-contain rounded-lg" />
            )}
          </div>
          <div className="space-y-4 text-sm min-w-0">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Link2 className="w-3 h-3" /> URL
              </div>
              <div className="font-mono text-xs text-gray-600 break-all bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                {file.url}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Size</div>
              <div className="text-gray-700 font-semibold">{fmtSize(file.size) || '—'}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Used in ({file.usedIn.length})</div>
              {file.usedIn.length === 0 ? (
                <p className="text-gray-400 italic text-xs">Not used anywhere yet.</p>
              ) : (
                <ul className="mt-1 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {file.usedIn.map((u, i) => (
                    <li key={i} className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-2 text-gray-600 break-words">
                      <span className="font-bold text-[#24a0ed] uppercase text-[10px] block">{u.type}</span>
                      <span className="font-medium text-gray-700">{u.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {file.kind === 'image' && (
          <div className="p-4 pt-0 space-y-4 min-w-0">
            <div className="border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3 bg-white">
              <h4 className="font-bold text-[#112233] uppercase tracking-wide text-xs sm:text-sm flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#24a0ed]" /> Assign to website sections
              </h4>
              <p className="text-xs text-gray-500">Check the sections that should show this image. Saving overrides those sections.</p>
              
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={slotSearch}
                  onChange={(e) => setSlotSearch(e.target.value)}
                  placeholder="Quick search sections..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#24a0ed] bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {slots
                  .filter(slot => slot.label.toLowerCase().includes(slotSearch.toLowerCase()))
                  .map((slot) => {
                  const active = selectedSlots.includes(slot.key);
                  return (
                    <label key={slot.key} className={`flex items-center gap-3 border rounded-xl p-2.5 cursor-pointer transition-colors ${active ? 'border-[#24a0ed] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleSlot(slot.key)}
                        className="w-4 h-4 accent-[#24a0ed]"
                      />
                      <span className="w-9 h-9 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                        {slot.value ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={slot.value} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-[9px] text-gray-300 font-bold">—</span>
                        )}
                      </span>
                      <span className="text-xs font-bold text-gray-700 leading-tight truncate min-w-0 flex-1">{slot.label}</span>
                    </label>
                  );
                })}
              </div>
              <button
                onClick={savePlacement}
                disabled={savingSlots}
                className={`w-full mt-2 inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold rounded-xl px-4 py-2.5 transition-colors cursor-pointer ${savedFlash ? 'bg-emerald-500 text-white' : 'bg-[#24a0ed] text-white hover:bg-[#1289d1]'} disabled:opacity-60`}
              >
                {savingSlots ? <Loader2 className="w-4 h-4 animate-spin" /> : savedFlash ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {savingSlots ? 'Saving...' : savedFlash ? 'Saved' : 'Save placement'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3 bg-white">
              <h4 className="font-bold text-[#112233] uppercase tracking-wide text-xs sm:text-sm flex items-center gap-1.5">
                <Pencil className="w-4 h-4 text-[#24a0ed]" /> Rename File
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  disabled={!file.id}
                  placeholder="File name"
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#24a0ed] disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  onClick={saveName}
                  disabled={!file.id || savingName}
                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold bg-[#112233] text-white px-4 py-2.5 rounded-xl hover:bg-[#1e3a52] disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                >
                  {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Name
                </button>
              </div>
              {!file.id && <p className="text-[11px] text-gray-400">Legacy file (pre-database upload) - rename only works for files uploaded through the admin.</p>}
            </div>

            <button
              onClick={deleteFile}
              disabled={!file.id && !file.url.startsWith('/uploads') || deleting}
              className="inline-flex items-center justify-center gap-1.5 w-full text-xs sm:text-sm font-bold bg-rose-50 text-rose-600 border border-rose-100 rounded-xl px-4 py-3 hover:bg-rose-100 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Deleting...' : 'Delete file permanently'}
            </button>
            {!file.id && !file.url.startsWith('/uploads') && (
              <p className="text-[11px] text-gray-400 text-center">Only files stored on this website can be deleted from here.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}