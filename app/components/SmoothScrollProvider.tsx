'use client';

import React, { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Safety net: force reset body overflow on navigation 
    // in case a modal or gallery was unmounted improperly.
    document.body.style.overflow = '';
    
    // Reset lenis scroll position immediately
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
      lenisRef.current.lenis.resize(); // force recalculate height
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Global listener for details/summary toggles or DOM size changes
  useEffect(() => {
    const handleToggle = () => {
      if (lenisRef.current?.lenis) {
        // Small delay to allow DOM to finish painting/expanding
        setTimeout(() => {
          lenisRef.current.lenis.resize();
        }, 50);
        setTimeout(() => {
          lenisRef.current.lenis.resize();
        }, 350); // Second resize for any CSS transitions (duration-300)
      }
    };

    // Listen to native toggle events (accordions/details)
    document.addEventListener('toggle', handleToggle, true);
    
    // Also observe body height changes forcefully
    const observer = new ResizeObserver(() => {
      handleToggle();
    });
    observer.observe(document.body);

    return () => {
      document.removeEventListener('toggle', handleToggle, true);
      observer.disconnect();
    };
  }, []);

  return (
    <ReactLenis ref={lenisRef} root options={{ lerp: 0.05, duration: 2.0, smoothWheel: true, wheelMultiplier: 0.8 }}>
      {children}
    </ReactLenis>
  );
}
