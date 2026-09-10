/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { XMLParser } from 'fast-xml-parser';
// @ts-expect-error - no declaration file
import { unserialize } from 'php-unserialize';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import JSZip from 'jszip';

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const dataType = url.searchParams.get('dataType') || 'trek';
    const mode = url.searchParams.get('mode') || 'append';
    const fileName = url.searchParams.get('fileName') || '';

    let data: Record<string, any>[] = [];
    let localFilePath = '';
    let rawData = '';

    try {
      if (fileName?.toLowerCase().endsWith('.zip')) {
        const arrayBuffer = await request.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        const getCsvData = async (pattern: string) => {
          const candidate = zip.file(new RegExp(pattern, 'i'));
          if (candidate && candidate.length > 0) {
            const content = await candidate[0].async('string');
            return Papa.parse(content, { header: true, skipEmptyLines: true }).data as any[];
          }
          return [];
        };

        const posts = await getCsvData('posts\\.csv$');
        const postmeta = await getCsvData('postmeta\\.csv$');
        const taxonomyTerms = await getCsvData('taxonomy-terms\\.csv$');
        const yoastIndexable = await getCsvData('wpps_yoast_indexable\\.csv$');

        const normalizedType = (dataType || 'all').toLowerCase();
        const allowedTrekTypes = new Set(['trekking', 'trek', 'trip']);
        const allowedTourTypes = new Set(['tour', 'tours']);

        const matchingPosts = posts.filter((p: any) => {
          const postType = String(p.post_type || '').toLowerCase();
          if (normalizedType === 'tour') return allowedTourTypes.has(postType);
          if (normalizedType === 'trek') return allowedTrekTypes.has(postType);
          return allowedTrekTypes.has(postType) || allowedTourTypes.has(postType);
        });

        if (matchingPosts.length === 0) {
          return NextResponse.json({ success: true, message: 'No supported posts found in the zip for the selected import type.' });
        }

        const trekPosts = matchingPosts.filter((p: any) => allowedTrekTypes.has(String(p.post_type || '').toLowerCase()));
        const tourPosts = matchingPosts.filter((p: any) => allowedTourTypes.has(String(p.post_type || '').toLowerCase()));

        const mappedTreks: any[] = [];
        for (const post of trekPosts) {
          const postId = post.ID;

          const meta: Record<string, string> = {};
          postmeta.filter((m: any) => String(m.post_id) === String(postId)).forEach((m: any) => {
            meta[m.meta_key] = m.meta_value;
          });

          const terms = taxonomyTerms.filter((t: any) => String(t.post_id) === String(postId) && (t.taxonomy === 'trekking-types' || t.taxonomy === 'trek-region'));
          const regions = terms.map((t: any) => t.slug);
          const region = regions.length > 0 ? regions[0].replace(/-region$/, '') : (meta['region'] || meta['trip_region'] || 'Nepal');

          const seo = yoastIndexable.find((y: any) => String(y.object_id) === String(postId));

          const title = post.post_title || 'Untitled';
          const slug = post.post_name || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const content = post.post_content || '';
          const excerpt = post.post_excerpt || '';
          const description = excerpt || content.substring(0, 150);

          const salePriceStr = meta['_sale_price'] || meta['sale_price'] || meta['trip_discount_price'] || meta['discount_price'] || '';
          const regPriceStr = meta['_regular_price'] || meta['regular_price'] || meta['trip_price'] || meta['price'] || '0';

          const originalPriceVal = parseFloat(regPriceStr.replace(/[^0-9.]/g, '')) || 0;
          const discPriceVal = salePriceStr ? parseFloat(salePriceStr.replace(/[^0-9.]/g, '')) : null;

          const price = discPriceVal || originalPriceVal;
          const originalPrice = discPriceVal && discPriceVal < originalPriceVal ? originalPriceVal : null;
          const discountedPrice = discPriceVal || null;

          mappedTreks.push({
            id: String(postId),
            slug,
            title,
            description: description.substring(0, 250),
            overview: content,
            heroImage: post.featured_image_url || '',
            gallery: [],
            price,
            originalPrice,
            discountedPrice,
            durationDays: meta['duration'] || meta['trip_duration'] || meta['itinerary_duration'] || '14 Days',
            region,
            regions,
            difficulty: meta['difficulty'] || meta['trip_difficulty'] || 'Moderate',
            maxAltitude: meta['max_altitude'] || meta['altitude'] || meta['trip_altitude'] || '',
            meals: meta['meals'] || meta['trip_meals'] || 'B.B.',
            groupSize: meta['group_size'] || meta['trip_group_size'] || meta['group'] || '',
            bestSeason: meta['best_season'] || meta['season'] || meta['trip_season'] || meta['best-time'] || '',
            accommodation: meta['accommodation'] || meta['trip_accommodation'] || '',
            activity: 'Trekking',
            highlights: meta['highlight'] || '',
            inclusions: meta['package-include'] || meta['package_include'] || '',
            exclusions: meta['package-exclude'] || meta['package_exclude'] || '',
            packingList: meta['equipment_amp_trekking_gears'] || '',
            itinerary: [],
            seoTitle: seo?.title || '',
            metaDescription: seo?.description || '',
            focusKeyphrase: seo?.primary_focus_keyword || ''
          });
        }

        const mappedTours: any[] = [];
        for (const post of tourPosts) {
          const postId = post.ID;

          const meta: Record<string, string> = {};
          postmeta.filter((m: any) => String(m.post_id) === String(postId)).forEach((m: any) => {
            meta[m.meta_key] = m.meta_value;
          });

          const title = post.post_title || 'Untitled';
          const slug = post.post_name || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const content = post.post_content || '';
          const excerpt = post.post_excerpt || '';
          const description = excerpt || content.substring(0, 150);

          const salePriceStr = meta['_sale_price'] || meta['sale_price'] || meta['trip_discount_price'] || meta['discount_price'] || '';
          const regPriceStr = meta['_regular_price'] || meta['regular_price'] || meta['trip_price'] || meta['price'] || '0';
          const originalPriceVal = parseFloat(regPriceStr.replace(/[^0-9.]/g, '')) || 0;
          const discPriceVal = salePriceStr ? parseFloat(salePriceStr.replace(/[^0-9.]/g, '')) : null;
          const price = discPriceVal || originalPriceVal;
          const originalPrice = discPriceVal && discPriceVal < originalPriceVal ? originalPriceVal : null;
          const discountedPrice = discPriceVal || null;

          mappedTours.push({
            id: String(postId),
            slug,
            title,
            description: description.substring(0, 250),
            overview: content,
            heroImage: post.featured_image_url || '',
            gallery: [],
            price,
            originalPrice,
            discountedPrice,
            duration: meta['duration'] || meta['trip_duration'] || meta['itinerary_duration'] || '7 Days',
            bestTime: meta['best_season'] || meta['season'] || meta['trip_season'] || meta['best-time'] || '',
            destination: meta['region'] || meta['trip_region'] || 'Nepal',
            grade: meta['difficulty'] || meta['trip_difficulty'] || 'Easy / Moderate',
            maxAltitude: meta['max_altitude'] || meta['altitude'] || meta['trip_altitude'] || '1,350 m',
            startPoint: meta['start_point'] || 'Kathmandu',
            endPoint: meta['end_point'] || 'Kathmandu',
            meals: meta['meals'] || meta['trip_meals'] || 'B.B.',
            activity: meta['activity'] || 'Sightseeing / Tour',
            groupSize: meta['group_size'] || meta['trip_group_size'] || meta['group'] || '1 - 10',
            highlights: meta['highlight'] || '',
            inclusions: meta['package-include'] || meta['package_include'] || '',
            exclusions: meta['package-exclude'] || meta['package_exclude'] || '',
            packingList: meta['equipment_amp_trekking_gears'] || '',
            itinerary: [],
          });
        }

        await prisma.$transaction(async (tx) => {
          if (mode === 'overwrite') {
            if (normalizedType === 'tour' || normalizedType === 'all') {
              await tx.departure.deleteMany({ where: { tripType: 'tour' } });
              await tx.tour.deleteMany({});
            }
            if (normalizedType === 'trek' || normalizedType === 'all') {
              await tx.departure.deleteMany({ where: { tripType: 'trek' } });
              await tx.trek.deleteMany({});
            }
          }

          if ((normalizedType === 'trek' || normalizedType === 'all') && mappedTreks.length > 0) {
            await tx.trek.createMany({
              data: mappedTreks.map(t => { const { id, ...rest } = t; return rest; }),
              skipDuplicates: true,
            });
          }

          if ((normalizedType === 'tour' || normalizedType === 'all') && mappedTours.length > 0) {
            await tx.tour.createMany({
              data: mappedTours.map(t => { const { id, ...rest } = t; return rest; }),
              skipDuplicates: true,
            });
          }
        }, {
          timeout: 20000,
        });

        const totalImported = (normalizedType === 'trek' ? mappedTreks.length : 0) + (normalizedType === 'tour' ? mappedTours.length : 0) + (normalizedType === 'all' ? mappedTreks.length + mappedTours.length : 0);
        return NextResponse.json({
          success: true,
          message: normalizedType === 'tour'
            ? `Successfully imported ${mappedTours.length} tours from ZIP!`
            : normalizedType === 'trek'
              ? `Successfully imported ${mappedTreks.length} treks from ZIP!`
              : `Successfully imported ${mappedTreks.length} treks and ${mappedTours.length} tours from ZIP!`,
          importedCount: totalImported,
        });
      }

      // If not ZIP, continue with normal read
      if (fileName && fs.existsSync(localFilePath)) {
        console.log(`Reading large file directly from disk: ${localFilePath}`);
        rawData = fs.readFileSync(localFilePath, 'utf-8');
      } else {
        rawData = await request.text();
      }
      if (fileName?.toLowerCase().endsWith('.xml')) {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
          parseTagValue: false,
          processEntities: false,
          ignoreDeclaration: true,
          cdataPropName: "__cdata"
        });
        const xmlObj = parser.parse(rawData);
        const items = xmlObj?.rss?.channel?.item || xmlObj?.data?.item || xmlObj?.items?.item || [];
        data = Array.isArray(items) ? items : [items];
      } else if (fileName?.toLowerCase().endsWith('.csv') || fileName?.toLowerCase().endsWith('.cvs')) {
        const parsed = Papa.parse(rawData, { header: true, skipEmptyLines: true });
        data = parsed.data as Record<string, any>[];
      } else {
        data = JSON.parse(rawData);
      }
    } catch (parseError: any) {
      return NextResponse.json({ success: false, error: `Failed to parse: ${parseError.message}` }, { status: 400 });
    }

    let resultMsg = '';

    await prisma.$transaction(async (tx) => {
      const stripHtml = (html: any) => {
        if (!html || typeof html === 'object') return '';
        let clean = String(html).replace(/ (style|class|id)="[^"]*"/gi, '');
        clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
        return clean.trim();
      };

      const attachmentMap: Record<string, string> = {};
      data.forEach((item) => {
        let type = item['wp:post_type'];
        if (type && typeof type === 'object') type = type.__cdata !== undefined ? type.__cdata : '';
        if (type === 'attachment') {
          let id = item['wp:post_id'];
          let url = item['wp:attachment_url'];
          if (id && typeof id === 'object') id = id.__cdata !== undefined ? id.__cdata : '';
          if (url && typeof url === 'object') url = url.__cdata !== undefined ? url.__cdata : '';
          if (id && url) attachmentMap[String(id)] = url;
        }
      });

      const mapItem = (item: Record<string, any>) => {
        const titleRaw = item.title;
        const title = typeof titleRaw === 'object' ? (titleRaw.__cdata || titleRaw['#text'] || '') : (titleRaw || 'Untitled');
        
        let slugRaw = item['wp:post_name'];
        if (slugRaw && typeof slugRaw === 'object') slugRaw = slugRaw.__cdata !== undefined ? slugRaw.__cdata : '';
        const slug = (typeof slugRaw === 'string' && slugRaw.trim() !== '') ? slugRaw : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        let contentRaw = item['content:encoded'] || item['description'] || '';
        if (contentRaw && typeof contentRaw === 'object') contentRaw = contentRaw.__cdata !== undefined ? contentRaw.__cdata : '';
        const content = stripHtml(contentRaw);
        
        let excerptRaw = item['excerpt:encoded'] || '';
        if (excerptRaw && typeof excerptRaw === 'object') excerptRaw = excerptRaw.__cdata !== undefined ? excerptRaw.__cdata : '';
        const excerpt = stripHtml(excerptRaw);
        
        const meta: Record<string, string> = {};
        if (Array.isArray(item['wp:postmeta'])) {
          item['wp:postmeta'].forEach((m: any) => {
            let key = m['wp:meta_key'];
            let val = m['wp:meta_value'];
            if (key && typeof key === 'object') key = key.__cdata !== undefined ? key.__cdata : '';
            if (val && typeof val === 'object') val = val.__cdata !== undefined ? val.__cdata : '';
            if (key) meta[key] = typeof val === 'string' ? val : String(val || '');
          });
        }
        
        const salePriceStr = meta['_sale_price'] || meta['sale_price'] || meta['trip_discount_price'] || meta['discount_price'];
        const regPriceStr = meta['_regular_price'] || meta['regular_price'] || meta['trip_price'] || meta['price'] || '0';
        
        const originalPriceVal = parseFloat(regPriceStr.replace(/[^0-9.]/g, '')) || 0;
        const discPriceVal = salePriceStr ? parseFloat(salePriceStr.replace(/[^0-9.]/g, '')) : null;
        
        const price = discPriceVal || originalPriceVal;
        const originalPrice = discPriceVal && discPriceVal < originalPriceVal ? originalPriceVal : null;
        const discountedPrice = discPriceVal || null;
        
        const durationStr = meta['duration'] || meta['trip_duration'] || meta['itinerary_duration'] || '14 Days';
        const maxAlt = meta['max_altitude'] || meta['altitude'] || meta['trip_altitude'] || '';
        const diff = meta['difficulty'] || meta['trip_difficulty'] || 'Moderate';
        
        const cats = Array.isArray(item.category) ? item.category : (item.category ? [item.category] : []);
        const regionSlugs = cats.filter((c: any) => c['@_domain'] === 'trekking-types' || c['@_domain'] === 'trek-region')
                               .map((c: any) => String(c['@_nicename'] || c.__cdata?.toLowerCase().replace(/\s+/g, '-')));
        const region = regionSlugs.length > 0 ? regionSlugs[0].replace(/-region$/, '') : (meta['region'] || meta['trip_region'] || 'Nepal');
        const regions = regionSlugs;
        
        const meals = meta['meals'] || meta['trip_meals'] || 'B.B.';
        const groupSize = meta['group_size'] || meta['trip_group_size'] || meta['group'] || '';
        const bestSeason = meta['best_season'] || meta['season'] || meta['trip_season'] || meta['best-time'] || '';
        const accommodation = meta['accommodation'] || meta['trip_accommodation'] || '';
        
        const itinerary: any[] = [];
        
        if (meta['itinerary_detail'] && meta['itinerary_detail'].startsWith('a:')) {
          const detail = meta['itinerary_detail'];
          const headings = [];
          const regexHead = /s:\d+:"heading-trek";s:(\d+):"/g;
          let match;
          while ((match = regexHead.exec(detail)) !== null) {
            const len = parseInt(match[1]);
            const startIdx = match.index + match[0].length;
            headings.push(detail.substring(startIdx, startIdx + len));
          }
          
          const descs = [];
          const regexDesc = /s:\d+:"description";s:(\d+):"/g;
          while ((match = regexDesc.exec(detail)) !== null) {
            const len = parseInt(match[1]);
            const startIdx = match.index + match[0].length;
            descs.push(detail.substring(startIdx, startIdx + len));
          }
          
          for (let i = 0; i < headings.length; i++) {
            const t = headings[i] || '';
            let elev = 0;
            const matchElev = t.match(/\(([\d,]+)\s*m\)/i);
            if (matchElev) elev = parseInt(matchElev[1].replace(/,/g, ''));
            itinerary.push({ day: String(i + 1), title: t, desc: descs[i] || '', elev });
          }
        }
        
        if (itinerary.length === 0) {
          let i = 0;
          while (meta[`itinerary_${i}_title`] || meta[`itinerary_${i}_day`] || meta[`trip_itineraries_${i}_title`]) {
            const t = meta[`itinerary_${i}_title`] || meta[`trip_itineraries_${i}_title`] || `Day ${i + 1}`;
            const d = meta[`itinerary_${i}_description`] || meta[`itinerary_${i}_content`] || meta[`trip_itineraries_${i}_description`] || '';
            let elev = 0;
            const matchElev = t.match(/\(([\d,]+)\s*m\)/i);
            if (matchElev) elev = parseInt(matchElev[1].replace(/,/g, ''));
            itinerary.push({ day: String(i + 1), title: t, desc: d, elev });
            i++;
          }
        }
        
        const thumbId = meta['_thumbnail_id'];
        const heroImage = thumbId && attachmentMap[thumbId] ? attachmentMap[thumbId] : '';
        
        let departures: any[] = [];
        if (meta['_ftb_fixed_departures'] && meta['_ftb_fixed_departures'].startsWith('a:')) {
          try {
            const parsedDeps = unserialize(meta['_ftb_fixed_departures']);
            if (typeof parsedDeps === 'object' && parsedDeps !== null) {
              departures = Object.values(parsedDeps).map((d: any) => ({
                startDate: d.start_date || '',
                endDate: d.end_date || '',
                status: d.status || 'Guaranteed',
                seatsLeft: parseInt(d.seats_left) || 12,
                price: d.price_per_person || '',
              })).filter(d => d.startDate);
            }
          } catch (e) {
             console.error("Failed to parse fixed departures for", title, e);
          }
        }
        
        let groupPrices: any[] = [];
        if (meta['_ftb_costing_rows'] && meta['_ftb_costing_rows'].startsWith('a:')) {
          try {
            const parsed = unserialize(meta['_ftb_costing_rows']);
            if (typeof parsed === 'object' && parsed !== null) {
              groupPrices = Object.values(parsed).map((g: any) => ({
                price: String(g.cost_per_person || ''),
                groupSize: String(g.pax_label || ''),
                description: String(g.group_type || ''),
              })).filter(g => g.price);
            }
          } catch (e) {
             console.error("Failed to parse _ftb_costing_rows for", title, e);
          }
        } else if (meta['group_size_costing_setup'] && meta['group_size_costing_setup'].startsWith('a:')) {
          try {
            const parsed = unserialize(meta['group_size_costing_setup']);
            if (typeof parsed === 'object' && parsed !== null) {
              groupPrices = Object.values(parsed).map((g: any) => ({
                price: String(g.cost_per_person || ''),
                groupSize: String(g.number_prefex || '').replace(/_/g, ' '),
                description: String(g.group_type || '').replace(/_/g, ' '),
              })).filter(g => g.price);
            }
          } catch (e) {
             console.error("Failed to parse group_size_costing_setup for", title, e);
          }
        }
        
        const highlights = meta['highlight'] || '';
        const inclusions = meta['package-include'] || meta['package_include'] || '';
        const exclusions = meta['package-exclude'] || meta['package_exclude'] || '';
        const packingList = meta['equipment_amp_trekking_gears'] || '';
        
        return { 
          title, slug, content, excerpt, price, originalPrice, discountedPrice, 
          durationStr, maxAlt, diff, region, regions, meals, groupSize, bestSeason, 
          accommodation, itinerary: itinerary.length > 0 ? itinerary : null, 
          heroImage, meta, rawItem: item, departures, groupPrices,
          highlights, inclusions, exclusions, packingList
        };
      };

      const getPostType = (item: any) => {
        let type = item['wp:post_type'];
        if (type && typeof type === 'object') type = type.__cdata !== undefined ? type.__cdata : '';
        return typeof type === 'string' ? type.toLowerCase() : '';
      };

      const isValidPost = (item: any) => {
        const type = getPostType(item);
        if (!type) return true; 
        return !['nav_menu_item', 'revision', 'wp_global_styles', 'wp_navigation', 'custom_css', 'customize_changeset', 'oembed_cache', 'user_request', 'wp_block', 'wp_template', 'wp_template_part'].includes(type);
      };

      const importCounts: Record<string, number> = { trek: 0, tour: 0, blog: 0, faq: 0, testimonial: 0, team: 0, page: 0, legal: 0, media: 0 };

      const doImportTrek = async (items: any[]) => {
        if (mode === 'overwrite') {
           await tx.departure.deleteMany({ where: { tripType: 'trek' } });
           await tx.trek.deleteMany({});
        }
        
        const mappedData = items.map((item) => {
          const m = mapItem(item);
          return {
            title: m.title,
            slug: m.slug,
            description: m.excerpt || m.content.substring(0, 150),
            overview: m.content,
            heroImage: m.heroImage, 
            gallery: [],
            durationDays: m.durationStr,
            price: m.price,
            discountedPrice: m.discountedPrice,
            originalPrice: m.originalPrice,
            region: m.region,
            regions: m.regions || [],
            difficulty: m.diff,
            maxAltitude: m.maxAlt,
            startPoint: 'Kathmandu',
            endPoint: 'Kathmandu',
            meals: m.meals,
            groupSize: m.groupSize,
            bestSeason: m.bestSeason,
            accommodation: m.accommodation,
            itinerary: m.itinerary || [],
            activity: 'Trekking',
            highlights: m.highlights,
            inclusions: m.inclusions,
            exclusions: m.exclusions,
            packingList: m.packingList,
          };
        });
        
        const allDepartures: any[] = [];
        const allGroupPrices: any[] = [];
        items.forEach(item => {
           const m = mapItem(item);
           if (m.departures && m.departures.length > 0) {
              m.departures.forEach(dep => {
                 allDepartures.push({ ...dep, tripType: 'trek', trekSlug: m.slug });
              });
           }
           if (m.groupPrices && m.groupPrices.length > 0) {
              m.groupPrices.forEach(gp => {
                 allGroupPrices.push({ ...gp, trekSlug: m.slug });
              });
           }
        });

        try {
          if (mappedData.length > 0) {
            await tx.trek.createMany({ data: mappedData, skipDuplicates: true });
            importCounts.trek += mappedData.length;
            
            if (allDepartures.length > 0 || allGroupPrices.length > 0) {
               // Get inserted treks to map slug to ID
               const slugs = new Set([...allDepartures.map(d => d.trekSlug), ...allGroupPrices.map(g => g.trekSlug)]);
               const insertedTreks = await tx.trek.findMany({
                  where: { slug: { in: Array.from(slugs) } },
                  select: { id: true, slug: true }
               });
               const slugToId: Record<string, string> = {};
               insertedTreks.forEach(t => slugToId[t.slug!] = t.id);
               
               const validDepartures = allDepartures
                 .filter(d => slugToId[d.trekSlug])
                 .map(d => ({
                   tripType: 'trek',
                   trekId: slugToId[d.trekSlug],
                   startDate: new Date(d.startDate),
                   endDate: d.endDate ? new Date(d.endDate) : null,
                   status: d.status,
                   seatsLeft: d.seatsLeft,
                   price: d.price
                 }));
                 
               if (validDepartures.length > 0) {
                 await tx.departure.createMany({ data: validDepartures, skipDuplicates: true });
               }

               const validGroupPrices = allGroupPrices
                 .filter(g => slugToId[g.trekSlug])
                 .map(g => ({
                   trekId: slugToId[g.trekSlug],
                   price: g.price,
                   groupSize: g.groupSize,
                   groupType: g.description
                 }));
               
               if (validGroupPrices.length > 0) {
                 await tx.trekGroupPrice.createMany({ data: validGroupPrices, skipDuplicates: true });
               }
            }
          }
        } catch (err: any) {
          console.error('Trek insert failed:', err.message);
          for (let i = 0; i < mappedData.length; i++) {
             try {
               await tx.trek.create({ data: mappedData[i] });
             } catch (e: any) {
               throw new Error(`Trek import failed at index ${i} (${mappedData[i].title}): ${e.message}`);
             }
          }
          throw err;
        }
      };

      const doImportTour = async (items: any[]) => {
        if (mode === 'overwrite') {
           await tx.departure.deleteMany({ where: { tripType: 'tour' } });
           await tx.tour.deleteMany({});
        }
        
        const mappedData = items.map((item) => {
          const m = mapItem(item);
          return {
            title: m.title,
            slug: m.slug,
            description: m.excerpt || m.content.substring(0, 150),
            overview: m.content,
            heroImage: m.heroImage,
            gallery: [],
            duration: m.durationStr,
            price: m.price,
            discountedPrice: m.discountedPrice,
            originalPrice: m.originalPrice,
            destination: m.region,
            regions: m.regions || [],
            grade: m.diff,
            maxAltitude: m.maxAlt,
            startPoint: 'Kathmandu',
            endPoint: 'Kathmandu',
            meals: m.meals,
            bestTime: m.bestSeason,
            itinerary: m.itinerary || [],
            highlights: m.highlights,
            inclusions: m.inclusions,
            exclusions: m.exclusions,
            packingList: m.packingList,
          };
        });
        
        const allDepartures: any[] = [];
        const allGroupPrices: any[] = [];
        items.forEach(item => {
           const m = mapItem(item);
           if (m.departures && m.departures.length > 0) {
              m.departures.forEach(dep => {
                 allDepartures.push({ ...dep, tripType: 'tour', tourSlug: m.slug });
              });
           }
           if (m.groupPrices && m.groupPrices.length > 0) {
              m.groupPrices.forEach(gp => {
                 allGroupPrices.push({ ...gp, tourSlug: m.slug });
              });
           }
        });

        try {
          if (mappedData.length > 0) {
            await tx.tour.createMany({
              data: mappedData,
              skipDuplicates: true
            });
            importCounts.tour += mappedData.length;
            
            if (allDepartures.length > 0 || allGroupPrices.length > 0) {
               const slugs = new Set([...allDepartures.map(d => d.tourSlug), ...allGroupPrices.map(g => g.tourSlug)]);
               const insertedTours = await tx.tour.findMany({
                  where: { slug: { in: Array.from(slugs) } },
                  select: { id: true, slug: true }
               });
               const slugToId: Record<string, string> = {};
               insertedTours.forEach(t => slugToId[t.slug!] = t.id);
               
               const validDepartures = allDepartures
                 .filter(d => slugToId[d.tourSlug])
                 .map(d => ({
                   tripType: 'tour',
                   tourId: slugToId[d.tourSlug],
                   startDate: new Date(d.startDate),
                   endDate: d.endDate ? new Date(d.endDate) : null,
                   status: d.status,
                   seatsLeft: d.seatsLeft,
                   price: d.price
                 }));
                 
               if (validDepartures.length > 0) {
                 await tx.departure.createMany({ data: validDepartures, skipDuplicates: true });
               }

               const validGroupPrices = allGroupPrices
                 .filter(g => slugToId[g.tourSlug])
                 .map(g => ({
                   tourId: slugToId[g.tourSlug],
                   price: g.price,
                   groupSize: g.groupSize,
                   groupType: g.description
                 }));
               
               if (validGroupPrices.length > 0) {
                 await tx.tourGroupPrice.createMany({ data: validGroupPrices, skipDuplicates: true });
               }
            }
          }
        } catch (err: any) {
          console.error('Tour insert failed:', err.message);
          for (let i = 0; i < mappedData.length; i++) {
             try {
               await tx.tour.create({ data: mappedData[i] });
             } catch (e: any) {
               throw new Error(`Tour import failed at index ${i} (${mappedData[i].title}): ${e.message}`);
             }
          }
          throw err;
        }
      };

      const doImportBlog = async (items: any[]) => {
        if (mode === 'overwrite') await tx.blogPost.deleteMany({});
        const mappedData = items.map((item) => {
          const m = mapItem(item);
          const dateStr = item.pubDate || new Date().toISOString();
          return {
            title: m.title,
            slug: m.slug,
            content: m.content,
            excerpt: m.excerpt || m.content.substring(0, 150),
            image: m.heroImage,
            date: dateStr,
            category: 'Trekking / Hiking',
          };
        });
        if (mappedData.length > 0) {
          const created = await tx.blogPost.createMany({ data: mappedData, skipDuplicates: true });
          importCounts.blog += created.count;
        }
      };

      const doImportFaq = async (items: any[]) => {
        if (mode === 'overwrite') await tx.fAQ.deleteMany({});
        const mappedData = items.map((item) => {
          const m = mapItem(item);
          return {
            question: m.title,
            answer: m.content || m.excerpt,
            relatedType: 'general',
          };
        });
        if (mappedData.length > 0) {
          const created = await tx.fAQ.createMany({ data: mappedData, skipDuplicates: true });
          importCounts.faq = (importCounts.faq || 0) + created.count;
        }
      };

      const doImportTestimonial = async (items: any[]) => {
        if (mode === 'overwrite') await tx.clientReview.deleteMany({});
        const mappedData = items.map((item) => {
          const m = mapItem(item);
          return {
            quote: m.content,
            name: m.title,
            location: m.meta['location'] || '',
            avatar: m.heroImage || '',
          };
        });
        if (mappedData.length > 0) {
          const created = await tx.clientReview.createMany({ data: mappedData, skipDuplicates: true });
          importCounts.testimonial = (importCounts.testimonial || 0) + created.count;
        }
      };

      const doImportTeam = async (items: any[]) => {
        if (mode === 'overwrite') await tx.teamMember.deleteMany({});
        const mappedData = items.map((item) => {
          const m = mapItem(item);
          return {
            name: m.title,
            role: m.meta['role'] || m.meta['position'] || 'Team Member',
            image: m.heroImage || '',
            bio: m.content,
          };
        });
        if (mappedData.length > 0) {
          const created = await tx.teamMember.createMany({ data: mappedData, skipDuplicates: true });
          importCounts.team = (importCounts.team || 0) + created.count;
        }
      };

      const doImportPage = async (items: any[]) => {
        if (mode === 'overwrite') await tx.page.deleteMany({});
        const mappedData = items.map((item) => {
          const m = mapItem(item);
          return {
            title: m.title,
            slug: m.slug,
            subtitle: m.excerpt,
            heroImage: m.heroImage || '',
            content: m.content,
          };
        });
        if (mappedData.length > 0) {
          const created = await tx.page.createMany({ data: mappedData, skipDuplicates: true });
          importCounts.page = (importCounts.page || 0) + created.count;
        }
      };

      const doImportLegal = async (items: any[]) => {
        if (mode === 'overwrite') await tx.legalDocument.deleteMany({});
        const mappedData = items.map((item) => {
          const m = mapItem(item);
          return {
            title: m.title,
            image: m.heroImage || '',
            documentUrl: m.meta['document_url'] || m.meta['pdf_url'] || '',
          };
        });
        if (mappedData.length > 0) {
          const created = await tx.legalDocument.createMany({ data: mappedData, skipDuplicates: true });
          importCounts.legal = (importCounts.legal || 0) + created.count;
        }
      };

      const doImportMedia = async (items: any[]) => {
        if (mode === 'overwrite') await tx.mediaAsset.deleteMany({});
        const mappedData = items.map((item) => {
          let url = item['wp:attachment_url'];
          if (url && typeof url === 'object') url = url.__cdata !== undefined ? url.__cdata : '';
          
          const titleRaw = item.title;
          const originalName = typeof titleRaw === 'object' ? (titleRaw.__cdata || titleRaw['#text'] || '') : (titleRaw || 'Untitled');
          
          return {
            url: url || '',
            originalName: originalName,
            kind: 'image',
          };
        }).filter(m => m.url);
        
        if (mappedData.length > 0) {
          const created = await tx.mediaAsset.createMany({ data: mappedData, skipDuplicates: true });
          importCounts.media = (importCounts.media || 0) + created.count;
        }
      };

      const validItems = data.filter(isValidPost);

      if (dataType === 'all') {
        const treks = validItems.filter(i => {
          const t = getPostType(i);
          return t === 'trek' || t === 'trip' || t === 'itinerary' || t === 'trekking';
        });
        const tours = validItems.filter(i => getPostType(i) === 'tour');
        const blogs = validItems.filter(i => getPostType(i) === 'post');
        const faqs = validItems.filter(i => getPostType(i) === 'faq');
        const testimonials = validItems.filter(i => getPostType(i) === 'testimonials');
        const team = validItems.filter(i => getPostType(i) === 'our-team');
        const pages = validItems.filter(i => getPostType(i) === 'page');
        const legals = validItems.filter(i => getPostType(i) === 'legal-document');
        const media = validItems.filter(i => getPostType(i) === 'attachment');
        
        await doImportTrek(treks);
        await doImportTour(tours);
        await doImportBlog(blogs);
        await doImportFaq(faqs);
        await doImportTestimonial(testimonials);
        await doImportTeam(team);
        await doImportPage(pages);
        await doImportLegal(legals);
        await doImportMedia(media);
        
        resultMsg = `Successfully imported ${importCounts.trek} Treks, ${importCounts.tour} Tours, ${importCounts.blog} Blogs, ${importCounts.faq} FAQs, ${importCounts.testimonial} Reviews, ${importCounts.team} Team, ${importCounts.page} Pages, ${importCounts.legal} Legal docs, and ${importCounts.media} Media items.`;
      } else if (dataType === 'trek') {
        await doImportTrek(validItems);
        resultMsg = `Successfully imported ${importCounts.trek} trekking packages.`;
      } else if (dataType === 'tour') {
        await doImportTour(validItems);
        resultMsg = `Successfully imported ${importCounts.tour} tour packages.`;
      } else if (dataType === 'blog') {
        await doImportBlog(validItems);
        resultMsg = `Successfully imported ${importCounts.blog} blog posts.`;
      } else if (dataType === 'faq') {
        await doImportFaq(validItems);
        resultMsg = `Successfully imported ${importCounts.faq} FAQs.`;
      } else if (dataType === 'media') {
        await doImportMedia(validItems);
        resultMsg = `Successfully imported ${importCounts.media} media items.`;
      }
    });

    return NextResponse.json({ success: true, message: resultMsg });
  } catch (error: unknown) {
    console.error('Import error:', error);
    if (error instanceof Error) {
      // Prisma errors usually have a message property
      return NextResponse.json({ success: false, error: `Schema mismatch or import failed: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'Unknown error occurred during import.' }, { status: 500 });
  }
}
