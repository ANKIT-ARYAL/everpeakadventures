# Admin UX & Responsive Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make /admin consistent, collapsible, and fully responsive on mobile.

**Architecture:** Build three shared client primitives (`SectionCard`, `FieldGrid`, `ResponsiveTable`) plus one shared `PublishedToggle`, then roll them out across content forms and list pages. Workstreams A and B are targeted fixes; C and D are cross-cutting adoption passes.

**Tech Stack:** Next.js (App Router), React, Tailwind, Prisma, lucide-react.

## Global Constraints

- `/admin` only — never touch public routes (`app/page.tsx`, `app/(public)` etc.).
- No schema/API-route changes. Forms keep submitting to existing endpoints; layout/wiring only.
- Two existing base routes used verbatim, copied-on-adoption: `/api/admin/toggle` (PATCH `{ model, id | "__single__", published }`) and component `app/admin/components/ToggleShow.tsx`.
- Default state for collapsible sections is collapsed, except the first content section of a single-instance form which opens on mount.
- Tailwind conventions: page bg `bg-[#f0f2f5]`, cards `bg-white rounded-xl shadow-sm border border-gray-100`, accent `#24a0ed`, headings `text-[#112233]`.
- Lint must stay clean on new/edited files (eslint is configured; existing broken files are out of scope).
- Commit after each task.

---

### Task 1: Shared primitives — SectionCard, FieldGrid, PublishedToggle

**Files:**
- Create: `app/components/admin/SectionCard.tsx`
- Create: `app/components/admin/FieldGrid.tsx`
- Create: `app/admin/components/PublishedToggle.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `SectionCard`: `<SectionCard title string subtitle? string defaultOpen? boolean action?: ReactNode children>` — renders collapsible card; header row has chevron (ChevronDown rotating on open), title, subtitle, and `action` slot right-aligned.
  - `FieldGrid`: `<FieldGrid cols?: 2 | 3 | 4>` — `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-N gap-3`.
  - `PublishedToggle`: `<PublishedToggle published boolean onChange (p)=>void size?: 'sm'|'md'>` — Eye/EyeOff pill; `size="sm"` compact for card headers, `size="md"` (default) with visible label.
- [x] (this checklist item tracks the task; Steps 1-3 below are the implementation)

- [ ] **Step 1: Create `PublishedToggle.tsx`**

```tsx
'use client';
import { Eye, EyeOff } from 'lucide-react';

interface Props { published: boolean; onChange: (p: boolean) => void; size?: 'sm' | 'md'; }

export default function PublishedToggle({ published, onChange, size = 'md' }: Props) {
  const cls = size === 'sm'
    ? 'inline-flex items-center gap-1 p-1.5 rounded-lg transition-colors'
    : 'inline-flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors';
  const stateCls = published
    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
    : 'bg-gray-100 text-gray-500 hover:bg-gray-200';
  return (
    <button
      type="button"
      onClick={() => onChange(!published)}
      title={published ? 'Hide from frontend' : 'Show on frontend'}
      aria-label={published ? 'Hide from frontend' : 'Show on frontend'}
      className={`${cls} ${stateCls}`}
    >
      {published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      <span className="hidden md:inline text-xs font-medium">{published ? 'Hide' : 'Show'}</span>
    </button>
  );
}
```

- [ ] **Step 2: Create `SectionCard.tsx`**

```tsx
'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function SectionCard({ title, subtitle, defaultOpen = false, action, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 min-w-0 text-left">
          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
          <span className="min-w-0">
            <span className="block font-bold text-[#112233] uppercase tracking-wide text-sm truncate">{title}</span>
            {subtitle && <span className="block text-[11px] text-gray-400 truncate">{subtitle}</span>}
          </span>
        </button>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
      {open && <div className="px-4 sm:px-5 pb-5 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}
```

- [ ] **Step 3: Create `FieldGrid.tsx`**

```tsx
'use client';
import React from 'react';

interface Props { cols?: 2 | 3 | 4; className?: string; children: React.ReactNode; }

export default function FieldGrid({ cols = 2, className = '', children }: Props) {
  const colsCls = cols === 4 ? 'lg:grid-cols-4' : cols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';
  return <div className={`grid grid-cols-1 sm:grid-cols-2 ${colsCls} gap-3 ${className}`}>{children}</div>;
}
```

- [ ] **Step 4: Verify compile**

Run: `npx tsc --noEmit`
Expected: only the pre-existing `app/admin/testimonials/TestimonialForm.tsx` errors.

- [ ] **Step 5: Commit**

```bash
git add app/components/admin/SectionCard.tsx app/components/admin/FieldGrid.tsx app/admin/components/PublishedToggle.tsx
git commit -m "feat(admin): add SectionCard, FieldGrid, PublishedToggle primitives"
```

---

### Task 2: Workstream B — single booking-requests nav item with count

**Files:**
- Modify: `app/admin/AdminShell.tsx:64-78` (navItems) and `:178` (duplicate block)

**Interfaces:**
- Consumes: `BookingsNotification` (`app/admin/components/BookingsNotification.tsx`) — already fetch+badge.
- Produces: sidebar with exactly one bookings entry, badge enabled.

- [ ] **Step 1: Remove static bookings item from `navItems` and render `BookingsNotification` in place**

Replace the `{ href: '/admin/bookings', ... }` entry in `navItems` so bookings is *not* a plain item. Inside `renderNav()`, right after the `filteredNav.map(...)`, keep bookkeeping minimal:

```tsx
{filteredNav.map((item) => renderNavItem(item))}
{showBookings && <BookingsNotification collapsed={collapsed} />}
```

Remove this line entirely:
```tsx
{showBookings && <BookingsNotification collapsed={collapsed} />}
```
(former line 178 duplicate), so the badge-enabled instance is the only one.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` (only pre-existing TestimonialForm errors). Manually: sidebar shows one "Booking Requests" with orange count badge at top.

- [ ] **Step 3: Commit**

```bash
git add app/admin/AdminShell.tsx
git commit -m "fix(admin): dedupe booking requests nav item; keep count badge"
```

---

### Task 3: Workstream A — RouteMapEditor into 4 collapsible blocks

**Files:**
- Rewrite: `app/components/admin/RouteMapEditor.tsx` (body only; types/interfaces unchanged)

**Interfaces:**
- Consumes: `SectionCard` (Task 1).
- Produces: same exports — `RoutePointType`, `SegmentType`, `PeakData`, `RoutePointData`, `RouteSegmentData`, `RouteMapData`, `EMPTY_ROUTE_MAP`, default `RouteMapEditor` (`value`, `onChange`) with identical behavior.

- [ ] **Step 1: Rewrite editor body using SectionCard**

Keep all helpers (`set`, `setPeak`, `setPoint`, `setSegment`, `trashBtn`, `inputCls`, `labelCls`, add buttons). Replace the four container sections with four `SectionCard`s:

```tsx
<SectionCard title="Header & Branding" subtitle="Title, altitude, brand and footer link" defaultOpen>
  ...existing metadata fields, wrapped in FieldGrid where they were grid md:grid-cols-3...
</SectionCard>
<SectionCard title="Peaks" subtitle={`${d.peaks.length} peaks defined`} action={addPeakBtn}>
  ...existing peaks body...
</SectionCard>
<SectionCard title="Route Points" subtitle={`${d.routePoints.length} points defined`} action={addPointBtn}>
  ...existing points body...
</SectionCard>
<SectionCard title="Route Segments" subtitle={`${d.routeSegments.length} segments defined`} action={addSegmentBtn}>
  ...existing segments body...
</SectionCard>
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npx eslint app/components/admin/RouteMapEditor.tsx` — must be clean.
Manual: open a trek/tour edit form; route map shows 4 cards; Header & Branding open; Peaks/Points/Segments collapsed with counts; add buttons live in card headers.

- [ ] **Step 3: Commit**

```bash
git add app/components/admin/RouteMapEditor.tsx
git commit -m "feat(admin): split route map editor into 4 collapsible sections"
```

---

### Task 4: Workstream D — `FieldGrid` rollout across wide field grids in content forms

**Files (each: replace `md:grid-cols-<n>` grids with `FieldGrid`; full paths):**
- `app/admin/treks/TrekForm.tsx`
- `app/admin/tours/TourForm.tsx`
- `app/admin/hero-content/HeroContentForm.tsx`
- `app/admin/why-choose-us/content/TrustedPartnerForm.tsx`
- `app/admin/video-banners/VideoBannerForm.tsx`
- `app/admin/director-message/DirectorMessageForm.tsx`
- `app/admin/contact-info/ContactInfoForm.tsx`
- `app/admin/site-settings/SiteSettingsForm.tsx` (if exists; else skip)
- `app/admin/home-section-content/HomeSectionContentForm.tsx`

**Interfaces:**
- Consumes: `FieldGrid` (Task 1).
- Produces: no overflow at phone widths in these forms.

- [ ] **Step 1: For each file, identify grids with `md:grid-cols-3`/`md:grid-cols-4` (or wider)**

Replace each with `FieldGrid cols={3|4}` keeping children identical. Where a single-row grid has more than 4 fields, split into nested `FieldGrid`s or a `grid-cols-1 sm:grid-cols-2` fallback.

- [ ] **Step 2: Verify responsive intent**

Run: `npx tsc --noEmit`. In `npm run dev`, set the inspector to a 375px viewport; every input in the listed forms spans full width and nothing overflows horizontally.

- [ ] **Step 3: Commit**

```bash
git add app/admin/treks/TrekForm.tsx app/admin/tours/TourForm.tsx app/admin/hero-content/HeroContentForm.tsx app/admin/why-choose-us/content/TrustedPartnerForm.tsx app/admin/video-banners/VideoBannerForm.tsx app/admin/director-message/DirectorMessageForm.tsx app/admin/contact-info/ContactInfoForm.tsx app/admin/home-section-content/HomeSectionContentForm.tsx
git commit -m "feat(admin): apply responsive FieldGrid to content forms"
```

---

### Task 5: Workstream C(single) — SectionCard + PublishedToggle in single-instance content forms

**Files:**
- Modify all single-instance form components (wrap each in a `SectionCard` with a live `PublishedToggle` `action`):
  - `app/admin/hero-content/HeroContentForm.tsx`
  - `app/admin/welcome-features/WelcomeContentForm.tsx` (locate actual name)
  - `app/admin/why-page/WhyPageForm.tsx` (locate actual name)
  - `app/admin/why-choose-us/content/TrustedPartnerForm.tsx`
  - `app/admin/video-banners/VideoBannerForm.tsx` (its top-level Video Banner + CTA cards)
  - `app/admin/about-content/AboutContentForm.tsx` (locate actual name)
  - `app/admin/director-message/DirectorMessageForm.tsx` (locate actual name)
  - `app/admin/contact-info/ContactInfoForm.tsx`
  - `app/admin/subpage-hero/SubpageHeroForm.tsx` (add PublishedToggle to header; single-instance here means one hero per slug)
  - `app/admin/home-section-content/HomeSectionContentForm.tsx`
  - `app/admin/responsible-travel/*`, `app/admin/terms-page/*`, `app/admin/privacy-policy/*`, `app/admin/trust-items/*`, `app/admin/contact-widget/*` — add published toggle if missing.

**Interfaces:**
- Consumes: `SectionCard`, `PublishedToggle` (Task 1); `/api/admin/toggle` for the toggle's PATCH.
- Produces: every single-instance section page shows a collapsed-by-default card with Show/Hide in the header.

Pattern to adopt per form (component-local):

```tsx
const [published, setPublished] = useState(initialData?.published ?? true);
// ...after a successful save, uncomment flagging in toggle too if desired
<SectionCard
  title="Section Content"
  defaultOpen
  action={<PublishedToggle published={published} onChange={async (p) => {
    setPublished(p);
    await fetch('/api/admin/toggle', { method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: '<model-key>', id: '__single__', published: p }) });
  }} />}
>
  ...existing form fields...
</SectionCard>
```

Model keys allowed (from `/api/admin/toggle` modelMap): `hero-content`, `home-section-content`, `video-banner-content`, `cta-banner-content`, `about-content`, `director-message`, `why-page`, `responsible-travel`, `terms-page`, `privacy-policy`, `contact-info`, `contact-widget`, `trusted-partner`, `testimonials-section`, `blue-banner`, `welcome-content`.

- [ ] **Step 1:** Apply the SectionCard+PublishedToggle wrapper to `HeroContentForm`, `VideoBannerForm` (top-level), `TrustedPartnerForm`, `HomeSectionContentForm`.
- [ ] **Step 2:** Apply to the remaining listed forms; locate actual component names first (`ls app/admin/<dir>`). For `subpage-hero/SubpageHeroForm`, `published` corresponds to the hero record (id from `initialData.id`) — implement the toggle with `id: initialData?.id ?? '__single__'`.
- [ ] **Step 3:** For item edit pages (treks, tours, blogs, team, testimonials, faqs, departures, legal-documents), add a compact publish-status strip in the edit-form header:
  pattern: a small `bg-white rounded-xl px-4 py-2 flex justify-between items-center` bar at top of the edit page with `PublishedToggle` using `id: <item id>` (loaded page passes `initialData.id`). Use model keys from toggle modelMap (`treks`, `tours`, `blogs`, `team`, `testimonials`, `faqs`, `departures`, `legal-documents`).
- [ ] **Step 4:** Verify

Run: `npx tsc --noEmit`. In dev at 375px: every single-instance section page shows a titled card with Show/Hide pill; forms collapsed by default; toggling flips a server-refreshed state.

- [ ] **Step 5: Commit**

```bash
git add app/admin/hero-content app/admin/video-banners app/admin/why-choose-us app/admin/home-section-content app/admin/about-content app/admin/director-message app/admin/contact-info app/admin/subpage-hero app/admin/responsible-travel app/admin/terms-page app/admin/privacy-policy app/admin/trust-items app/admin/contact-widget app/admin/treks app/admin/tours app/admin/blogs app/admin/team app/admin/testimonials app/admin/faqs app/admin/departures app/admin/legal-documents
git commit -m "feat(admin): section cards with show/hide toggles on all content forms"
```

---

### Task 6: Workstream C(forms) — Trek & Tour forms sectioned with sticky jump-nav

**Files:**
- Modify: `app/admin/treks/TrekForm.tsx`
- Modify: `app/admin/tours/TourForm.tsx`
- Create: `app/components/admin/StickySectionNav.tsx` (optional helper if both forms use it)

**Interfaces:**
- Consumes: `SectionCard`, `FieldGrid`, `PublishedToggle`.
- Produces: trek/tour edit forms grouped into named collapsible sections; sticky jump-nav with chips.

- [ ] **Step 1: Create `StickySectionNav`** (shared)

```tsx
'use client';
export default function StickySectionNav({ sections }: { sections: string[] }) {
  return (
    <div className="sticky top-0 z-30 bg-[#f0f2f5] py-2 -mx-1">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {sections.map((s) => (
          <a key={s} href={`#sec-${s.replace(/\s+/g, '-').toLowerCase()}`}
             className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#24a0ed] hover:text-[#24a0ed]">
            {s}
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Section TrekForm**

Group the existing big sections into `SectionCard`s with `id` anchors (`id="sec-overview"` on the card wrapper or add via a wrapping div). Assign section ids matching `StickySectionNav` chips: Overview, Media, Route Map, Itinerary, Pricing & Booking, FAQ, SEO. Each card `defaultOpen={section === 'Overview'}` except Route Map (keep its inner 4 blocks as-is; one card per whole route map).

- [ ] **Step 3: Section TourForm** — mirror Step 2 with the same section names.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` and `npx eslint app/components/admin/StickySectionNav.tsx app/admin/treks/TrekForm.tsx app/admin/tours/TourForm.tsx` (only pre-existing `any`/unused errors tolerated — none *new*).

- [ ] **Step 5: Commit**

```bash
git add app/components/admin/StickySectionNav.tsx app/admin/treks/TrekForm.tsx app/admin/tours/TourForm.tsx
git commit -m "feat(admin): collapsible sections + sticky jump nav in trek/tour forms"
```

---

### Task 7: Workstream D — ResponsiveTable rollout

**Files:**
- Create: `app/components/admin/ResponsiveTable.tsx`
- Ads: `app/admin/bookings/page.tsx`, `app/admin/departures/page.tsx`, `app/admin/team/page.tsx`, `app/admin/testimonials/page.tsx`, `app/admin/legal-documents/page.tsx`, `app/admin/users/page.tsx`, `app/admin/roles/page.tsx`, `app/admin/trek-categories/page.tsx`, `app/admin/tour-categories/page.tsx`, `app/admin/pages/content-pages-list` (locate file)

**Interfaces:**
- Consumes: nothing new.
- Produces: `ResponsiveTable` wrapper:
  `header: string[]`, `rows: React.ReactNode[][]`, `mobileRender?: (row,data)=>ReactNode`, `keyFn`.

- [ ] **Step 1: Create `ResponsiveTable.tsx`**

```tsx
'use client';
import React from 'react';

interface Props {
  headers: string[];
  rows: React.ReactNode[][];
  mobileCards?: (row: React.ReactNode[]) => React.ReactNode;
  emptyText?: string;
}

export default function ResponsiveTable({ headers, rows, mobileCards, emptyText = 'No items found.' }: Props) {
  if (rows.length === 0) {
    return <div className="p-12 text-center text-gray-400 font-medium">{emptyText}</div>;
  }
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
              {headers.map((h, i) => <th key={i} className="py-3 px-4">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-[#fcfcfc] transition-colors">
                {r.map((c, j) => <td key={j} className="py-3 px-4 align-middle">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mobileCards && (
        <div className="md:hidden space-y-3">
          {rows.map((r, i) => <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">{mobileCards(r)}</div>)}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2:** Adopt `ResponsiveTable` in the listed list pages, replacing their hand-rolled `<table>` + separate mobile-card blocks (or their current single-table-with-overflow where mobile cards are missing). Follow the existing `subpage-hero/page.tsx` structure and the component API above. Preserve all action buttons (Edit/View/Delete/Toggle) in both desktop rows and mobile cards.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`. Dev at 375px: bookings, departures, team, testimonials, legal-documents, users show stacked cards (no horizontal scroll); at ≥768px show the normal table.

- [ ] **Step 4: Commit**

```bash
git add app/components/admin/ResponsiveTable.tsx app/admin/bookings app/admin/departures app/admin/team app/admin/testimonials app/admin/legal-documents app/admin/users app/admin/roles app/admin/trek-categories app/admin/tour-categories
git commit -m "feat(admin): responsive table/card pattern across list pages"
```

---

### Task 8: Workstream D — shell padding, tap targets, dashboard typography

**Files:**
- Modify: `app/admin/AdminShell.tsx` (main padding `p-4 md:p-8` → `p-3 sm:p-5 lg:p-8`)
- Modify: `app/admin/page.tsx` (stat counts `text-3xl` → `text-2xl sm:text-4xl`; overview card grid spacing)
- Modify: admin list action button components to enlarge hit targets on mobile:
  - `app/admin/components/EditButton.tsx`, `ViewButton.tsx`, `DeleteButton.tsx`, `AddNewButton.tsx` (ensure `min-h/h-10` class on mobile via responsive padding; keep compact on desktop)

**Interfaces:**
- Consumes: nothing new.
- Produces: comfortable tap targets and consistent shell padding.

- [ ] **Step 1:** Update `AdminShell.tsx` main element padding.
- [ ] **Step 2:** Update dashboard typography in `app/admin/page.tsx`.
- [ ] **Step 3:** Add responsive hit-area classes to the four action button components (`px-2.5 py-2.5 sm:py-2` or `h-10 sm:h-auto`).
- [ ] **Step 4: Verify** — `npx tsc --noEmit` clean (excluding pre-existing), dev at 375px shows comfortable buttons.
- [ ] **Step 5: Commit**

```bash
git add app/admin/AdminShell.tsx app/admin/page.tsx app/admin/components/EditButton.tsx app/admin/components/ViewButton.tsx app/admin/components/DeleteButton.tsx app/admin/components/AddNewButton.tsx
git commit -m "feat(admin): responsive shell padding, tap targets, dashboard typography"
```

---

### Task 9: Final verification

**Files:** none.

- [ ] **Step 1: Run full check**

Run: `npx tsc --noEmit`
Expected: only the pre-existing `TestimonialForm.tsx` syntax errors (out of scope).

- [ ] **Step 2: Lint all touched files**

Run: `npx eslint app/components/admin/SectionCard.tsx app/components/admin/FieldGrid.tsx app/components/admin/ResponsiveTable.tsx app/components/admin/StickySectionNav.tsx app/admin/components/PublishedToggle.tsx app/admin/AdminShell.tsx app/admin/page.tsx app/admin/components/EditButton.tsx app/admin/components/ViewButton.tsx app/admin/components/DeleteButton.tsx app/admin/components/AddNewButton.tsx`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: builds successfully (or only non-blocking warnings).

- [ ] **Step 4: Manual smoke (dev at 375px and 1280px)**

Check: booking nav item single+badged; route map 4 cards; section forms collapsed with toggles; trek/tour sticky nav; all list pages stack into cards on mobile; dashboard counts readable.

---