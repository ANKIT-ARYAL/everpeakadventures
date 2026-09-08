'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
  image: string;
}

export default function PageHeroClient({ title, subtitle, image }: Props) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Dark Gradient Overlay for perfect text contrast and navbar integration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#112233]/80 via-[#112233]/40 to-[#112233]/80 z-10" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="relative z-20 text-center mt-16 px-5 lg:px-20 max-w-[1400px] mx-auto w-full"
      >
        <h1 className="text-4xl md:text-6xl font-black text-white oswald tracking-wide uppercase drop-shadow-xl mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-200 font-medium drop-shadow-md">
            {subtitle}
          </p>
        )}
      </motion.div>


    </div>
  );
}
