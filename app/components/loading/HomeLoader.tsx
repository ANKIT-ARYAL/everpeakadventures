"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LOGO_URL = "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png";

export default function HomeLoader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [show, setShow] = useState(isHome);

  useEffect(() => {
    if (!isHome) return;
    const timer = setTimeout(() => setShow(false), 1000);
    return () => clearTimeout(timer);
  }, [isHome]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-none transition-opacity duration-500" style={{ opacity: show ? 1 : 0 }}>
      <div className="flex flex-col items-center gap-8">
        <img src={LOGO_URL} alt="Logo" className="h-16 md:h-20 opacity-90 animate-pulse" />
        <div className="w-44 md:w-56 h-[3px] rounded-full bg-white/15 overflow-hidden">
          <div className="h-full bg-[#24a0ed] rounded-full" style={{ animation: "home-bar 1s ease-in-out forwards" }} />
        </div>
      </div>
    </div>
  );
}
