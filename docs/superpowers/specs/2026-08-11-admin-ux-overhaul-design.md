# Admin UX & Responsive Overhaul — Design Spec

> Status: Approved (2026-08-11)
> Scope: `/admin` only. No changes to public frontend pages.

## Goal

Make the Ever Peak Adventures admin panel usable and consistent on every screen
size (especially mobile), reduce the pain of editing huge content forms, and
remove UX duplication bugs.

## Workstreams

1. **A — Route map into 4 collapsible blocks**
   `RouteMapEditor` split into stacked `SectionCard` blocks:
   - Header & Branding (title, subtitle, max altitude, brand name/tagline, footer URL) — open by default
   - Peaks — collapsed by default
   - Route Points — collapsed by default
   - Route Segments — collapsed by default
   No data-shape change. Applies to both Trek and Tour forms automatically.

2. **B — Single booking-requests nav item with count**
   - Remove static `Booking Requests` entry from `AdminShell.tsx` `navItems` (line 65).
   - Render `BookingsNotification` in its place at the same top-nav position.
   - Remove the duplicate bottom `BookingsNotification` block (line 178).
   Result: one item, top of nav, orange count badge.

3. **C — Per-section hide/show + collapsible forms everywhere**
   - Extract `PublishedToggle` into `app/admin/components/PublishedToggle.tsx`; reuse in `ToggleShow`.
   - Single-instance section pages: form wrapped in `SectionCard`, Show/Hide toggle in card header, collapsed by default.
   - Item pages: keep per-row `ToggleShow`; add publish-status strip to each item's edit-form header.
   - Trek & Tour forms sectioned: Overview / Media / Route Map / Itinerary / Pricing & Booking / FAQ / SEO, each a `SectionCard`, with a sticky section jump-nav under the page header.
   - No schema/API changes (published already exists on all content models).

4. **D — Responsive + UI polish**
   - `FieldGrid` shared component: collapses to 1 column below `sm`.
   - `ResponsiveTable` shared component: `overflow-x-auto` table on desktop → stacked cards on mobile. Standardizes the pattern already in `subpage-hero/page.tsx`.
   - Apply to bookings, departures, treks, tours, media, testimonials, users, etc.
   - Tap targets: buttons/rows ≥ h-10 / py-2.5 on mobile.
   - Typography: dashboard stat counts scale (`text-2xl sm:text-4xl`), consistent hierarchy.
   - Shell spacing: `p-3 sm:p-5 lg:p-8`, consistent `rounded-xl` cards.

## Architecture

Three shared client primitives in `app/components/admin/`:
- `SectionCard.tsx` — collapsible accordion card (header: chevron, title, subtitle, actions slot).
- `FieldGrid.tsx` — responsive field grid wrapper.
- `ResponsiveTable.tsx` — table + mobile-card pattern.

Plus one shared toggle in `app/admin/components/`:
- `PublishedToggle.tsx` — Eye/EyeOff pill used by both `ToggleShow` and section card headers.

## Constraints

- `/admin` only; never touch public routes.
- All content forms submit to their existing API routes — only layout/wiring changes.
- Default state for collapsible sections is collapsed (except first content section of single-instance forms, which opens).
- Follow existing Tailwind conventions (`bg-[#f0f2f5]`, `rounded-xl`, `#24a0ed` accent).