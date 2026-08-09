# Homepage Loader + Reveal — Design

Date: 2026-08-08
Status: Approved (approach chosen, awaiting spec review)

## Goal

Show a brand loading screen (logo "filling with color" on dark navy) before the homepage hero video is ready, then reveal the page with a cross-fade + slight zoom. The loader appears **only** on a full page load while on the homepage (initial visit **or** refresh while on `/`). It never appears when soft-navigating back to `/` mid-session, and never appears on any other page.

## Current State

- `app/components/home/Hero.tsx` (server component) renders a YouTube `<iframe>` (autoplay/mute/loop, `pointer-events-none`) as the hero background, then `HeroContent`.
- `app/components/home/HeroContent.tsx` (`"use client"`) renders the text/CTA content — no video signal available today because the iframe lives in the server component.
- The brand logo is a **remote WordPress PNG** (`app/components/layout/Navbar.tsx`, the `logoImage` default URL). There is no local transparent logo asset.
- Existing tools: framer-motion (`app/components/animations/Motion.tsx` exports `MotionProvider`, `Reveal`, etc.), Tailwind. Brand colors: navy `#112233`, lighter navy `#172a3a`, blues `#24a0ed` / `#3bbae6`, amber `#f59e0b`.
- App Router layout: `app/layout.tsx` wraps everything in `MotionProvider` and renders `NavbarWrapper` / `Footer` / `ContactWidgetWrapper` — admin routes excluded via header pathname.

## Design Decisions (user-approved)

1. **Trigger = iframe loaded + min time.** Reveal when the hero iframe fires `onLoad`, but never wait longer than a ~2.5s cap. Not the YouTube IFrame API (can block forever if YouTube is slow/blocked).
2. **Logo source = existing navbar logo PNG.** The "fill" effect is a color wash over the rendered image (mask/clip or gradient overlay), not a stroke-fill inside the logo.
3. **Reveal = cross-fade + slight zoom.** Loader fades/scales away while homepage fades/scales in over ~600ms.
4. **Nav-back handling = skip loader on navigation; warm the cache.** The loader is gated by a module-level `hasPresentedOnce` flag so soft navs never trigger it; browser cache + `preconnect`/`prefetch` warm the video for revisits.
5. **Background = pure black full-screen overlay** at `z-[9999]` (above the `z-50` navbar), so during loading **nothing else is visible** — no navbar, no content. Only the logo.
6. **Video must be *playing*, not just loaded:** reveal fires only after the hero video has been playing for ~1.2s (`PLAY_BUFFER_MS`), with a `MIN_TOTAL_MS` (2.6s) floor so the logo is readable and the fill animation completes, and a hard `CAP_MS` (6.5s) that always reveals.

## How the "harden" gating works

Soft nav (App Router `push/back`) does **not** remount the root layout, but it **does** re-run the page component. A shared module in the layout (a plain object with a `hasPresentedOnce` boolean, imported by both the loader and the video signal) behaves as follows:

- First full page load whose initial route is `/` and the flag is `false` → **loader + video mount occurs**.
- Anyone visiting another page → loader skips (condition `pathname === "/"` fails).
- Soft-navigating back to `/` mid-session → flag already `true` → loader does **not** mount; iframe re-runs the video in a warm browser cache.
- Refresh while on `/` → new document, module flag resets to `false`, `/` is the initial route → loader **does** show.

## Components

### 1. `app/components/home/HeroVideo.tsx` (`"use client"`)

Replaces the inline iframe with a client component so `onLoad` is observable:

```tsx
export default function HeroVideo({ videoUrl }: { videoUrl: string }) {
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("everpeak:video-ready"));
  }, []); // iframe onLoad alternative
  return <iframe src={videoUrl} ... onLoad={() => /* fire event */} />;
}
```

Behavior:
- Renders the exact same iframe markup/classes currently in `Hero.tsx` (absolute, sized `177.77vh` × `56.25vw` etc.).
- `onLoad` on the iframe dispatches `window.dispatchEvent(new CustomEvent("everpeak:video-ready"))`.
- Also fires a `useEffect` fallback mark if the iframe fires (belt-and-suspenders).
- `Hero.tsx` keeps its DB fetch and passes `videoUrl` (built exactly as today) to `<HeroVideo videoUrl={videoUrl} />`.
- **Reveal pacing:** `everpeak:video-ready` is treated as "embed loaded"; reveal schedules `max(MIN_TOTAL_MS, now + PLAY_BUFFER_MS)` so the video has actually been rendering frames ~1.2s before the page appears. `CAP_MS` always reveals as a fail-safe.

### 2. `app/lib/home-boot.ts` (plain module, no React)
```ts
export const boot = { hasPresentedOnce: false };
```
Single shared flag lives here.

### 3. `app/components/loading/HomeLoader.tsx` (`"use client"`)
Coordinator component mounted by `app/layout.tsx` inside `MotionProvider` (client boundary):

- `usePathname()`: only render anything when `pathname === "/"` and `!boot.hasPresentedOnce`.
- Immediately sets `boot.hasPresentedOnce = true` (so a fast soft nav to `/` later won't remount the loader).
- State machine: `visible` → while loading; listens for `"everpeak:video-ready"`; a `setTimeout` cap at 2.5s.
- On ready or cap: run exit animation (fade + slight scale), then unmount and dispatch nothing further.
- Paints a full-viewport overlay (`fixed inset-0 z-[90] bg-[#111233]`) with:
  - Centered existing logo PNG (`h-24`-ish).
  - A gradient color-fill wash sweeping bottom→top over the logo (CSS `mask`/gradient overlay), effectively "slowly filling with color".
  - A thin animated progress bar beneath.

### 4. `app/layout.tsx` changes
- Add `<HomeLoader />` inside `<MotionProvider>` (after Navbar/Footer area, must be a client component there; mount once regardless of admin — internal gates in component).
- Admin routes: loader internally skips non-`/` regardless.

## Reveal transition detail

When reveal fires:

- The loader overlay animates `opacity 1 → 0` and `scale 1 → 1.04` over ~600ms `easeOut`, then unmounts (framer-motion `AnimatePresence`).
- The homepage content (`main`) is revealed by the overlay disappearing; to add the slight zoom the loader's scale-out provides the parallax feel without re-rendering server content.

## Error / resilience

- Iframe `onLoad` never fires (YouTube blocked / slow / network down) → 2.5s cap unmounts the loader; homepage fully usable.
- Reduced motion: `MotionProvider` already honors `reducedMotion="user"`; exit animation disables scale for those users.
- Admin pages: never render the loader (path check).
- `boot.hasPresentedOnce` is per-document-memory (not persisted) — a refresh starts fresh, a soft nav does not re-run loader.

## Stability / cache

- Add `<link rel="preconnect" href="https://www.youtube.com" />` and `https://i.ytimg.com` in layout head for faster revisit warm-up.
- No database, schema, or API changes. Pure client-side.

## Testing / verification

1. `npm run dev`, load `/` fresh — loader shows, page reveals on iframe ready (or ≤2.5s).
2. Click a nav link elsewhere (e.g., `/about-us`), then navigate back to `/` — **no loader** (flag `true`), content appears immediately.
3. Refresh the browser while on `/` — loader shows again.
4. Visit `/trekking` directly — **no loader**.
5. Block YouTube in devtools → homepage still reveals ≤2.5s.
6. `npm run build` passes; no lint errors in new files.

## Out of scope

- Not changing the admin pages or other pages reveal behavior.
- Not adding a custom transparent logo asset (uses existing navbar PNG).
- Not using the YouTube IFrame API (SDK) or iframe postMessage status.