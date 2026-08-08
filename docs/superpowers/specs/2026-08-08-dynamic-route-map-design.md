# Dynamic Route Map (Trek + Tour Pages) — Design

Date: 2026-08-08
Status: Approved (approach chosen, awaiting spec review)

## Goal

Make the detailed EBC/Gokyo-style route map fully data-driven so every trek and tour can have its own geographic route map, editable from the admin panel. Remove the hardcoded "EBC WITH GOKYO LAKE HELI SHUTTLE TREK" block from the trek detail page.

## Current State (root cause summary)

- `app/trekking/[slug]/page.tsx` renders a hardcoded `DetailedRouteMap` (EBC/Gokyo data inline in the page) inside the gate `{(trek.mapImage) || itineraryDays.length > 0}`. Only `everest-base-camp-trek` has itinerary/map data in the DB, so all other 13 trek pages render no map at all, and any trek that gets itinerary would show the wrong EBC map.
- `app/tour/[slug]/page.tsx` has no detailed map at all — only the simple `RouteMap` elevation chart + `RouteMapImage`.
- `app/components/trek/InteractiveRoadmap.tsx` exists but is unwired (out of scope).
- `DetailedRouteMap` (`app/components/trek/DetailedRouteMap.tsx`) is a rich SVG map component that already accepts `peaks`, `routePoints`, `routeSegments`, `elevationData`, `maxAltitude`, and branding props.

## Design Decisions (user-approved)

1. **Scope:** both Trek and Tour detail pages get the dynamic map.
2. **Storage:** a single `routeMap Json?` field on each model (matches the existing `itinerary Json?` pattern). No new models/relations.
3. **Admin editing:** a reusable repeatable structured editor (`RouteMapEditor.tsx`) in both `TrekForm.tsx` and `TourForm.tsx`.
4. **Replaces the simple chart:** the old `RouteMap` animated elevation chart is removed; `DetailedRouteMap` provides the elevation profile.
5. **Elevations reuse `itinerary`:** `elevationData` is derived at render time from the existing `itinerary` JSON (`day`, `location = day.title`, `elevation = day.elev`). No separate elevation editor.
6. **Empty behavior:** if `routeMap` is empty, no detailed map renders (only uploaded `mapImage` shows). No backward-compat chart fallback.

## Schema

Add to `prisma/schema.prisma`:

```prisma
// Trek
routeMap Json?

// Tour
routeMap Json?
```

Additive-only nullable JSON. One migration: `npx prisma migrate dev --name route_map`.

## Data Shape (`routeMap`)

```ts
interface RoutePointData {
  id: string;
  name: string;
  elevation: number;
  x: number;                        // 0..mapWidth coordinates
  y: number;                        // 0..mapHeight coordinates
  type: 'start' | 'end' | 'trek' | 'acclimatization' | 'peak' | 'lake' | 'pass' | 'airport' | 'helipad';
  day?: number;
}

interface RouteSegmentData {
  from: string;                     // routePoint id
  to: string;                       // routePoint id
  type: 'trekking' | 'secondary' | 'driving' | 'flight';
}

interface PeakData {
  name: string;
  elevation: number;
  x: number;
  y: number;
}

interface RouteMapData {
  title?: string;
  subtitle?: string;
  brandName?: string;               // default "NEPAL HIKING TEAM"
  brandTagline?: string;            // default "Walk, Explore and Discover"
  footerUrl?: string;               // default "www.nepalhikingteam.com"
  maxAltitude?: number;
  peaks: PeakData[];
  routePoints: RoutePointData[];
  routeSegments: RouteSegmentData[];
}
```

`ElevationDay[]` for `DetailedRouteMap` is **not stored** — built from itinerary:

```ts
const elevationData = itinerary
  .filter((d) => d && d.title)
  .map((d) => ({ day: d.day, location: d.title, elevation: d.elev ?? 0 }));
```

## Files

### Modified — `prisma/schema.prisma`
Add `routeMap Json?` to `Trek` and `Tour`.

### New — `app/admin/components/RouteMapEditor.tsx`
Reusable controlled editor. Props: `value?: RouteMapData`, `onChange(v: RouteMapData)`. Sections:
- Header fields: title, subtitle, brand name, brand tagline, footer URL, max altitude.
- **Peaks** — repeatable rows (name, elevation, x, y), add/remove.
- **Route points** — repeatable rows (id, name, elevation, x, y, type dropdown of the 9 `RoutePointData.type` values, optional day).
- **Route segments** — repeatable rows (from, to, type dropdown of the 4 segment types).
- Rendered inside a bordered card titled "Detailed Route Map", matching itinerary-editor styling. No CRUD to server.

### Modified — `app/admin/treks/TrekForm.tsx`
- Add `routeMap` to form state (`initialData?.routeMap ?? { peaks: [], routePoints: [], routeSegments: [] }`).
- Render `<RouteMapEditor value={formData.routeMap} onChange={...} />` near the existing Route Map (`mapImage`) field.
- Submit sends `routeMap` in the JSON payload (TrekForm uses `/api/treks` and `/api/treks/[id]`).

### Modified — `app/admin/tours/TourForm.tsx`
Same as TrekForm: add `routeMap` state + `RouteMapEditor`. TourForm submits to `/api/admin/tours` and `/api/admin/tours/[id]`.

### Modified — API routes (all whitelist fields, so `routeMap` must be added explicitly)
- `app/api/treks/route.ts` (POST create) — add `routeMap: body.routeMap ?? null`.
- `app/api/treks/[id]/route.ts` (PUT update) — add `routeMap: body.routeMap ?? null`.
- `app/api/admin/tours/route.ts` (POST create) — add `routeMap: body.routeMap ?? null`.
- `app/api/admin/tours/[id]/route.ts` (PUT update) — add `routeMap: body.routeMap ?? null`.

### Modified — `app/trekking/[slug]/page.tsx`
Replace the current "ROUTE MAP & ELEVATION" block:

```tsx
{(trek.mapImage || trek.routeMap) && (
  <section className="max-w-[1200px] mx-auto px-5 mt-10">
    {trek.mapImage && <RouteMapImage src={trek.mapImage} alt={`${trek.title} route map`} />}
    {trek.routeMap && (
      <DetailedRouteMap
        title={trek.title}
        subtitle={trek.routeMap.subtitle}
        brandName={trek.routeMap.brandName}
        brandTagline={trek.routeMap.brandTagline}
        footerUrl={trek.routeMap.footerUrl}
        maxAltitude={trek.routeMap.maxAltitude}
        peaks={trek.routeMap.peaks}
        routePoints={trek.routeMap.routePoints}
        routeSegments={trek.routeMap.routeSegments}
        elevationData={elevationDataFromItinerary(itineraryDays)}
      />
    )}
  </section>
)}
```

- Remove the hardcoded `DetailedRouteMap` props block.
- Remove the old `RouteMap` animated chart + its import (verify not used elsewhere locally).
- Hoist a small helper `buildElevationData(itinerary)` (used by trek page; tour page can reuse if extracted — see tour model: itinerary JSON shape matches).

### Modified — `app/tour/[slug]/page.tsx`
Mirror the same block using `tour.routeMap` and `tour.mapImage`, deriving `elevationData` from `tour.itinerary`.

## Data Flow

- Admin form POST/PUT: four whitelisting API routes each need `routeMap: body.routeMap ?? null` added (treks POST/PUT at `/api/treks`, tours POST/PUT at `/api/admin/tours`).
- Public pages: `findUnique` returns all scalar fields including the new `routeMap` JSON — no select changes.

## Edge Cases

- `routeMap` present but itinerary empty → `elevationData = []` → `DetailedRouteMap` tolerates this (line 333 gates the elevation profile on `elevationData.length > 0`).
- Segment referencing a removed/unknown point id → component returns `null` for that segment (safe).
- Blank rows in `RouteMapData` → filter empty entries on submit (skip peaks/points/segments missing required fields on PUT).
- Backwards compatibility: old DB rows have `routeMap = null` → section renders nothing extra; `mapImage` still shows.
- Migration additive-only, safe to deploy.

## Verification

- `npx tsc --noEmit` clean.
- `npx eslint` on changed files clean.
- Admin: edit a trek/tour with route-map data → save → public page renders `DetailedRouteMap` with that data and correct elevation profile from itinerary.
- A trek/tour with no `routeMap` renders only `mapImage` (if any) and no map card.
- EBC data (the current hardcoded block) can be copy-pasted into EBC's `routeMap` editor for parity during verification.