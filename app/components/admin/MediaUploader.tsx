'use client';

import React, { useState } from 'react';
import { UploadCloud, X, PlayCircle, Library } from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';

interface Props {
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video';
  label?: string;
  heightClass?: string;
}

export default function MediaUploader({
  value,
  onChange,
  type = 'image',
  label,
  heightClass = 'h-40',
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

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
            onClick={() => setPickerOpen(true)}
            className="absolute bottom-2 right-2 bg-white/95 text-[#112233] text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-white"
          >
            <Library className="w-3 h-3 inline-block mr-1" />
            Replace
          </button>
        </div>
      ) : (
        <div className={`border-2 border-dashed border-gray-200 hover:border-[#24a0ed] rounded-xl ${heightClass}`}>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-[#24a0ed] transition-colors py-2"
          >
            {type === 'video' ? <PlayCircle className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
            <span className="text-[11px] font-bold uppercase tracking-wide">
              {type === 'video' ? 'Upload Video' : 'Upload Image'}
            </span>
            <span className="text-[10px]">Click to add from computer or library</span>
          </button>
        </div>
      )}

      {value && (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full text-[11px] font-bold text-[#24a0ed] hover:bg-blue-50 border border-blue-100 rounded-lg py-1.5 flex items-center justify-center gap-1.5"
        >
          <Library className="w-3.5 h-3.5" /> Choose from Library
        </button>
      )}

      <MediaLibraryModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        kind={type}
        insertLabel={type === 'video' ? 'Video' : 'Image'}
        onSelect={(url) => {
          onChange(url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
