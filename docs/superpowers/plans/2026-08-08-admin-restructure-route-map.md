# Admin Restructure + Route Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin-uploadable route-map image to Trek/Tour detail pages, re-organize the admin sidebar into the 7 frontend tabs with consolidated per-page editors, make Includes/Excludes single-column, remove the unused Dynamic Pages UI, add a sidebar collapse toggle, and sweep every admin page for label/spacing polish.

**Architecture:** New `mapImage` scalar on `Trek`/`Tour`, rendered above the existing animated `RouteMap` elevation chart. Six new server forms + per-content API routes (mirroring `app/api/hero-content/route.ts`) power consolidated static-page editors. Admin sidebar in `app/admin/layout.tsx` is re-grouped into Home / About Us / Trekking / Tour Packages / FAQ / Blogs / Contact Us / System; the "Dynamic Pages" entry and its dashboard card are removed.

**Tech Stack:** Next.js (App Router), Prisma + Postgres (port 5434), Tailwind, react-hot-toast, existing `MediaUploader` + `/api/upload` for images.

## Global Constraints

- `mapImage` is a NEW nullable field on `Trek` and `Tour`; the existing `mapUrl` (embed) stays untouched. Do not rename or remove `mapUrl`.
- Every new/edited admin API route must call `requireAdmin()` from `@/app/lib/require-admin` as the first line of each handler.
- All client forms use `'use client'`; all new page.tsx wrappers are server components using `export const dynamic = 'force-dynamic'` (existing convention).
- Image uploads use the existing `MediaUploader` component (`app/components/admin/MediaUploader.tsx`) + `/api/upload`; do NOT add new upload infra.
- No data migration for `Page`/`Section`: models stay in `schema.prisma`, only admin UI (`app/admin/pages/`) and the dashboard "Pages" card are removed.
- After schema changes run: `npx prisma db push && npx prisma generate`.
- Verify with: `npx tsc --noEmit` and `npm run build` (must be clean).

---

### Task 1: Add `mapImage` to Trek and Tour

**Files:**
- Modify: `prisma/schema.prisma` (Trek model ~line 94, Tour model ~line 152)

**Interfaces:**
- Produces: `trek.mapImage: string | null` and `tour.mapImage: string | null`

- [ ] **Step 1: Edit the schema**

In `model Trek`, add after the `mapUrl String?` line:

```prisma
  mapUrl          String?
  mapImage        String?
```

In `model Tour`, add after the `mapUrl String?` line:

```prisma
  mapUrl          String?
  mapImage        String?
```

- [ ] **Step 2: Push + regenerate**

```bash
npx prisma db push && npx prisma generate
```

- [ ] **Step 3: Verify typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors (client regenerated, so `mapImage` exists on both delegates).

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma && git commit -m "feat: add mapImage field to Trek and Tour"
```

---

### Task 2: Route Map Image field in Trek/Tour admin forms

**Files:**
- Modify: `app/admin/treks/TrekForm.tsx`
- Modify: `app/admin/tours/TourForm.tsx`

**Interfaces:**
- Consumes: `mapImage` (from Task 1); `MediaUploader` already imported in both forms (`@/app/components/admin/MediaUploader`).
- Produces: forms persist `mapImage` in the POST/PUT payload.

- [ ] **Step 1: TrekForm — state**

Find `mapUrl: initialData?.mapUrl || '',` (line ~70) and add on the next line:

```ts
    mapUrl: initialData?.mapUrl || '',
    mapImage: initialData?.mapImage || '',
```

- [ ] **Step 2: TrekForm — field UI**

Near the existing `mapUrl` input (line ~657, a label like "Route Map / Elevation Chart URL"), add this block directly after that input's wrapping `<div>`:

```tsx
            <div>
              <label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Route Map Image</label>
              <p className="text-[10px] text-gray-400 mb-2">Upload a map graphic (JPG/PNG/WebP). Shown above the elevation chart on the trek page.</p>
              <MediaUploader
                type="image"
                value={formData.mapImage}
                onChange={(url) => setFormData(prev => ({ ...prev, mapImage: url }))}
                label="Upload Route Map Image"
                heightClass="h-48"
              />
            </div>
```

- [ ] **Step 3: TourForm — state**

Find `mapUrl: initialData?.mapUrl || '',` (line ~79) and add on the next line:

```ts
    mapUrl: initialData?.mapUrl || '',
    mapImage: initialData?.mapImage || '',
```

- [ ] **Step 4: TourForm — field UI**

Near the `mapUrl` input (line ~688), add the identical Route Map Image block as Step 2 (label "Route Map Image", MediaUploader with `formData.mapImage`).

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit
```
Then open `http://localhost:3000/admin/treks/<id>/edit` and `http://localhost:3000/admin/tours/<id>/edit` — the "Route Map Image" uploader must render under the map URL field.

- [ ] **Step 6: Commit**

```bash
git add app/admin/treks/TrekForm.tsx app/admin/tours/TourForm.tsx && git commit -m "feat: route map image upload in trek and tour admin forms"
```

---

### Task 3: Render route map image on public Trek/Tour pages

**Files:**
- Modify: `app/trekking/[slug]/page.tsx`
- Modify: `app/tour/[slug]/page.tsx`

**Interfaces:**
- Consumes: `trek.mapImage` / `tour.mapImage` (Task 1), and the existing `<RouteMap ... />` component.

- [ ] **Step 1: Add a RouteMapImage component**

Create `app/components/trek/RouteMapImage.tsx`:

```tsx
interface Props {
  image?: string | null;
  title?: string | null;
}

export default function RouteMapImage({ image, title }: Props) {
  if (!image) return null;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
      <h2 className="text-lg md:text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
        Route Map
      </h2>
      <img src={image} alt={`Route map for ${title || 'this trip'}`} className="w-full h-auto object-contain rounded-lg" />
    </div>
  );
}
```

- [ ] **Step 2: Import + render in trek page**

In `app/trekking/[slug]/page.tsx` add import next to the existing `RouteMap` import (line ~11):

```tsx
import RouteMapImage from '@/app/components/trek/RouteMapImage';
```

Find the block that renders `<RouteMap itinerary={itineraryDays} chartTitle={trek.title} />` (line ~367) and wrap it:

```tsx
          <RouteMapImage image={trek.mapImage} title={trek.title} />
          <RouteMap itinerary={itineraryDays} chartTitle={trek.title} />
```

- [ ] **Step 3: Same in tour page**

In `app/tour/[slug]/page.tsx` add the same import (next to `RouteMap` import line ~11) and wrap the `<RouteMap itinerary={itineraryDays} chartTitle={tour.title} />` (line ~368):

```tsx
          <RouteMapImage image={tour.mapImage} title={tour.title} />
          <RouteMap itinerary={itineraryDays} chartTitle={tour.title} />
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npm run build
```
Then curl a trek + a tour page (`curl -s http://localhost:3000/trekking/gokyo-lakes-trek`) — with no image set, the section renders exactly as before (elevation chart only).

- [ ] **Step 5: Commit**

```bash
git add app/components/trek/RouteMapImage.tsx app/trekking/[slug]/page.tsx app/tour/[slug]/page.tsx && git commit -m "feat: render uploaded route map image on trek and tour pages"
```

---

### Task 4: Includes/Excludes single column (Trek + Tour)

**Files:**
- Modify: `app/trekking/[slug]/page.tsx:332`
- Modify: `app/tour/[slug]/page.tsx` (same Includes & Excludes block)

- [ ] **Step 1: Trek page**

Change:

```tsx
<Stagger className="grid grid-cols-2 gap-6">
```

to:

```tsx
<Stagger className="grid grid-cols-1 gap-8">
```

Keep the two `StaggerItem`s (Package Includes / Package Excludes) inside — each now spans full width.

- [ ] **Step 2: Tour page**

Apply the identical `grid-cols-1 gap-8` change to the Includes & Excludes `Stagger` in `app/tour/[slug]/page.tsx`.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```
Then `curl -s http://localhost:3000/trekking/gokyo-lakes-trek | grep -c "Package Includes"` → 1, and visually the includes and excludes render stacked (single column) at desktop width.

- [ ] **Step 4: Commit**

```bash
git add app/trekking/[slug]/page.tsx app/tour/[slug]/page.tsx && git commit -m "feat: single-column includes/excludes on trek and tour pages"
```

---

### Task 5: Content API routes (6 per-model routes)

**Files:**
- Create: `app/api/about-content/route.ts`
- Create: `app/api/director-message/route.ts`
- Create: `app/api/why-page/route.ts`
- Create: `app/api/responsible-travel/route.ts`
- Create: `app/api/terms-page/route.ts`
- Create: `app/api/privacy-policy/route.ts`

**Interfaces:**
- Produces: each route has `GET()` returning `{ success, data }` (first matching row or null) and `PUT(request)` upserting the row; both gated by `requireAdmin()`.

- [ ] **Step 1: About Content route**

Create `app/api/about-content/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/lib/require-admin';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const data = await prisma.aboutPageContent.findFirst();
  return NextResponse.json({ success: true, data });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json();
    const existing = await prisma.aboutPageContent.findFirst();
    const payload = {
      title: body.title,
      featuredImage: body.featuredImage,
      happyTravelers: body.happyTravelers,
      yearsExperience: body.yearsExperience,
      successfulTrips: body.successfulTrips,
      expertGuides: body.expertGuides,
      paragraph1: body.paragraph1,
      paragraph2: body.paragraph2,
      paragraph3: body.paragraph3,
      paragraph4: body.paragraph4,
      cultureTitle: body.cultureTitle,
      cultureText: body.cultureText,
      missionText: body.missionText,
      visionText: body.visionText,
      goalsText: body.goalsText,
    };
    const data = existing
      ? await prisma.aboutPageContent.update({ where: { id: existing.id }, data: payload })
      : await prisma.aboutPageContent.create({ data: payload as any });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Director Message route**

Create `app/api/director-message/route.ts` (same shape) against `prisma.directorMessageContent` with payload `{ contentHtml, founderName, founderTitle, founderEmail, founderImage }`.

- [ ] **Step 3: Why Page route**

Create `app/api/why-page/route.ts` against `prisma.whyPageContent` with payload `{ title, subtitle, contentHtml }`.

- [ ] **Step 4: Responsible Travel route**

Create `app/api/responsible-travel/route.ts` against `prisma.responsibleTravelContent` with payload `{ title, subtitle, contentHtml }`.

- [ ] **Step 5: Terms Page route**

Create `app/api/terms-page/route.ts` against `prisma.termsPageContent` with payload `{ title, subtitle, contentHtml }`.

- [ ] **Step 6: Privacy Policy route**

Create `app/api/privacy-policy/route.ts` against `prisma.privacyPolicyContent` with payload `{ title, subtitle, contentHtml }` (model has title, subtitle, contentHtml — verified at schema line 525).

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit
```
Then curl unauthenticated (must be 401): `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/about-content` → 401.

- [ ] **Step 8: Commit**

```bash
git add app/api/about-content/route.ts app/api/director-message/route.ts app/api/why-page/route.ts app/api/responsible-travel/route.ts app/api/terms-page/route.ts app/api/privacy-policy/route.ts && git commit -m "feat: admin API routes for static content models"
```

---

### Task 6: Consolidated page editors (6 admin screens)

**Files:**
- Create: `app/admin/about-content/page.tsx` + `app/admin/about-content/AboutContentForm.tsx`
- Create: `app/admin/message-from-founder/page.tsx` + `app/admin/message-from-founder/FounderMessageForm.tsx`
- Create: `app/admin/why-page/page.tsx` + `app/admin/why-page/WhyPageForm.tsx`
- Create: `app/admin/responsible-travel/page.tsx` + `app/admin/responsible-travel/ResponsibleTravelForm.tsx`
- Create: `app/admin/terms-page/page.tsx` + `app/admin/terms-page/TermsPageForm.tsx`
- Create: `app/admin/privacy-policy/page.tsx` + `app/admin/privacy-policy/PrivacyPolicyForm.tsx`

**Interfaces:**
- Consumes: routes from Task 5 (`/api/about-content`, `/api/director-message`, `/api/why-page`, `/api/responsible-travel`, `/api/terms-page`, `/api/privacy-policy`).
- Produces: server `page.tsx` wrappers that pass `initialData` to client forms; forms PUT to the matching route on save.

**Pattern (repeat for all 6 — build the About one fully first):**

- [ ] **Step 1: About page.tsx**

Create `app/admin/about-content/page.tsx`:

```tsx
import { prisma } from '@/lib/prisma';
import AboutContentForm from './AboutContentForm';

export const dynamic = 'force-dynamic';

export default async function AboutContentPage() {
  const data = await prisma.aboutPageContent.findFirst();
  return <AboutContentForm initialData={data} />;
}
```

- [ ] **Step 2: AboutContentForm.tsx**

Create `app/admin/about-content/AboutContentForm.tsx` ('use client', react-hot-toast, Save button, groups):
- Fetch nothing on mount — use `initialData` props (same fields as the AboutPageContent model).
- Form groups: "Title & Image" (title input, featuredImage via `MediaUploader`), "Statistics" (happyTravelers, yearsExperience, successfulTrips, expertGuides — text inputs), "Paragraphs" (paragraph1-4 textareas), "Company Culture & Statements" (cultureTitle, cultureText, missionText, visionText, goalsText textareas).
- Submit: `PUT /api/about-content` with all fields → `toast.success('About content saved!')`.

Mirror the `SiteSettingsPage` top-bar layout (white card with ArrowLeft back link + "About Content" title + Save button). Reuse `MediaUploader` for `featuredImage`.

- [ ] **Step 3: Remaining 5 pages + forms**

Create the 5 remaining page.tsx (each `findFirst` on its model, `export const dynamic = 'force-dynamic'`, render its form) and client forms:
- `FounderMessageForm`: founderName, founderTitle, founderEmail, founderImage (MediaUploader), contentHtml (textarea with helper "Rendered as HTML on the page").
- `WhyPageForm`: title, subtitle, contentHtml textarea.
- `ResponsibleTravelForm`: title, subtitle, contentHtml textarea.
- `TermsPageForm`: title, subtitle, contentHtml textarea.
- `PrivacyPolicyForm`: title, subtitle, contentHtml textarea.

Each form follows the AboutContentForm pattern (top bar + Save → PUT to its route + toast).

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npm run build
```
Open each new admin page (`/admin/about-content`, `/admin/message-from-founder`, `/admin/why-page`, `/admin/responsible-travel`, `/admin/terms-page`, `/admin/privacy-policy`) — forms render and save without error.

- [ ] **Step 5: Commit**

```bash
git add app/admin/about-content app/admin/message-from-founder app/admin/why-page app/admin/responsible-travel app/admin/terms-page app/admin/privacy-policy && git commit -m "feat: consolidated admin editors for static pages"
```

---

### Task 7: Re-group admin sidebar, add collapse toggle, remove Dynamic Pages

**Files:**
- Modify: `app/admin/layout.tsx`
- Modify: `app/admin/page.tsx` (remove "Pages" count card, line ~43)
- Delete: `app/admin/pages/` (directory: page.tsx, PageForm.tsx, [id]/new/edit)

**Interfaces:**
- Consumes: all admin routes from Tasks 5-6 (`/admin/about-content`, etc.).
- Produces: grouped nav with section headers; a `sidebarOpen` (mobile) state already exists; add `collapsed` (desktop) state persisted to `localStorage`.

- [ ] **Step 1: Remove Dynamic Pages admin UI**

```bash
rm -rf app/admin/pages
```
Also remove the `Pages` overview card in `app/admin/page.tsx` (line ~43: `{ title: 'Pages', ... }`) and delete the now-unused `pageCount` query (line ~26). Remove unused `FileCheck` import if it becomes unused.

- [ ] **Step 2: Group the sidebar nav**

Rewrite the `<div className="flex-1 py-4 space-y-1">` block in `app/admin/layout.tsx` to emit section headers (`<div className="pt-4 px-4 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">`) for: Home, About Us, Trekking In Nepal, Tour Packages, FAQ, Blogs, Contact Us, System — with links as listed in the design spec (all existing pages kept).

New links to add: `/admin/about-content` (About Content), `/admin/message-from-founder` (Message From Founder), `/admin/why-page` (Why Ever Peak), `/admin/responsible-travel` (Responsible Travel), `/admin/terms-page` (Terms & Conditions), `/admin/privacy-policy` (Privacy Policy).

- [ ] **Step 3: Sidebar collapse toggle**

- Add `const [collapsed, setCollapsed] = useState(false);`
- Load initial value from `localStorage` in a `useEffect` (`'everpeak-admin-sidebar-collapsed'`).
- Persist on toggle.
- When `collapsed`: desktop `<aside>` width becomes `w-16` and nav labels hidden (wrap labels in a `<span className={collapsed ? 'hidden' : 'inline'}>`); group headers show as tiny separators.
- Add a collapse button (e.g. `PanelLeftClose` / `PanelLeftOpen` lucide icon) in the sidebar brand header or the main content top bar (desktop only: `hidden lg:flex`).
- The mobile drawer behavior (existing `sidebarOpen`) is unchanged.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npm run build
```
Then load `/admin` — 7 groups + System render, no "Dynamic Pages" entry, collapse button toggles width and persists across reload.

- [ ] **Step 5: Commit**

```bash
git add app/admin/layout.tsx app/admin/page.tsx && git commit -m "feat: re-group admin sidebar by site tab with collapse toggle; remove dynamic pages"
```

---

### Task 8: Admin polish sweep (every admin page)

**Files:**
- Modify: every form/page under `app/admin/` — labels and spacing only; no behavior changes except where a label is missing/misleading.

- [ ] **Step 1: Audit labels + spacing per page**

For each admin page, fix:
- Every `<input>/<textarea>/<select>` has a `<label>` (or MediaUploader `label` prop) with a precise capitalized name (e.g. "Full Name" not "Name", "Group Type" not "Type", "Discounted Price (US$)" not "Price").
- Consistent section cards: `bg-white rounded-xl p-6 border border-gray-100 space-y-4`, `h2` with `uppercase tracking-wider border-b pb-2`.
- No double `space-y`/extra `<div>` gaps, no crammed grids (< 8px gaps), no orphaned labels.
- Pages to cover: bookings (BookingsManager), blogs (BlogForm + page), contact-info, contact-submissions, contact-widget, departures (DepartureForm + page), faqs (FaqForm + page), hero-content, home-section-content, legal-documents, site-settings, subpage-hero, team, testimonials, treks (TrekForm), tours (TourForm), trust-items, video-banners, welcome-features, why-choose-us, login, dashboard.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit && npm run build
```
Spot-check the forms the user flagged as rendering badly (TrekForm, BlogForm, HeroContentForm) in the browser at desktop + mobile widths.

- [ ] **Step 3: Commit**

```bash
git add app/admin && git commit -m "polish: clean labels and spacing across all admin pages"
```
