import { prisma } from './lib/prisma';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const exportPath = '/Users/ankitaryal/everpeakadventures/import-data/flyup-trekking-all-selected-export-20260909-110831';

// ─── HTML Sanitizer ─────────────────────────────────────────────────────────
// Strips all class, data-*, style, role attributes from HTML tags
// that come from AI-generated / copied Google content.
function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    // Remove attributes that cause layout pollution
    .replace(/\s+(class|data-[a-z-]+|style|role|aria-[a-z-]+|id|dir|data-copy-service-computed-style|data-sfc-root|data-sfc-cp|data-complete|data-processed|data-sfc-inited|data-wiz-uids|data-ved|data-hveid|data-xid|data-asrc|data-turn-id-container|data-is-intersecting|data-streaming-container|data-subtree|data-animation-nesting|data-wiz-attrbind|data-sae|data-ctx-provider|data-tr-rsts|data-start|data-end|data-anchor|data-copy-\w+)="[^"]*"/gi, '')
    // Remove empty class attributes
    .replace(/\s+class=""/gi, '')
    // Remove Google-specific wrapper divs but keep content
    .replace(/<div[^>]*class="[^"]*qJYHHd[^"]*"[^>]*>/gi, '<div>')
    .replace(/<div[^>]*class="[^"]*qMYqUG[^"]*"[^>]*>/gi, '<div>')
    // Remove script and style tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove TgQPHd comments
    .replace(/<!--TgQPHd\|.*?-->/g, '')
    // Remove empty divs and spans
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── PHP Serialized Itinerary Parser ────────────────────────────────────────
function parsePhpItinerary(serialized: string): any[] {
  if (!serialized || !serialized.startsWith('a:')) return [];
  const itinerary: any[] = [];
  
  // Match item keys like item-0, item-1, etc.
  const itemPattern = /s:\d+:"item-(\d+)";a:\d+:\{([\s\S]*?)(?=s:\d+:"item-|$)/g;
  let itemMatch;
  let dayIndex = 0;

  // Parse heading-trek
  const headingRegex = /s:\d+:"heading-trek";s:(\d+):"([\s\S]*?)"/g;
  const descRegex = /s:\d+:"description";s:(\d+):"([\s\S]*?)"/g;
  const galleryRegex = /s:\d+:"day_wise_gallery_images";s:(\d+):"([\s\S]*?)"/g;
  const startPointRegex = /s:\d+:"days_wise_starting_point";s:(\d+):"([\s\S]*?)"/g;
  const endPointRegex = /s:\d+:"day_wise_ending_point";s:(\d+):"([\s\S]*?)"/g;
  const distanceRegex = /s:\d+:"day_wise_distance";s:(\d+):"([\s\S]*?)"/g;
  const hoursRegex = /s:\d+:"daywise_hour";s:(\d+):"([\s\S]*?)"/g;
  const noteRegex = /s:\d+:"important_note";s:(\d+):"([\s\S]*?)"/g;

  // Simpler approach: parse all headings in order
  const allHeadings: string[] = [];
  const allDescs: string[] = [];
  const allStartPoints: string[] = [];
  const allEndPoints: string[] = [];
  const allDistances: string[] = [];
  const allHours: string[] = [];
  const allNotes: string[] = [];
  const allGalleries: string[] = [];

  let m: RegExpExecArray | null;

  // Reset and find by item number ordering
  // Find all item blocks ordered by item-N
  const allItems: Record<number, string> = {};
  const blockRegex = /"item-(\d+)";a:\d+:\{([\s\S]*?)(?="item-\d+"|$)/g;
  while ((m = blockRegex.exec(serialized)) !== null) {
    allItems[parseInt(m[1])] = m[2];
  }

  const sortedKeys = Object.keys(allItems).map(Number).sort((a, b) => a - b);

  for (const key of sortedKeys) {
    const block = allItems[key];
    
    const h = /"heading-trek";s:\d+:"([^"]*)"/.exec(block);
    const d = /"description";s:\d+:"([^"]*)"/.exec(block);
    const sp = /"days_wise_starting_point";s:\d+:"([^"]*)"/.exec(block);
    const ep = /"day_wise_ending_point";s:\d+:"([^"]*)"/.exec(block);
    const dist = /"day_wise_distance";s:\d+:"([^"]*)"/.exec(block);
    const hr = /"daywise_hour";s:\d+:"([^"]*)"/.exec(block);
    const note = /"important_note";s:\d+:"([^"]*)"/.exec(block);
    const gal = /"day_wise_gallery_images";s:\d+:"([^"]*)"/.exec(block);

    const title = h ? h[1] : `Day ${key + 1}`;
    const desc = d ? sanitizeHtml(d[1]) : '';
    const galleryHtml = gal ? sanitizeHtml(gal[1]) : '';
    
    // Extract elevation from title like "Day 1: Trek to Namche (3440m)"
    let elev = 0;
    const elevMatch = title.match(/\((\d[\d,]*)\s*m\)/i);
    if (elevMatch) elev = parseInt(elevMatch[1].replace(/,/g, ''));

    itinerary.push({
      day: key + 1,
      title: title.trim(),
      desc: desc || galleryHtml || '',
      elev,
      startPoint: sp ? sp[1].trim() : '',
      endPoint: ep ? ep[1].trim() : '',
      distance: dist ? dist[1].trim() : '',
      hours: hr ? hr[1].trim() : '',
      note: note ? note[1].trim() : '',
    });
  }

  return itinerary;
}

// ─── Group Pricing Parser ────────────────────────────────────────────────────
function parseGroupPricing(serialized: string): any[] {
  if (!serialized || !serialized.startsWith('a:')) return [];
  const prices: any[] = [];

  // Match cost rows
  const rowRegex = /\{s:\d+:"pax_label";s:\d+:"([^"]*)";s:\d+:"group_type";s:\d+:"([^"]*)";s:\d+:"cost_per_person";s:\d+:"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = rowRegex.exec(serialized)) !== null) {
    if (m[3]) {
      prices.push({ groupSize: m[1], groupType: m[2], price: m[3] });
    }
  }
  return prices;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Starting Trekking Data Import (Full Overwrite with correct field mapping)...');

  const parseCSV = (fileName: string) => {
    const filePath = path.join(exportPath, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const result = Papa.parse(raw, { header: true, skipEmptyLines: true });
    return result.data as any[];
  };

  const posts = parseCSV('posts.csv');
  const postmeta = parseCSV('postmeta.csv');
  const taxonomyTerms = parseCSV('taxonomy-terms.csv');

  console.log(`Parsed ${posts.length} posts, ${postmeta.length} postmeta, ${taxonomyTerms.length} taxonomy terms.`);

  // Only trekking posts
  const trekkingPosts = posts.filter(p =>
    p.post_type === 'trekking' || p.post_type === 'trek' || p.post_type === 'trip'
  );

  if (trekkingPosts.length === 0) {
    console.log('No trekking posts found in posts.csv');
    return;
  }

  console.log(`Found ${trekkingPosts.length} trekking posts. Overwriting all existing treks...`);
  
  // Full overwrite — delete group prices and departures first (cascade)
  await prisma.trekGroupPrice.deleteMany({});
  await prisma.departure.deleteMany({ where: { tripType: 'trek' } });
  await prisma.trek.deleteMany({});
  console.log('Deleted all existing Trek records.');

  const mappedTreks: any[] = [];
  const allGroupPrices: any[] = [];
  const allDepartures: any[] = [];

  for (const post of trekkingPosts) {
    const postId = String(post.ID);

    // ── Build meta map ──────────────────────────────────────────────────────
    const meta: Record<string, string> = {};
    for (const m of postmeta) {
      if (String(m.post_id) === postId) {
        meta[m.meta_key] = m.meta_value;
      }
    }

    // ── Taxonomies / categories ─────────────────────────────────────────────
    const terms = taxonomyTerms.filter(t =>
      String(t.post_id) === postId &&
      (t.taxonomy === 'trekking-types' || t.taxonomy === 'trek-region')
    );
    const regions = terms.map(t => t.slug).filter(Boolean);
    const region = regions.length > 0
      ? regions[0].replace(/-region$/, '')
      : (meta['destination'] || 'Nepal');

    // ── Core fields ─────────────────────────────────────────────────────────
    const title = post.post_title || 'Untitled';
    const slug = post.post_name || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Overview: sanitize the Google AI HTML from post_content
    const rawContent = post.post_content || '';
    const overview = sanitizeHtml(rawContent);

    // Description: prefer stripped highlight text, then empty string — do NOT
    // fall back to overview which can contain medication/trail-condition noise
    const highlightRaw = meta['highlight'] || '';
    const highlightStripped = highlightRaw
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const shortDesc = highlightStripped.substring(0, 250);

    // ── Pricing ─────────────────────────────────────────────────────────────
    const priceRaw = meta['price'] || meta['_ftb_regular_price'] || '0';
    const price = parseFloat(priceRaw.replace(/[^0-9.]/g, '')) || 0;

    // ── Quick facts with CORRECT meta keys ──────────────────────────────────
    const durationDays = meta['duration'] || meta['_ftb_duration'] || '';
    const maxAltitude = meta['max-altitude'] || meta['max_altitude'] || '';
    const difficulty = (meta['trekking-grade'] || meta['difficulty'] || 'Moderate').trim();
    const meals = meta['meals-bld'] || meta['meals'] || 'B, L, D';
    const bestSeason = meta['best-time'] || meta['best_season'] || '';
    const accommodation = meta['accommodation'] || '';
    const activity = meta['activity'] || 'Trekking';
    const startPoint = meta['start_at'] || 'Kathmandu';
    const endPoint = meta['end_at'] || 'Kathmandu';
    const rateVal = meta['rate'] ? parseFloat(meta['rate']) : null;
    const heroImage = post.featured_image_url || '';

    // Gallery: stored as comma-separated attachment IDs (no URLs available from CSV)
    // We leave empty — user can add later via admin
    const gallery: string[] = [];

    // ── Highlights, Inclusions, Exclusions ──────────────────────────────────
    const highlights = sanitizeHtml(meta['highlight'] || '');
    const inclusions = sanitizeHtml(meta['package_include'] || meta['package-include'] || '');
    const exclusions = sanitizeHtml(meta['package_exclude'] || meta['package-exclude'] || '');
    const packingList = sanitizeHtml(meta['equipment_amp_trekking_gears'] || '');

    // ── SEO Fields (correct Flyup SEO keys) ─────────────────────────────────
    const seoTitle = meta['_flyup_seo_title'] || '';
    const metaDescription = meta['_flyup_seo_description'] || '';
    const focusKeyphrase = meta['_flyup_seo_focus_keyphrase'] || '';

    // ── Itinerary from PHP serialized ────────────────────────────────────────
    const itinerary = parsePhpItinerary(meta['itinerary_detail'] || '');

    // ── Group Pricing ────────────────────────────────────────────────────────
    const groupPricesRaw = parseGroupPricing(meta['_ftb_costing_rows'] || '');
    if (groupPricesRaw.length > 0) {
      for (const gp of groupPricesRaw) {
        allGroupPrices.push({ ...gp, trekSlug: slug });
      }
    }

    mappedTreks.push({
      slug,
      title,
      description: shortDesc,
      overview,
      heroImage,
      gallery,
      price,
      originalPrice: null,
      discountedPrice: null,
      durationDays,
      region,
      regions,
      difficulty,
      maxAltitude,
      meals,
      bestSeason,
      accommodation,
      activity,
      startPoint,
      endPoint,
      rate: rateVal,
      groupSize: '',
      highlights,
      inclusions,
      exclusions,
      packingList,
      itinerary,
      seoTitle,
      metaDescription,
      focusKeyphrase,
    });
  }

  // ── Insert Treks ─────────────────────────────────────────────────────────
  console.log(`Inserting ${mappedTreks.length} treks...`);
  await prisma.trek.createMany({ data: mappedTreks, skipDuplicates: true });
  console.log('Treks inserted.');

  // ── Insert Group Prices ──────────────────────────────────────────────────
  if (allGroupPrices.length > 0) {
    const slugSet = new Set(allGroupPrices.map(g => g.trekSlug));
    const insertedTreks = await prisma.trek.findMany({
      where: { slug: { in: Array.from(slugSet) as string[] } },
      select: { id: true, slug: true },
    });
    const slugToId: Record<string, string> = {};
    for (const t of insertedTreks) {
      if (t.slug) slugToId[t.slug] = t.id;
    }

    const gpData = allGroupPrices
      .filter(g => slugToId[g.trekSlug])
      .map(g => ({
        trekId: slugToId[g.trekSlug],
        groupSize: g.groupSize,
        groupType: g.groupType,
        price: g.price,
      }));

    if (gpData.length > 0) {
      await prisma.trekGroupPrice.createMany({ data: gpData, skipDuplicates: true });
      console.log(`Inserted ${gpData.length} group price rows.`);
    }
  }

  console.log('\n✅ Import complete!');
  console.log(`  - ${mappedTreks.length} Treks`);
  console.log(`  - ${allGroupPrices.length} Group Price rows`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
