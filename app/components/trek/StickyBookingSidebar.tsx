"use client";

import React, { useEffect, useRef, useState } from "react";

const TOP_OFFSET = 148;
const BOTTOM_GAP = 20;
const TABLET_QUERY = "(min-width: 768px)";

type StickyMode = "normal" | "fixed" | "absolute";

interface StickyState {
  mode: StickyMode;
  left: number;
  width: number;
  height: number;
  absoluteTop: number;
}

interface StickyBookingSidebarProps {
  children: React.ReactNode;
}

export default function StickyBookingSidebar({
  children,
}: StickyBookingSidebarProps) {
  const placeholderRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [state, setState] = useState<StickyState>({
    mode: "normal",
    left: 0,
    width: 0,
    height: 0,
    absoluteTop: 0,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(TABLET_QUERY);

    const measure = () => {
      frameRef.current = null;

      const placeholder = placeholderRef.current;
      const panel = panelRef.current;
      const section = placeholder?.closest<HTMLElement>(
        "[data-sticky-booking-section]"
      );

      if (!placeholder || !panel || !section || !mediaQuery.matches) {
        setState((current) =>
          current.mode === "normal"
            ? current
            : { mode: "normal", left: 0, width: 0, height: 0, absoluteTop: 0 }
        );
        return;
      }

      const placeholderRect = placeholder.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const maxPanelHeight = Math.max(
        240,
        window.innerHeight - TOP_OFFSET - BOTTOM_GAP
      );

      const panelHeight = Math.min(panel.scrollHeight, maxPanelHeight);
      const absoluteTop = Math.max(0, section.offsetHeight - panelHeight);

      let mode: StickyMode = "normal";

      if (sectionRect.top <= TOP_OFFSET) {
        mode =
          sectionRect.bottom - panelHeight <= TOP_OFFSET
            ? "absolute"
            : "fixed";
      }

      setState({
        mode,
        left: placeholderRect.left,
        width: placeholderRect.width,
        height: panelHeight,
        absoluteTop,
      });
    };

    const scheduleMeasure = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    mediaQuery.addEventListener("change", scheduleMeasure);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      mediaQuery.removeEventListener("change", scheduleMeasure);
    };
  }, []);

  const panelStyle: React.CSSProperties =
    state.mode === "fixed"
      ? {
          position: "fixed",
          top: TOP_OFFSET,
          left: state.left,
          width: state.width,
          maxHeight: state.height,
          overflowY: "auto",
          zIndex: 20,
        }
      : state.mode === "absolute"
        ? {
            position: "absolute",
            top: state.absoluteTop,
            left: 0,
            width: "100%",
            maxHeight: state.height,
            overflowY: "auto",
            zIndex: 20,
          }
        : {};

  return (
    <aside
      ref={placeholderRef}
      className="relative md:order-2 md:self-start"
      style={
        state.mode === "fixed" || state.mode === "absolute"
          ? { minHeight: state.height }
          : undefined
      }
    >
      <div
        ref={panelRef}
        data-lenis-prevent-wheel
        className="space-y-6 md:pr-1"
        style={panelStyle}
      >
        {children}
      </div>
    </aside>
  );
}
