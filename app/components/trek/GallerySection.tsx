'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  X, ChevronLeft, ChevronRight, Maximize2, ZoomIn, Download, Fullscreen,
} from 'lucide-react';

interface Photo {
  src: string;
  caption?: string;
}

interface Props {
  photos: Photo[];
}

export default function GallerySection({ photos }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, next, prev]);

  if (!photos || photos.length === 0) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = photos[index].src;
    a.download = `everpeak-${index + 1}.jpg`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
      <h2 className="text-lg md:text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
        Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIndex(i);
              setZoomed(false);
              setOpen(true);
            }}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#24a0ed]"
            aria-label={`View image ${i + 1} of ${photos.length}`}
          >
            <img
              src={p.src}
              alt={p.caption || `Gallery image ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <ZoomIn className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </button>
        ))}
      </div>

      {/* LIGHTBOX */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={() => setOpen(false)}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-bold tabular-nums">
              {index + 1}/{photos.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle fullscreen"
              >
                <Fullscreen className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${zoomed ? 'bg-white/20' : ''}`}
                aria-label="Toggle zoom"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={download}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Download image"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image area */}
          <div
            className="flex-1 flex items-center justify-center px-14 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={photos[index].src}
              alt={photos[index].caption || `Gallery image ${index + 1}`}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setZoomed((z) => !z)}
            />

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption bar */}
          {photos[index].caption && (
            <div
              className="px-4 py-3 text-center text-white text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {photos[index].caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
}