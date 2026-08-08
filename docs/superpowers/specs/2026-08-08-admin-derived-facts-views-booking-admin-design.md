# Admin Auto-Derived Pricing/Facts, View Buttons, and Instant Booking Filters

Date: 2026-08-08

## Goal

Three improvements to the admin area, matching the WordPress reference:

1. **Trek & Tour forms**: "Pricing & Quick Facts" must not be a set of freely-edited inputs for fields that can be derived. It becomes a live "On-Page Preview" that reflects values entered in other sections, updating instantly as the user types (no refresh required).
2. **View buttons**: Every admin list page gets a "View" action next to Edit/Delete that opens the public frontend page in a new tab. Trek/tour edit forms also get a "View live page" button.
3. **Booking panel**: Fix modal view/scroll so the user can scroll a booking's full details and reach Save/Delete. Convert filtering to instant client-side quick-search — the list updates immediately as the user types in search, changes selects/pills, or clicks Reset. No Enter/reload required.

## Parts

### 1) Live-derived preview in Trek/Tour forms

The editable grid in the "Pricing & Quick Facts" box is replaced with a panel that shows both editable and live-derived values.

**Editable (persisted, user-typed)** — these have no derivation source and stay manual inputs:
- `difficulty`, `bestSeason`, `accommodation`, `meals`, `transport`, `activity`, `region`/`destination`

**Auto-derived (read-only, computed live from other sections):**

| Derived value | Computed from |
|---|---|
| Price / person | min price over the `groupPrices` repeater rows (falls back to `price`/`discountedPrice`) |
| Regular price (strikethrough) | `originalPrice` — stays an editable manual input |
| Price range | min–max across `groupPrices` row prices, formatted `US$ min - US$ max` |
| Group size | min–max pax parsed from `groupPrices[].groupSize` (e.g. "2 - 4 Pax") |
| Duration | count of itinerary days → `"N Days"` |
| Max altitude | max numeric elevation across itinerary entries |

Derived texts recompute instantly via client `useMemo`/`useEffect` as the user edits the group/repeater, itinerary, or price fields — no page refresh.

**Persistence:** on Save, derived values (`priceRange`, `groupSize`, `durationDays`, `maxAltitude`, prices if left blank) are stamped into the DB columns so list views and the frontend stay consistent. Existing API routes for treks/tours are reused; only the submitted payload is extended.

### 2) View buttons on admin pages

- Add a reusable `app/admin/components/ViewButton.tsx` that renders a "View" link (`target="_blank"`) next to Edit/Delete in the Actions cell.
- Add it to every list page that lists rows with a public URL: treks, tours, blogs, departures, faqs, legal-documents, pages, subpage-hero, team, testimonials, trust-items, welcome-features, why-choose-us.
- Public URL per entity uses its `slug` where the entity has a frontend route; hide the button when no public URL is available.
- Also add a "View live page" secondary button in trek/tour edit page headers.

### 3) Bookings panel fixes

**Scroll/view fix:** ensure `ftb-modal-card` has `max-height` + `overflow:auto` inside the existing `ftb.css` (or an inline override) so full booking details and Save/Delete are reachable within a long card, and let the page scroll normally (remove accidental body scroll lock when modal is open).

**Instant filters (client-side):**
- Convert the filter bar from GET-submit to pure client-side state in `BookingsManager.tsx`: the search input, status select, trip select, and date inputs all call a handler on every change.
- Quick-card links and tool pills become buttons/<link> that set the same client state (no full page navigation).
- Reset clears state.
- The list re-filters instantly from the already-fetched `rows` prop (already loaded server-side) with no reload.

## Files

| Area | Files |
|---|---|
| Trek/Tour forms | `app/admin/treks/TrekForm.tsx`, `app/admin/tours/TourForm.tsx` |
| View button | `app/admin/components/ViewButton.tsx`, all admin list `page.tsx` routes listed above |
| Booking filters | `app/admin/bookings/BookingsManager.tsx`, `app/admin/bookings/ftb.css` |

## Verification

- `npx tsc --noEmit`
- `npm run build`
- Manual: open a trek/tour edit form, type in group pricing and itinerary, confirm the preview updates instantly; open each admin list page and click View; on the bookings page type in search / change selects / click pills and Reset — confirm instant filtering and that a booking modal scrolls fully with Save/Delete reachable.