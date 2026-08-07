'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, X, Loader2, PlayCircle } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  type?: 'image' | 'video';
  label?: string;
  heightClass?: string;
}

export default function MediaUploader({
  value,
  onChange,
  accept,
  type = 'image',
  label,
  heightClass = 'h-40',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', type);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <span className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">{label}</span>}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 z-10"
            aria-label="Remove media"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {type === 'video' ? (
            <div className={`${heightClass} bg-black flex items-center justify-center`}>
              <video src={value} className="w-full h-full object-cover" controls />
            </div>
          ) : (
            <div className={heightClass}>
              <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
            </div>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white/95 text-[#112233] text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-white"
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full border-2 border-dashed border-gray-200 hover:border-[#24a0ed] rounded-xl flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-[#24a0ed] transition-colors ${heightClass}`}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-[#24a0ed]" />
          ) : type === 'video' ? (
            <PlayCircle className="w-7 h-7" />
          ) : (
            <UploadCloud className="w-7 h-7" />
          )}
          <span className="text-[11px] font-bold uppercase tracking-wide">
            {uploading ? 'Uploading...' : type === 'video' ? 'Upload Video' : 'Upload Image'}
          </span>
          <span className="text-[10px]">Click to browse</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept || (type === 'video' ? 'video/*' : 'image/*')}
        onChange={handleFile}
        className="hidden"
      />
      {error && <p className="text-rose-600 text-[10px] font-bold">{error}</p>}
    </div>
  );
}