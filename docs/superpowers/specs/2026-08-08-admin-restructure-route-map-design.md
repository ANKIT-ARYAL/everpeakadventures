# Admin Restructure + Route Map + Admin Polish — Design

Date: 2026-08-08
Status: Draft for review

## 1. Route Map (Trek & Tour pages)

### Goal
Let the trek/tour detail pages show a rich geographic route map like the reference (EBC with Gokyo Lake), fully changeable from the admin panel.

### Approach: Uploaded map image + existing dynamic elevation chart

- Add `mapImage String?` to both `Trek` and `Tour` models in `prisma/schema.prisma`.
- Admin forms `TrekForm.tsx` and `TourForm.tsx` get a new **Route Map Image** field using the existing `/api/upload` endpoint (a single global endpoint, already admin-gated in this session). No new upload infra. `mapUrl` (embed) field stays untouched — the new `mapImage` field is independent, so it does not interfere with other image uploads or the existing map-embed field.
- Public pages `app/trekking/[slug]/page.tsx` and `app/tour/[slug]/page.tsx`: add a **Route Map** section above the existing "Route Map & Elevation Profile" block that:
  - Renders the uploaded `mapImage` full-width (`rounded-xl`, `w-full h-auto object-contain`) when present.
  - Below it, keeps the existing `RouteMap` animated elevation chart, which is already dynamic per-day (`elev` per itinerary day edited in admin).
  - When `mapImage` is empty, the section renders exactly as today (elevation chart only).
- Data flow: `findUnique`/`findMany` selects already include all scalar fields by default, so `mapImage` flows automatically once added to the schema; no select changes needed.

## 2. Admin sidebar re-organization into the 7 frontend tabs

The public navbar has 7 top-level items: Home, About Us, Trekking In Nepal, Tour Packages, FAQ, Blogs, Contact Us. The admin sidebar is re-grouped to mirror these, keeping **every current admin page** — nothing is removed except "Dynamic Pages". A new "System" group retains the remaining advanced sections.

Proposed sidebar structure (`app/admin/layout.tsx`):

- **Dashboard** (`/admin`) — keep
- **Home** (group header)
  - Hero Banners (`/admin/hero-content`)
  - Home Sections (`/admin/home-section-content`)
  - Video & CTA Banners (`/admin/video-banners`)
  - Trust Badges (`/admin/trust-items`)
  - Welcome Features (`/admin/welcome-features`)
  - Why Choose Us (`/admin/why-choose-us`)
- **About Us** (group header)
  - About Content (`/admin/about-content`)  — NEW consolidated editor
  - Message From Founder (`/admin/message-from-founder`) — NEW consolidated editor
  - Team Members (`/admin/team`)
  - Why Ever Peak (`/admin/why-page`) — NEW consolidated editor
  - Responsible Travel (`/admin/responsible-travel`) — NEW consolidated editor
  - Terms & Conditions (`/admin/terms-page`) — NEW consolidated editor
  - Privacy Policy (`/admin/privacy-policy`) — NEW consolidated editor
  - Legal Documents (`/admin/legal-documents`) — kept
- **Trekking In Nepal** (group header)
  - Treks (`/admin/treks`)
  - Trekking Types (`/admin/trekking-types`) — see note below
- **Tour Packages** (group header)
  - Tours (`/admin/tours`)
  - Tour Destinations (`/admin/tour-destinations`) — see note below
  - Fixed Departures (`/admin/departures`) — kept
- **FAQ**
  - FAQs (`/admin/faqs`) — kept
  - Testimonials / Reviews (`/admin/testimonials`) — kept
- **Blogs**
  - Blog Posts (`/admin/blogs`) — kept
- **Contact Us** (group header)
  - Contact Info (`/admin/contact-info`)
  - Contact Widget (`/admin/contact-widget`)
  - Contact Submissions (`/admin/contact-submissions`)
  - Booking Requests (`/admin/bookings`) — kept
- **System** (group header)
  - Site Settings (`/admin/site-settings`)
  - Subpage Heroes (`/admin/subpage-hero`) — kept, as "manage-all heroes"

### Guarantee: every current sidebar entry survives
None of the existing pages are hidden, renamed away, or merged into oblivion. The mapping above keeps: Hero Banners, Home Sections, Video & CTA Banners, Trust Badges, Welcome Features, Why Choose Us, Team, Legal Documents, Treks, Tours, Fixed Departures, FAQs, Testimonials, Blog Posts, Contact Info, Contact Widget, Contact Submissions, Booking Requests, Site Settings, Subpage Heroes — all still reachable, just re-grouped by site tab. Only **Dynamic Pages** is removed (see below) and the new consolidated editors are added.

### Dynamic Pages removal
- Remove "Dynamic Pages" from the sidebar.
- The `Page`/`Section` models are empty and unused in the public site. **Remove the admin UI only** (folder `app/admin/pages/`); the Prisma models stay (harmless, avoids risky data migration). The dashboard "Pages" count card is removed too.

## 3. Consolidated static-page editors (one screen per site page)

Merge the scattered one-field forms into single editors per public page. Each reads/writes the existing content model via its existing API route (all already admin-gated).

- `app/admin/about-content/page.tsx` + `AboutContentForm.tsx` — edits `AboutPageContent`: title, featured image, 4 stat numbers (Happy Travelers / Years / Successful Trips / Expert Guides), 4 paragraphs, culture title+text, mission/vision/goals. Uses `/api/admin/about-content` (new) or reuse existing pattern.
- `app/admin/message-from-founder/page.tsx` + form — edits `DirectorMessageContent`: founder name/title/email/image + `contentHtml` rich text.
- `app/admin/why-page/page.tsx` + form — edits `WhyPageContent`: title, subtitle, `contentHtml`.
- `app/admin/responsible-travel/page.tsx` + form — edits `ResponsibleTravelContent`.
- `app/admin/terms-page/page.tsx` + form — edits `TermsPageContent`.
- `app/admin/privacy-policy/page.tsx` + form — edits `PrivacyPolicyContent`.
- **Where rich HTML is stored** (`contentHtml`) use the same rich-text editor pattern the blog/tour forms use (check `BlogForm.tsx` for the existing editor component; reuse it).
- API routes: create per-content routes following the existing `app/api/hero-content/route.ts` pattern (GET = `findFirst()`, PUT = `upsert`/`update`, both gated by `requireAdmin()`). Add these files:
  - `app/api/about-content/route.ts` → `prisma.aboutPageContent`
  - `app/api/director-message/route.ts` → `prisma.directorMessageContent`
  - `app/api/why-page/route.ts` → `prisma.whyPageContent`
  - `app/api/responsible-travel/route.ts` → `prisma.responsibleTravelContent`
  - `app/api/terms-page/route.ts` → `prisma.termsPageContent`
  - `app/api/privacy-policy/route.ts` → `prisma.privacyPolicyContent`
  - The generic `/api/admin/[model]` route must **not** be reused here — it does `findMany({ orderBy: { order: 'asc' } })` which breaks on content models that have no `order` column; per-model `findFirst` routes are the correct, safe path.

## 4. Includes / Excludes — single column

- `app/trekking/[slug]/page.tsx` line ~332: `grid grid-cols-2 gap-6` → `grid grid-cols-1 gap-8`.
- `app/tour/[slug]/page.tsx` same section → single column.
- Each include/exclude list becomes full-width.

## 5. Admin polish (all admin pages)

Sweep **every** admin page/form for:
- **Clear field labels**: every input/select/textarea has a precise, capitalized, self-explanatory label; no labels like "Name" where "Full Name" is clearer, no missing labels.
- **Spacing fixes**: consistent `space-y`, consistent card padding (`p-6`), no double margins or cramped grids; fix any mis-rendered boxes/whitespace.
- **Field grouping**: related fields grouped under section headings.
- **Sidebar collapse toggle**: add a button in the admin header that collapses the sidebar to icon-only (persist in `localStorage`).

## 6. Out of scope / notes

- No data migration for `Page`/`Section` (models kept, UI removed).
- `mapUrl` embed field on Trek/Tour retained; only a new `mapImage` field is added.
- No changes to public layout/nav; only admin grouping changes.

## 7. Verification

- `npx tsc --noEmit` clean; `npm run build` passes.
- Each new admin page loads (200 after login) and saves to the right model.
- Trek/tour pages render `mapImage` when set and fall back cleanly when not.
- Includes/excludes render single-column on mobile + desktop.
- Every existing admin page still renders without layout breakage.
