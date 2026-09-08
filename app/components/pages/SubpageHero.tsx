'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SubpageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export default function SubpageHero({ title, subtitle, image }: SubpageHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const fallbackImage = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop';
  const displayImage = image || fallbackImage;

  return (
    <div className="relative w-full h-[50vh] min-h-[350px] max-h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <img 
          src={displayImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Dark Gradient Overlay for perfect text contrast and navbar integration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#112233]/80 via-[#112233]/40 to-[#112233]/90 z-10" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center mt-16 px-5 lg:px-20 max-w-[1400px] mx-auto w-full"
      >
        <h1 className="text-[2.5rem]  font-display font-black text-white tracking-tight drop-shadow-xl mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[1rem] md:text-[1.5rem] text-white/90 font-sans font-medium drop-shadow-md">
            {subtitle}
          </p>
        )}
      </motion.div>


    </div>
  );
}
