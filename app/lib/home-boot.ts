"use client";

// Per-document "have we presented the homepage loader" flag.
// Because this module is only re-executed on a full page load (refresh/new tab)
// and survives across App Router soft navigations, it exactly distinguishes:
//   - initial load on "/"  -> false  -> show loader
//   - refresh while on "/" -> false (new document) -> show loader
//   - soft-nav back to "/" -> true   -> skip loader
export const VIDEO_READY_EVENT = "everpeak:video-ready";

export const homeBoot = {
  hasPresentedOnce: false,
  // Set once the hero media is genuinely rendering (video playing / image
  // loaded), read by HomeLoader so a fast media load isn't missed.
  videoReady: false,
};

// Shared helper: heroes of any media type call this once they are really
// playing/displayed, so the loader and media stay in sync without coupling.
export function markVideoReady() {
  if (homeBoot.videoReady) return;
  homeBoot.videoReady = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(VIDEO_READY_EVENT));
  }
}