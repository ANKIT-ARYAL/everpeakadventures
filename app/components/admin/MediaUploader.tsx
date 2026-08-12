'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  PlayCircle,
  Library,
} from 'lucide-react';
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

  const openPicker = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setPickerOpen(true);
  };

  const handleSelect = (url: string) => {
    onChange(url);
    setPickerOpen(false);
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange('');
  };

  return (
    <div
      className="space-y-2"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {label && (
        <span className="block font-bold text-gray-600 text-[10px] uppercase tracking-wider">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleRemove}
            onMouseDown={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 z-10"
            aria-label="Remove media"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {type === 'video' ? (
            <div
              className={`${heightClass} bg-black flex items-center justify-center`}
            >
              <video
                src={value}
                className="w-full h-full object-cover"
                controls
              />
            </div>
          ) : (
            <div className={heightClass}>
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <button
            type="button"
            onClick={openPicker}
            onMouseDown={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            className="absolute bottom-2 right-2 bg-white/95 text-[#112233] text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-white"
          >
            <Library className="w-3 h-3 inline-block mr-1" />
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          className={`w-full border-2 border-dashed border-gray-200 hover:border-[#24a0ed] rounded-xl ${heightClass} flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-[#24a0ed] transition-colors`}
        >
          {type === 'video' ? (
            <PlayCircle className="w-7 h-7" />
          ) : (
            <UploadCloud className="w-7 h-7" />
          )}

          <span className="text-[11px] font-bold uppercase tracking-wide">
            {type === 'video'
              ? 'Upload Video'
              : 'Upload Image'}
          </span>

          <span className="text-[10px]">
            Click to add from computer or library
          </span>
        </button>
      )}

      <MediaLibraryModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        kind={type}
        insertLabel={type === 'video' ? 'Video' : 'Image'}
        onSelect={handleSelect}
      />
    </div>
  );
}