# Ever Peak Adventures — WordPress Backend Schema Reference

Reverse-engineered from the live site (REST API + WP-Admin edit-form OCR), for
cloning the backend into this Next.js/Prisma app so add/edit forms match 1:1.

Base: `https://everpeakadventures.com/wp-json`

---

## 1. Stack / plugins detected

From `namespaces` + `routes` in `/wp-json/`:

| Plugin | Evidence |
|---|---|
| **JetEngine** (CPTs, meta boxes, taxonomies) | `jet-engine/v1`, `jet-engine/v2/*`, `/wp/v2/<cpt>` routes |
| **FlyUp Booking** (custom pricing / group costing) | "FlyUp Booking - Group Size Costing" meta box (in edit form) |
| **FlyUp Connector** (dev's sync endpoints) | `flyup-connector/v1/*` |
| **Elementor** (+ Pro, AI) | `elementor/*`, `/wp/v2/elementor_library`, `elementor_snippet` |
| **Yoast SEO** | `yoast/v1/*`, `yoast_head`/`yoast_head_json` on every item |
| **Optimole** (image CDN) | `optml/v1/*` (URLs rewritten `i.optimole.com`) |
| **JetMenu**, **JetSmartFilters**, **Croco** | `jet-menu-api/v2`, `jet-smart-filters-api/v1`, `croco/v1` |
| **Code Snippets**, **Google Site Kit** | `code-snippets/v1`, `google-site-kit/v1` |
| **WP Travel** (booking/departures) | Departure table w/ Seats, Status, Was-price, Join button |
| Hello Elementor theme (Elementor Hello) | `elementor-hello-elementor/v1` |

---

## 2. Custom post types (REST: `/wp/v2/<name>`)

| CPT | REST base | Notes |
|---|---|---|
| `trekking` | `/wp/v2/trekking` | the site's *Trek* entity |
| `tour` | `/wp/v2/tour` | Tour Packages |
| `destination` | `/wp/v2/destination` | companion to tours (0 posts live) |
| `testimonials` | `/wp/v2/testimonials` | client reviews |
| `faq` | `/wp/v2/faq` | FAQ items |
| `our-team` | `/wp/v2/our-team` | team members |
| `gallery` | `/wp/v2/gallery` | photo galleries (1 live) |
| `legal-document` | `/wp/v2/legal-document` | registrations/affiliation PDFs (1 live) |
| `associated` | `/wp/v2/associated` | association logos |
| `slider-image` | `/wp/v2/slider-image` | hero slider |
| `videos-slider` | `/wp/v2/videos-slider` | videos left slider (1 live) |
| `post` | `/wp/v2/posts` | blog/news |

Elementor internal: `e-floating-buttons`, `elementor_library`, `elementor_snippet`.

---

## 3. Taxonomies & terms

| Taxonomy | Terms (slug) |
|---|---|
| `trekking-types` | Annapurna Region `annapurna-region`, Best Seller Trekking `best-seller-trekking`, Dolpo Region `dolpo-region-trekking`, Everest Region `everest-region`, Kanchenjunga Region `kanchenjunga-region-trekking`, Langtang Region `langtang-region`, Makalu Region `makalu-region-trekking`, Manaslu Region `manaslu-region`, Mustang Region `mustang-region-trekking` |
| `tour-types` | Cultural Tours `cultural-tours-4-tours`, Culture + Nature Tours `culture-nature-tours`, Day Tours `day-tours-in-nepal`, Multi Country `multi-country`, Spiritual Tours `spiritual-tours`, Village Tours `village-tours`, Wildlife Safari Tours `wildlife-safari-tours` |
| `tour-destination` | Bhutan `bhutan`, Nepal `nepal`, Tibet `tibet` |
| `team_type` | Accountant / Manager, Climbing Leaders, Executive Team, IT Manager, Represantative, Tour Guides, Trekking Leaders |
| `gallery-types` | Photos Gallery `photos-gallery` |
| `destination-category` | Bhutan, Nepal, Tibet (unused live) |
| `category` | Blogs `blogs` |

---

## 4. TREKKING / TOUR / DESTINATION meta schema

Single shared JetEngine meta box **"Trekking, Tour and Destination Details"**
is attached to all three CPTs. OCR of the real WP edit screen (post 15355):

| Form label | Meta key | Type | Example value (post 15355) |
|---|---|---|---|
| Price | `price` | number | 2975 |
| Duration | `duration` | text | 19 days |
| Start at | `start_at` | text | Kathmandu |
| Grade | `grade` | text | Challenging |
| Accommodation | `accommodation` | text | Hotel, Teahouse, Camping |
| Max. Altitude | `max_altitude` | text | 6187/20,299ft |
| Best Time | `best_time` | text | March/May , Sep/Nov |
| Meals | `meals_bld` | text | B.L.D |
| Activity | `activity` | text | Trekking/ Climbing & Camping |
| End at | `end_at` | text | Kathmandu |
| Highlight | `highlight` | rich text | bullet list |
| Package Include | `package_include` | rich text | bullets |
| Package Exclude | `package_exclude` | rich text | bullets |
| Equipment & Trekking | `equipment_amp_trekking_gear` | rich text | bullets |
| Gallery | `gallery` | media gallery | images |
| Route Map | `route-map` | media | map image |
| Rating Number | `rate` | number | — |
| Rating out of 5 | `rating` | number | — |

> OCR staggered left/right columns; the two rating keys and the exact
> dash/underscore spelling of `max_altitude` / `best_time` / `meals_bld` /
> `start_at` / `end_at` were reconstructed. Confirm against the live meta box.

### Itinerary — repeater `itinerary_detail` (day-wise)

Nested fields per day:

| Sub-field label | Meta key |
|---|---|
| Heading | `heading-trek` |
| Short Description (Focus line) | `description` |
| Day wise Gallery images | `day_wise_gallery_images` |
| Days wise Starting Point | `days_wise_starting_point` |
| Day wise Ending Point | `day_wise_ending_point` |
| Day wise Distance | `day_wise_distance` |
| Daywise Hour | `daywise_hour` |
| Important Note | `important_note` |

### Altitude chart addon ("Trek Details Page Manager")

Repeater (day-wise) with **Day, Place, Altitude (m), Day Note**
(hint in admin: "use day number to control order. Empty rows are ignored").
Examples: Day 1 / Koto / 1300 / Arrival and trek…

### FlyUp Booking — Group Size Costing meta box

| Form label | Meta key | Type | Example |
|---|---|---|---|
| Duration | `duration` | text | 9 days |
| Regular Price Per Person | `regular_price_per_person` | number | 1299 |
| Group Size Costing | `group_size_costing` | repeater | rows below |

Group costing row (repeater): **No. of Persons / Group Type / Cost Per Person**

| No. of Persons | Group Type | Cost Per Person |
|---|---|---|
| 2-4 Pax | Small Group | 2599 |
| 5-9 Pax | Best Value | 2549 |
| 10+ Pax | Super Group | 2499 |

### Fixed departures (WP Travel style)

Rendered table on homepage/trek pages. Per row:

| Label | Field | Example |
|---|---|---|
| Trip Name | → trek/tour slug | Everest Base Camp |
| Departure Date | `From … To …` text | From 15 Sep To 28 Sep |
| Status | enum | Guaranteed / Available |
| Seats Left | int | 11 Seats Left |
| Price | money | US$ 1,399 |
| Was Price | money (nullable) | Was US$ 1,800 |
| Join this trip | link | — |
| Month filter | `Sep 2026`, `Oct 2026` | — |

---

## 5. Other CPT meta

| CPT | Fields observed on frontend / admin |
|---|---|
| `testimonials` | Title = author; **Name, Country**; content = quote (5/5 aggregate elsewhere) |
| `our-team` | Title = name; subtitle "Dipesh Aryal – Founder & Managing Director"; content = bio; `team_type` taxonomy → role |
| `faq` | Title = question; content = answer |
| `gallery` | Title + `gallery-types` taxonomy + images |
| `legal-document` | Title + featured image + `documentUrl` (PDF) |
| `associated` | Title + image (association logo) |
| `slider-image` | Title + image |
| `videos-slider` | Title + video |
| `post` (blog) | Content, excerpt, `category` = Blogs, featured image |

---

## 6. Global settings (REST `/wp/v2/settings`)

Contact info, logos, brand, social links, etc. (values visible in rendered
homepage: `info@everpeakadventures.com`, `9851093960` WhatsApp/phone,
Payutar Dhara, Kathmandu). Some are Elementor template-wide, not WP options.

---

## 7. Source maps

- Raw index dump: `~/.local/share/opencode/tool-output/tool_feb47493d001d3lpBpEprdmDpb`
- Admin edit-form OCR: `/tmp/ocr_editform.txt`
- Public trek page render: `/tmp/trek_page.txt`