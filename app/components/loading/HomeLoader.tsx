"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { homeBoot, VIDEO_READY_EVENT } from "@/app/lib/home-boot";

// The homepage is hidden behind an opaque, full-screen black overlay until the
// hero media has genuinely started playing, so the visitor only ever sees the
// loaded site (no jank, no half-fetched video). media-ready fires the reveal;
// the safety cap guarantees the page always appears within a bounded time.
const READY_EXIT_MS = 250;   // media is rendering; give playback a beat
const MIN_TOTAL_MS = 1100;   // keep the logo up long enough to read
const CAP_MS = 8000;         // safety net only - reveal via READY when the
                             // video is really playing, cap in case it never
                             // starts (no JS/block/blocker)

const LOGO_URL =
  "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png";

type Phase = "idle" | "loading" | "exiting" | "gone";

const EASE = [0.76, 0, 0.24, 1] as const;

function Logo() {
  return (
    <div className="flex flex-col items-center gap-8">
<div className="relative">
        {/* Outer layer: continuous zoom-in. Inner layer: one-time bounce. */}
        <div style={{ animation: "home-zoom 2.6s cubic-bezier(0.33, 0, 0.2, 1) 0.55s forwards" }}>
          <div style={{ animation: "home-bounce 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both" }}>
            <img
              src={LOGO_URL}
              alt="Ever Peak Adventure"
              className="h-16 md:h-20 w-auto object-contain opacity-90"
            />
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="w-44 md:w-56 h-[3px] rounded-full bg-white/15 overflow-hidden">
        <div
          className="h-full bg-[#24a0ed] rounded-full"
          style={{ animation: "home-bar 2s ease-in-out forwards" }}
        />
      </div>
    </div>
  );
}

export default function HomeLoader() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
const isHome = pathname === "/";
  const [phase, setPhase] = useState<Phase>(() =>
    isHome ? "loading" : "idle"
  );
  const startedAtRef = useRef<number>(0);
  const presentedOnceRef = useRef(false);

  // Show the loader only while a cold homepage load is in progress. If the
  // user navigates away mid-load, drop the overlay immediately (the "already
  // presented" flag in homeBoot keeps a later nav-back from re-showing it).
  // React's render-phase adjustment pattern keeps this out of an effect.
  if (!isHome && phase !== "idle") {
    setPhase("idle");
  }

  // Gate: only ever show on the first homepage load of this document.
  useEffect(() => {
    if (!isHome) return;
    if (phase !== "loading") return;
    if (presentedOnceRef.current || homeBoot.hasPresentedOnce) return;

    presentedOnceRef.current = true;
    homeBoot.hasPresentedOnce = true;
    startedAtRef.current = Date.now();
  }, [isHome, phase]);

  // Reveal once the hero media is really playing (or the safety cap hits).
  useEffect(() => {
    if (phase !== "loading") return;

    const started = startedAtRef.current;
    let triggered = false;
    let readyTimer: ReturnType<typeof setTimeout> | undefined;

    const reveal = () => {
      if (triggered) return;
      triggered = true;
      if (capTimer) clearTimeout(capTimer);
      setPhase("exiting");
    };

    const capTimer = setTimeout(reveal, CAP_MS);

    const scheduleReveal = () => {
      if (triggered) return;
      const due = Math.max(started + MIN_TOTAL_MS, Date.now() + READY_EXIT_MS);
      readyTimer = setTimeout(reveal, Math.max(0, due - Date.now()));
    };

    const onReady = () => {
      homeBoot.videoReady = true;
      scheduleReveal();
    };

    window.addEventListener(VIDEO_READY_EVENT, onReady);

    // The hero media may report ready before this effect ran (hydration race).
    if (homeBoot.videoReady) scheduleReveal();

    return () => {
      window.removeEventListener(VIDEO_READY_EVENT, onReady);
      if (readyTimer) clearTimeout(readyTimer);
      if (capTimer) clearTimeout(capTimer);
    };
  }, [phase]);

  if (phase === "idle" || phase === "gone") return null;

  // ---------- split-open reveal ----------
  const closed = phase === "loading";

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none bg-black">
      {/* TOP curtain */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 bg-black flex items-start justify-center"
        initial={false}
        animate={closed ? { y: 0 } : { y: "-101%" }}
        transition={{ duration: reducedMotion ? 0.25 : 0.7, ease: EASE }}
      />
      {/* BOTTOM curtain */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-black"
        initial={false}
        animate={closed ? { y: 0 } : { y: "101%" }}
        transition={{ duration: reducedMotion ? 0.25 : 0.7, ease: EASE }}
        onAnimationComplete={() => {
          if (!closed) setPhase("gone");
        }}
      />

      {/* The logo sits on the seam between the two curtains and vanishes as
          they part. It is centered with flex (no transforms), so framer-motion's
          scale never shifts it off-center. It comes later in the DOM so it
          paints ABOVE the black curtains and stays fully visible. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div
          initial={false}
          animate={closed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reducedMotion ? 1 : 0.6 }}
          transition={{ duration: reducedMotion ? 0.3 : 0.45, ease: "easeInOut" }}
        >
          <Logo />
        </motion.div>
      </div>
    </div>
  );
}