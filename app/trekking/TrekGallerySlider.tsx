'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  mainImage: string;
  galleryImages: string[];
}

export default function TrekGallerySlider({ mainImage, galleryImages }: Props) {
  const firstGallery = galleryImages && galleryImages.length > 0 ? galleryImages[0] : null;
  const images = [firstGallery, mainImage].filter(Boolean) as string[];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50 rounded-xl">
        No images available
      </div>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden shadow-sm border border-gray-100 h-[340px] group w-full">
      <img 
        src={images[currentSlide]} 
        alt={`Trek slide ${currentSlide + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
      />
      
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide} 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={nextSlide} 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}