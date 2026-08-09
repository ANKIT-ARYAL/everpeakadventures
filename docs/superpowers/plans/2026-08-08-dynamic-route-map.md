# Dynamic Route Map (Trek + Tour) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the detailed EBC/Gokyo-style route map data-driven so every trek and tour has its own route map (peaks, route points, segments), editable from the admin panel, replacing the hardcoded block on the trek detail page.

**Architecture:** Add a single `routeMap Json?` column to `Trek` and `Tour`. Admin forms (reuse) a new shared `RouteMapEditor.tsx` repeatable editor whose value is persisted through the four existing whitelisting API routes (added `routeMap` field). Public trek/tour detail pages render `DetailedRouteMap` from `routeMap` JSON, keeping the uploaded `mapImage` above and deriving the elevation profile from the existing `itinerary` JSON (no duplicate elevation editor).

**Tech Stack:** Next.js App Router (server-rendered pages), Prisma 7 (`@prisma/client` via `@prisma/adapter-pg` driver adapter), Tailwind, lucide-react icons, `framer-motion`.

## Global Constraints

- Prisma 7 with driver adapter (`PrismaPg`). Client instantiated in `lib/prisma.ts` — must NOT be re-instantiated.
- No `prisma/migrations` directory: apply schema changes with `npx prisma db push`, then `npx prisma generate`.
- Schema is PostgreSQL provider with no `url` in datasource (URL comes from `prisma.config.ts` → `DATABASE_URL`).
- The four API routes **whitelist fields** — every one must add `routeMap: body.routeMap ?? null` or the field silently drops.
- `TrekForm` and `TourForm` both spread `formData` into the POST/PUT body, so adding `routeMap` to form state is sufficient on the client; the routes do the whitelisting.
- The trek form submits to `/api/treks` and `/api/treks/[id]`; the tour form submits to `/api/admin/tours` and `/api/admin/tours/[id]`.
- `DetailedRouteMap` is `'use client'`; `RouteMapImage` and the shared `RouteMapEditor` are client components.
- Public pages are async Server Components passing serializable JSON to the client map component.
- Elevation profile is derived from itinerary at render: `itinerary.filter(d => d && d.title).map(d => ({ day: d.day, location: d.title, elevation: Number(d.elev) || 0 }))`.
- No test framework is configured. Verification = `npx tsc`, `npx eslint`, and runtime checks against the dev server on `http://localhost:3000`.

---

### Task 1: Schema + DB push + generate

**Files:**
- Modify: `prisma/schema.prisma` (add `routeMap Json?` after Trek `mapImage` at line 95 and Tour `mapImage` at line 154)

**Interfaces:**
- Produces: `Trek.routeMap: Json?`, `Tour.routeMap: Json?` available on Prisma query results.

- [ ] **Step 1: Add the field to the Trek model**

In `prisma/schema.prisma`, inside `model Trek`, add `routeMap Json?` right after `mapImage String?` (line 95), keeping the existing alignment block:

```prisma
  mapUrl          String?
  mapImage        String?
  routeMap        Json?

  isBestSeller    Boolean          @default(false)
```

- [ ] **Step 2: Add the field to the Tour model**

Inside `model Tour`, add `routeMap Json?` right after the `mapImage` line (line 154):

```prisma
  mapUrl          String?                           // Route map / elevation chart URL
  mapImage        String?                           // Uploaded route-map graphic
  routeMap        Json?
```

- [ ] **Step 3: Validate and format the schema**

Run: `npx prisma validate`
Expected: schema is valid.

Run: `npx prisma format`
Expected: file reformatted without errors.

- [ ] **Step 4: Push schema to DB**

Run: `npx prisma db push`
NOTE: This is additive (`Json?` nullable) — no data loss. If Prisma asks for destructive-command consent, the change is additive-only and safe; reply accordingly.

Expected: `The database is now in sync with the schema.`

- [ ] **Step 5: Regenerate client**

Run: `npx prisma generate`
Expected: `Generated Prisma Client`.

- [ ] **Step 6: Verify TypeScript sees the field**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add routeMap Json to Trek and Tour"
```

---

### Task 2: Shared RouteMapEditor component

**Files:**
- Create: `app/components/admin/RouteMapEditor.tsx` (same directory as the `MediaUploader`/`RichTextEditor` the forms already import)

**Interfaces:**
- Consumes: `RouteMapData` shape from `RoutePointData`/`RouteSegmentData`/`PeakData`.
- Produces: `RouteMapEditor({ value, onChange }: { value?: RouteMapData; onChange: (v: RouteMapData) => void })`.
- Types (also used by Task 5/6 rendering, defined inline here so later tasks import or duplicate safely):

```ts
export type RoutePointType = 'start' | 'end' | 'trek' | 'acclimatization' | 'peak' | 'lake' | 'pass' | 'airport' | 'helipad';
export type SegmentType = 'trekking' | 'secondary' | 'driving' | 'flight';
export interface PeakData { name: string; elevation: number; x: number; y: number; }
export interface RoutePointData { id: string; name: string; elevation: number; x: number; y: number; type: RoutePointType; day?: number; }
export interface RouteSegmentData { from: string; to: string; type: SegmentType; }
export interface RouteMapData { title?: string; subtitle?: string; brandName?: string; brandTagline?: string; footerUrl?: string; maxAltitude?: number; peaks: PeakData[]; routePoints: RoutePointData[]; routeSegments: RouteSegmentData[]; }
```

A default empty structure:

```ts
export const EMPTY_ROUTE_MAP: RouteMapData = { peaks: [], routePoints: [], routeSegments: [] };
```

- [ ] **Step 1: Create the component**

Create `app/components/admin/RouteMapEditor.tsx`:

```tsx
'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export type RoutePointType = 'start' | 'end' | 'trek' | 'acclimatization' | 'peak' | 'lake' | 'pass' | 'airport' | 'helipad';
export type SegmentType = 'trekking' | 'secondary' | 'driving' | 'flight';
export interface PeakData { name: string; elevation: number; x: number; y: number; }
export interface RoutePointData { id: string; name: string; elevation: number; x: number; y: number; type: RoutePointType; day?: number; }
export interface RouteSegmentData { from: string; to: string; type: SegmentType; }
export interface RouteMapData { title?: string; subtitle?: string; brandName?: string; brandTagline?: string; footerUrl?: string; maxAltitude?: number; peaks: PeakData[]; routePoints: RoutePointData[]; routeSegments: RouteSegmentData[]; }

export const EMPTY_ROUTE_MAP: RouteMapData = { peaks: [], routePoints: [], routeSegments: [] };

const POINT_TYPES: RoutePointType[] = ['start', 'end', 'trek', 'acclimatization', 'peak', 'lake', 'pass', 'airport', 'helipad'];
const SEGMENT_TYPES: SegmentType[] = ['trekking', 'secondary', 'driving', 'flight'];

const inputCls =
  'w-full px-2 py-1 border border-gray-200 rounded text-xs';

interface Props {
  value?: RouteMapData;
  onChange: (v: RouteMapData) => void;
}

export default function RouteMapEditor({ value = EMPTY_ROUTE_MAP, onChange }: Props) {
  const d = value;

  const set = (patch: Partial<RouteMapData>) => onChange({ ...d, ...patch });

  const setPeak = (i: number, patch: Partial<PeakData>) =>
    set({ peaks: d.peaks.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const setPoint = (i: number, patch: Partial<RoutePointData>) =>
    set({ routePoints: d.routePoints.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const setSegment = (i: number, patch: Partial<RouteSegmentData>) =>
    set({ routeSegments: d.routeSegments.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });

  const header = (
    <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
      Detailed Route Map
    </h3>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      {header}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Title override</label>
          <input className={inputCls} value={d.title || ''} placeholder={d.title || 'Defaults to package title'}
            onChange={(e) => set({ title: e.target.value })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Subtitle</label>
          <input className={inputCls} value={d.subtitle || ''} placeholder="e.g. Detailed route map with elevation profile"
            onChange={(e) => set({ subtitle: e.target.value })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Max altitude (m)</label>
          <input type="number" className={inputCls} value={d.maxAltitude ?? ''} placeholder="e.g. 5545"
            onChange={(e) => set({ maxAltitude: e.target.value === '' ? undefined : Number(e.target.value) })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Brand name</label>
          <input className={inputCls} value={d.brandName || ''} placeholder="NEPAL HIKING TEAM"
            onChange={(e) => set({ brandName: e.target.value })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Brand tagline</label>
          <input className={inputCls} value={d.brandTagline || ''} placeholder="Walk, Explore and Discover"
            onChange={(e) => set({ brandTagline: e.target.value })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Footer URL</label>
          <input className={inputCls} value={d.footerUrl || ''} placeholder="www.nepalhikingteam.com"
            onChange={(e) => set({ footerUrl: e.target.value })} /></div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs">Peaks</h4>
          <button type="button" onClick={() => set({ peaks: [...d.peaks, { name: '', elevation: 0, x: 0, y: 0 }] })} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Peak
          </button>
        </div>
        {d.peaks.length === 0 && <p className="text-[11px] text-gray-400 italic">No peaks defined.</p>}
        <div className="space-y-2">
          {d.peaks.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <input className={inputCls + ' flex-1 min-w-[120px]'} placeholder="Name" value={p.name} onChange={(e) => setPeak(i, { name: e.target.value })} />
              <input type="number" className={inputCls + ' w-24'} placeholder="Elev m" value={p.elevation || ''} onChange={(e) => setPeak(i, { elevation: Number(e.target.value) })} />
              <input type="number" className={inputCls + ' w-16'} placeholder="X" value={p.x || ''} onChange={(e) => setPeak(i, { x: Number(e.target.value) })} />
              <input type="number" className={inputCls + ' w-16'} placeholder="Y" value={p.y || ''} onChange={(e) => setPeak(i, { y: Number(e.target.value) })} />
              <button type="button" onClick={() => set({ peaks: d.peaks.filter((_, idx) => idx !== i) })} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs">Route Points</h4>
          <button type="button" onClick={() => set({ routePoints: [...d.routePoints, { id: '', name: '', elevation: 0, x: 0, y: 0, type: 'trek' }] })} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Point
          </button>
        </div>
        {d.routePoints.length === 0 && <p className="text-[11px] text-gray-400 italic">No route points defined.</p>}
        <div className="space-y-2">
          {d.routePoints.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <input className={inputCls + ' w-20'} placeholder="id" value={p.id} onChange={(e) => setPoint(i, { id: e.target.value })} />
              <input className={inputCls + ' flex-1 min-w-[80px]'} placeholder="Name" value={p.name} onChange={(e) => setPoint(i, { name: e.target.value })} />
              <input type="number" className={inputCls + ' w-24'} placeholder="Elev m" value={p.elevation || ''} onChange={(e) => setPoint(i, { elevation: Number(e.target.value) })} />
              <input type="number" className={inputCls + ' w-16'} placeholder="X" value={p.x || ''} onChange={(e) => setPoint(i, { x: Number(e.target.value) })} />
              <input type="number" className={inputCls + ' w-16'} placeholder="Y" value={p.y || ''} onChange={(e) => setPoint(i, { y: Number(e.target.value) })} />
              <select className={inputCls + ' w-32'} value={p.type} onChange={(e) => setPoint(i, { type: e.target.value as RoutePointType })}>
                {POINT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" className={inputCls + ' w-14'} placeholder="Day" value={p.day ?? ''} onChange={(e) => setPoint(i, { day: e.target.value === '' ? undefined : Number(e.target.value) })} />
              <button type="button" onClick={() => set({ routePoints: d.routePoints.filter((_, idx) => idx !== i) })} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs">Route Segments</h4>
          <button type="button" onClick={() => set({ routeSegments: [...d.routeSegments, { from: '', to: '', type: 'trekking' }] })} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Segment
          </button>
        </div>
        {d.routeSegments.length === 0 && <p className="text-[11px] text-gray-400 italic">No route segments defined.</p>}
        <div className="space-y-2">
          {d.routeSegments.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <input className={inputCls + ' w-40'} placeholder="From (point id)" value={p.from} onChange={(e) => setSegment(i, { from: e.target.value })} />
              <span className="text-gray-400">→</span>
              <input className={inputCls + ' w-40'} placeholder="To (point id)" value={p.to} onChange={(e) => setSegment(i, { to: e.target.value })} />
              <select className={inputCls + ' w-32'} value={p.type} onChange={(e) => setSegment(i, { type: e.target.value as SegmentType })}>
                {SEGMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button type="button" onClick={() => set({ routeSegments: d.routeSegments.filter((_, idx) => idx !== i) })} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add app/components/admin/RouteMapEditor.tsx
git commit -m "feat: add reusable RouteMapEditor component"
```

---

### Task 3: Wire TrekForm + treks API

**Files:**
- Modify: `app/admin/treks/TrekForm.tsx` (add `routeMap` to state; render editor after the Route Map Image block at ~line 671)
- Modify: `app/api/treks/route.ts` (POST create ~line 66)
- Modify: `app/api/treks/[id]/route.ts` (PUT update ~line 49)

**Interfaces:**
- Consumes: `RouteMapEditor`, `EMPTY_ROUTE_MAP` from `@/app/components/admin/RouteMapEditor`.
- Produces: `routeMap` present in POST/PUT bodies and on the stored record.

- [ ] **Step 1: Import the editor in TrekForm**

At the top of `app/admin/treks/TrekForm.tsx` add:

```tsx
import RouteMapEditor, { EMPTY_ROUTE_MAP } from '@/app/components/admin/RouteMapEditor';
```

- [ ] **Step 2: Add routeMap to form state**

Locate the `useState` initializer in `TrekForm.tsx` (near `mapImage: initialData?.mapImage || ''` at line ~71). Add after `mapImage`:

```tsx
    mapImage: initialData?.mapImage || '',
    routeMap:
      initialData?.routeMap &&
      typeof initialData.routeMap === 'object' &&
      Array.isArray(initialData.routeMap.peaks)
        ? initialData.routeMap
        : { ...EMPTY_ROUTE_MAP },
```

- [ ] **Step 3: Render the editor**

In `app/admin/treks/TrekForm.tsx`, the Route Map Image card ends at line 672 (`</div>` closes the `bg-white p-6 ...` card). Insert the editor **inside that same card**, right after the mapImage `</div>` at line 671 and before the closing `</div>` at line 672:

```tsx
              <MediaUploader
                type="image"
                value={formData.mapImage}
                onChange={(url) => setFormData(prev => ({ ...prev, mapImage: url }))}
                label="Upload Route Map Image"
                heightClass="h-48"
              />
            </div>

            {/* Detailed interactive route map data */}
            <div className="border-t border-gray-100 pt-4">
              <RouteMapEditor
                value={formData.routeMap}
                onChange={(v) => setFormData(prev => ({ ...prev, routeMap: v }))}
              />
            </div>
          </div>
```

The `RouteMapEditor` renders its own full-width card; nesting it inside a thin `border-t` wrapper keeps the existing card layout intact.

- [ ] **Step 4: Persist on POST — `app/api/treks/route.ts`**

In `create({ data: { ... } })`, after `mapImage: body.mapImage || null,` (line ~67) add:

```typescript
        mapImage: body.mapImage || null,
        routeMap: body.routeMap ?? null,
```

- [ ] **Step 5: Persist on PUT — `app/api/treks/[id]/route.ts`**

In `tx.trek.update({ data: { ... } })`, after `mapImage: body.mapImage || null,` (line ~51) add:

```typescript
          mapImage: body.mapImage || null,
          routeMap: body.routeMap ?? null,
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npx eslint`
Expected: no errors (pre-existing warnings ok).

- [ ] **Step 7: Commit**

```bash
git add app/admin/treks/TrekForm.tsx app/api/treks/route.ts app/api/treks/[id]/route.ts
git commit -m "feat: persist routeMap for treks (form + API)"
```

---

### Task 4: Wire TourForm + tours API

**Files:**
- Modify: `app/admin/tours/TourForm.tsx` (add `routeMap` to state; render editor after Route Map Image block at ~line 702)
- Modify: `app/api/admin/tours/route.ts` (POST create ~line 30+)
- Modify: `app/api/admin/tours/[id]/route.ts` (PUT update ~line 69)

**Interfaces:**
- Consumes: `RouteMapEditor`, `EMPTY_ROUTE_MAP` from `@/app/components/admin/RouteMapEditor`.

- [ ] **Step 1: Add import in TourForm**

```tsx
import RouteMapEditor, { EMPTY_ROUTE_MAP } from '@/app/components/admin/RouteMapEditor';
```

- [ ] **Step 2: Add routeMap to form state**

In the `formData` initializer, after `mapImage: initialData?.mapImage || '',` (line ~80), add:

```tsx
    mapImage: initialData?.mapImage || '',
    routeMap:
      initialData?.routeMap &&
      typeof initialData.routeMap === 'object' &&
      Array.isArray(initialData.routeMap.peaks)
        ? initialData.routeMap
        : { ...EMPTY_ROUTE_MAP },
```

- [ ] **Step 3: Render the editor**

In `app/admin/tours/TourForm.tsx`, the Route Map Image card ends at line 703 (`</div>` closes the `bg-white p-6 ...` card). Insert the editor **inside that same card**, right after the mapImage `</div>` at line 702 and before the closing `</div>` at line 703:

```tsx
              <MediaUploader
                type="image"
                value={formData.mapImage}
                onChange={(url) => setFormData(prev => ({ ...prev, mapImage: url }))}
                label="Upload Route Map Image"
                heightClass="h-48"
              />
            </div>

            {/* Detailed interactive route map data */}
            <div className="border-t border-gray-100 pt-4">
              <RouteMapEditor
                value={formData.routeMap}
                onChange={(v) => setFormData(prev => ({ ...prev, routeMap: v }))}
              />
            </div>
          </div>
```

The `RouteMapEditor` renders its own full-width card; nesting it inside a thin `border-t` wrapper keeps the existing card layout intact.

- [ ] **Step 4: Persist on POST — `app/api/admin/tours/route.ts`**

Locate the `create` data block; after the `mapImage` line add `routeMap: body.routeMap ?? null,`.

- [ ] **Step 5: Persist on PUT — `app/api/admin/tours/[id]/route.ts`**

After `mapImage: body.mapImage || null,` (line ~70) add:

```typescript
          mapImage: body.mapImage || null,
          routeMap: body.routeMap ?? null,
```

- [ ] **Step 6: Verify + lint**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npx eslint app/admin/tours/TourForm.tsx app/api/admin/tours/route.ts 'app/api/admin/tours/[id]/route.ts'`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add app/admin/tours/TourForm.tsx app/api/admin/tours/route.ts app/api/admin/tours/[id]/route.ts
git commit -m "feat: persist routeMap for tours (form + admin)"
```

---

### Task 5: Render dynamic DetailedRouteMap on trek page

**Files:**
- Modify: `app/trekking/[slug]/page.tsx` (lines 366-462 — the "ROUTE MAP & ELEVATION" block)
- Remove: old `RouteMap` animated chart usage + import (line 11)

**Interfaces:**
- Consumes: `trek.routeMap` (JSON), `trek.mapImage`, `itineraryDays` (already computed at line 54).
- Produces: `DetailedRouteMap` rendered only when `trek.routeMap` exists; `RouteMapImage` above when `trek.mapImage` exists; old `RouteMap` removed entirely.

- [ ] **Step 1: Helper + drop old imports**

At the top of `app/trekking/[slug]/page.tsx`:
- Remove `import RouteMap from '@/app/components/trek/RouteMap';` (line 11).
- Keep `DetailedRouteMap` import (line 13).
- Add a typed cast for the JSON field so `tsc` accepts `peaks`/`routePoints`/`routeSegments` (Prisma `routeMap` is `Json`):

```ts
import DetailedRouteMap, { RoutePoint, RouteSegment, Peak } from '@/app/components/trek/DetailedRouteMap';

const routeMap = (
  trek.routeMap && typeof trek.routeMap === 'object' && !Array.isArray(trek.routeMap)
    ? (trek.routeMap as { peaks?: Peak[]; routePoints?: RoutePoint[]; routeSegments?: RouteSegment[]; title?: string; subtitle?: string; brandName?: string; brandTagline?: string; footerUrl?: string; maxAltitude?: number })
    : null
) ?? null;
```

Below the `parsePrice` helper (~line 61) add:

```ts
  const buildElevationData = (itinerary: any[]) =>
    (itinerary || [])
      .filter((d) => d && d.title)
      .map((d) => ({ day: d.day, location: d.title, elevation: Number(d.elev) || 0 }));
```

- [ ] **Step 2: Replace the route-map blocks**

Replace the entire block from line 366 (`{/* ROUTE MAP & ELEVATION */}`) through line 462 (`)}`) with:

```tsx
      {/* ROUTE MAP & ELEVATION */}
      {(trek.mapImage || routeMap) && (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          {trek.mapImage && (
            <RouteMapImage src={trek.mapImage} alt={`${trek.title} route map`} />
          )}
          {routeMap && (
            <div className="mt-10">
              <DetailedRouteMap
                title={routeMap.title || trek.title}
                subtitle={routeMap.subtitle}
                brandName={routeMap.brandName}
                brandTagline={routeMap.brandTagline}
                footerUrl={routeMap.footerUrl}
                maxAltitude={routeMap.maxAltitude}
                peaks={routeMap.peaks}
                routePoints={routeMap.routePoints}
                routeSegments={routeMap.routeSegments}
                elevationData={buildElevationData(itineraryDays)}
              />
            </div>
          )}
        </section>
      )}
```

- [ ] **Step 3: Verify TypeScript & lint**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npx eslint 'app/trekking/[slug]/page.tsx'`
Expected: no new errors above pre-existing.

- [ ] **Step 4: Runtime check**

With the dev server running on `http://localhost:3000`:

```bash
curl -s http://localhost:3000/trekking/everest-base-camp-trek | grep -o "DetailedRouteMap" | head -1
```

Expected: no match yet (EBC has no `routeMap` in DB → section won't render the detailed map). Confirm `annapurna-base-camp-trek` returns 200 and contains no `EBC WITH GOKYO LAKE HELI SHUTTLE` text.

- [ ] **Step 5: Commit**

```bash
git add app/trekking/[slug]/page.tsx
git commit -m "feat: render dynamic routeMap on trek detail page"
```

---

### Task 6: Render dynamic DetailedRouteMap on tour page

**Files:**
- Modify: `app/tour/[slug]/page.tsx` (lines 366-376 — the ROUTE MAP & ELEVATION block)
- Remove: old `RouteMap` import (line 11)

**Interfaces:**
- Consumes: `tour.routeMap`, `tour.mapImage`, `itineraryDays` (existing computed value).
- Produces: `DetailedRouteMap` on tour pages when `tour.routeMap` exists.

- [ ] **Step 1: Import DetailedRouteMap + remove old RouteMap import**

In `app/tour/[slug]/page.tsx`:
- Remove `import RouteMap from '@/app/components/trek/RouteMap';` (line 11).
- Add `import DetailedRouteMap, { RoutePoint, RouteSegment, Peak } from '@/app/components/trek/DetailedRouteMap';`

- [ ] **Step 2: Add helper near other data derivation**

Below the itinerary computation (find `const itineraryDays = ...` line) add:

```ts
  const buildTourElevationData = (itinerary: any[]) =>
    (itinerary || [])
      .filter((d) => d && d.title)
      .map((d) => ({ day: d.day, location: d.title, elevation: Number(d.elev) || 0 }));

  const routeMap =
    tour.routeMap && typeof tour.routeMap === 'object' && !Array.isArray(tour.routeMap)
      ? (tour.routeMap as { peaks?: Peak[]; routePoints?: RoutePoint[]; routeSegments?: RouteSegment[]; title?: string; subtitle?: string; brandName?: string; brandTagline?: string; footerUrl?: string; maxAltitude?: number })
      : null;
```

- [ ] **Step 3: Replace the route-map block**

Replace lines 366-376 with:

```tsx
      {/* ROUTE MAP & ELEVATION */}
      {(tour.mapImage || routeMap) && (
        <section className="max-w-[1200px] mx-auto px-5 mt-10">
          {tour.mapImage && (
            <RouteMapImage src={tour.mapImage} alt={`${tour.title} route map`} />
          )}
          {routeMap && (
            <div className="mt-10">
              <DetailedRouteMap
                title={routeMap.title || tour.title}
                subtitle={routeMap.subtitle}
                brandName={routeMap.brandName}
                brandTagline={routeMap.brandTagline}
                footerUrl={routeMap.footerUrl}
                maxAltitude={routeMap.maxAltitude}
                peaks={routeMap.peaks}
                routePoints={routeMap.routePoints}
                routeSegments={routeMap.routeSegments}
                elevationData={buildTourElevationData(itineraryDays)}
              />
            </div>
          )}
        </section>
      )}
```

- [ ] **Step 4: Verify + lint**

Run: `npx tsc --noEmit`
Expected: no output (`itineraryDays` and `tour` types — if any `any` warnings, they are pre-existing style).

Run: `npx eslint 'app/tour/[slug]/page.tsx'`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/tour/[slug]/page.tsx
git commit -m "feat: render dynamic routeMap on tour detail page"
```

---

### Task 7: Manual E2E verification pass

**Files:** none (verification only)

- [ ] **Step 1: Seed EBC data (parity check)**

Optionally copy the current hardcoded EBC block (peaks/routePoints/routeSegments from `app/trekking/[slug]/page.tsx` history / the previous edit) into the EBC trek's `RouteMapEditor` in admin at `http://localhost:3000/admin/treks`, save, and confirm `everest-base-camp-trek` renders the detailed map with the real elevation profile from its 14-day itinerary.

- [ ] **Step 2: Regression checks**

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/trekking
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/trekking/annapurna-base-camp-trek
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/tour
```

Expected: `200`, `200`, `200`.

- [ ] **Step 3: Hydration sanity**

```bash
curl -s http://localhost:3000/trekking/annapurna-base-camp-trek | grep -oE 'EBC WITH GOKYO|DetailedRouteMap' | head
```

Expected: no matches (only EBC with seeded `routeMap` shows the detailed map).

- [ ] **Step 4: Admin save round-trip**

In the admin UI, open a trek, add one peak + one point + one segment, save. Reopen the form and confirm the values persist; then open the public page to confirm the card renders. Repeat for one tour.

- [ ] **Step 5: Final lint**

Run: `npx tsc --noEmit && npx eslint`
Expected: no errors.