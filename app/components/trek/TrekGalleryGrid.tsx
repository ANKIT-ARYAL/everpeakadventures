"use client";

import React, { useState } from 'react';
import { Camera, Star } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface TrekGalleryGridProps {
  title: string;
  mainImage: string;
  galleryImages: string[];
}

export default function TrekGalleryGrid({ title, mainImage, galleryImages }: TrekGalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Combine main image with gallery images for the lightbox
  const allImages = [...new Set([mainImage, ...galleryImages].filter(Boolean))];
  const slides = allImages.map(src => ({ src }));

  // Pick the first two gallery images for the right side, or fallback to the main image
  const rightImage1 = galleryImages[0] || mainImage;
  const rightImage2 = galleryImages[1] || rightImage1;

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 rounded-3xl overflow-hidden shadow-sm relative mt-4 md:mt-8 mb-6 h-[400px] md:h-[500px]">
        
        {/* Left Column (Main Image) */}
        <div 
          className="lg:col-span-2 relative group cursor-pointer overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <img 
            src={mainImage} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          
          {/* Best Seller Badge */}
          <div className="absolute top-4 left-4 bg-amber-400 text-[#112233] font-bold text-md uppercase tracking-wider px-3 py-1.5 rounded flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-current" />
            Best Seller
          </div>

          {/* View Photos Button (Mobile Only) */}
          <div className="absolute bottom-6 left-6 z-10 lg:hidden">
            <button className="bg-white/95 backdrop-blur text-[#112233] hover:bg-white font-bold text-lg px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-colors border border-gray-100 cursor-pointer">
              <Camera className="w-5 h-5" />
              View All
            </button>
          </div>
        </div>

        {/* Right Column (2 Smaller Images) */}
        <div className="hidden lg:flex flex-col gap-2 md:gap-4 h-full">
          <div 
            className="flex-1 relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(Math.max(0, allImages.indexOf(rightImage1)))}
          >
            <img 
              src={rightImage1} 
              alt={`${title} gallery 1`} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          
          <div 
            className="flex-1 relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(Math.max(0, allImages.indexOf(rightImage2)))}
          >
            <img 
              src={rightImage2} 
              alt={`${title} gallery 2`} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            
            <div className="absolute bottom-6 right-6">
              <span className="bg-white/95 backdrop-blur text-[#112233] hover:bg-white font-bold text-md px-5 py-2.5 rounded-lg shadow border border-gray-100 uppercase tracking-wider flex items-center gap-2 transition-colors">
                <Camera className="w-4 h-4" />
                View All {allImages.length > 3 ? `(+${allImages.length - 3})` : `(${allImages.length})`}
              </span>
            </div>
          </div>
        </div>

      </div>

      <Lightbox
        className="trek-gallery-lightbox"
        carousel={{ padding: 0, imageFit: "contain" }}
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={slides}
      />
    </>
  );
}
