# Testimonials Admin — Design

Date: 2026-08-05

## Goal

Add a testimonials admin (CRUD) to match the existing blogs admin pattern, and make the
homepage testimonials section fully editable from the admin panel — both the review items
and the section headings.

## Data Model

Existing model `ClientReview` (prisma schema):
- `quote`, `name`, `location`, `avatar`, `order`, timestamps.

New single-record content model (same pattern as `BlueBannerContent` / `CtaBannerContent`):

```prisma
model TestimonialSectionContent {
  id        String   @id @default(uuid())
  title     String   @default("WHAT OUR CLIENT SAY ABOUT US ?")
  subtitle  String   @default("Real experiences shared by travelers who trusted us.")
  watermark String   @default("CLIENTS REVIEWS")
  updatedAt DateTime @updatedAt
}
```

Applied with `prisma db push` (no migrations directory exists yet).

## API Routes

- `app/api/testimonials/route.ts` — `GET` (findMany ordered by `order` asc) + `POST` (create review).
- `app/api/testimonials/[id]/route.ts` — `PUT` (update review) + `DELETE` (delete review).
- `app/api/testimonials/section/route.ts` — `GET` (findFirst section content) + `PUT` (upsert: update first record or create if none exists).

## Admin Pages

- `app/admin/testimonials/page.tsx` — reviews table (avatar, name, location, quote, order,
  actions) using existing `AddNewButton` / `EditButton` / `DeleteButton`
  (`model="testimonials"` — already supported by the generic admin API).
- `app/admin/testimonials/TestimonialForm.tsx` — one client form containing:
  - Section Headings box (title, subtitle, watermark)
  - Review fields (quote, name, location, avatar URL + preview, order)
  - On submit: saves the review (`POST` to `/api/testimonials` or `PUT` to
    `/api/testimonials/:id`) AND upserts the section content (`PUT` to
    `/api/testimonials/section`), then redirects to `/admin/testimonials`.
- `app/admin/testimonials/new/page.tsx` — server component; fetches section content and
  passes it to the form as initial data.
- `app/admin/testimonials/[id]/edit/page.tsx` — server component; fetches the review and
  section content, passes both to the form.

## Frontend

- `app/components/home/ClientReviews.tsx` — accept a `section` prop (title, subtitle,
  watermark) and render it instead of the hardcoded headings.
- `app/components/wrappers/ClientReviewsWrapper.tsx` and `app/testimonials/page.tsx` — fetch
  `prisma.testimonialSectionContent.findFirst()` and pass it to `ClientReviews`.

## Notes

- The admin sidebar (`app/admin/layout.tsx`) and dashboard card already link to
  `/admin/testimonials`; no nav changes needed.
- The generic admin API (`app/api/admin/[model]/...`) already maps `testimonials` to
  `prisma.clientReview`, which `DeleteButton` uses.
