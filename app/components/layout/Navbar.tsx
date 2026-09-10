import { prisma } from "@/lib/prisma";

import NavbarClient from "./NavbarClient";

import { unstable_cache } from "next/cache";

function getIconForCategory(name: string, slug: string): string {
  const s = (name + " " + slug).toLowerCase();

  if (s.includes("everest") || s.includes("mountain") || s.includes("makalu"))
    return "Mountain";

  if (s.includes("annapurna") || s.includes("map") || s.includes("bhutan"))
    return "Map";

  if (s.includes("langtang") || s.includes("compass") || s.includes("dolpo"))
    return "Compass";

  if (
    s.includes("manaslu") ||
    s.includes("navigation") ||
    s.includes("kanchenjunga")
  )
    return "Navigation";

  if (s.includes("mustang") || s.includes("tent") || s.includes("tibet"))
    return "Tent";

  if (s.includes("beaten") || s.includes("footprint")) return "Footprints";

  if (s.includes("family") || s.includes("user")) return "Users";

  if (s.includes("short") || s.includes("easy") || s.includes("sun"))
    return "Sun";

  if (s.includes("tour") || s.includes("nepal")) return "Mountain";

  return "Mountain";
}

function normalizeActivityFilter(value: string | null | undefined) {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchesActivityFilter(activity: string | null | undefined, filter: string) {
  const normalizedFilter = normalizeActivityFilter(filter);

  if (!normalizedFilter) return false;

  const candidates = (activity ?? "")
    .split(/[,/]/)
    .map((part) => normalizeActivityFilter(part))
    .filter(Boolean);

  const GENERIC = new Set(['tour', 'tours', 'trek', 'treks', 'trip', 'trips', 'day']);

  return candidates.some((candidate) => {
    if (!candidate) return false;
    if (candidate === normalizedFilter) return true;

    // Avoid matching generic tokens (e.g. 'tour') against specific filters like 'helicopter-tour'
    if (GENERIC.has(candidate) || GENERIC.has(normalizedFilter)) return false;

    return candidate.includes(normalizedFilter) || normalizedFilter.includes(candidate);
  });
}

const getNavbarData = unstable_cache(
  async () => {
    const settings = await prisma.siteSettings.findFirst();

    // Fetch all published treks

    const allTreksRaw = await prisma.trek.findMany({
      where: { published: true },
      select: {
        title: true,
        slug: true,
        durationDays: true,
        regions: true,
        region: true,
        heroImage: true,
        difficulty: true,
        activity: true,
        price: true,
        discountedPrice: true,
        groupPrices: true,
      },
      orderBy: { order: "asc" },
    });

    const allTreksMap = new Map();
    for (const t of allTreksRaw) {
      if (!allTreksMap.has(t.slug)) {
        allTreksMap.set(t.slug, t);
      }
    }
    const allTreks = Array.from(allTreksMap.values());

    // Fetch all published tours

    const allToursRaw = await prisma.tour.findMany({
      where: { published: true },
      select: {
        title: true,
        slug: true,
        duration: true,
        destination: true,
        primaryDestination: true,
        heroImage: true,
        price: true,
        discountedPrice: true,
        groupPrices: true,
        activity: true,
        regions: true,
      },
      orderBy: { order: "asc" },
    });

    const allToursMap = new Map();
    for (const t of allToursRaw) {
      if (!allToursMap.has(t.slug)) {
        allToursMap.set(t.slug, t);
      }
    }
    const allTours = Array.from(allToursMap.values());

    const parsePrice = (val: string | undefined | null) => {
      if (!val) return 0;

      const num = parseFloat(val.replace(/[^0-9.]/g, ""));

      return isNaN(num) ? 0 : num;
    };

    const getMinPrice = (item: any) => {
      let minPrice = item.discountedPrice ?? item.price;

      if (item.groupPrices && item.groupPrices.length > 0) {
        const prices = item.groupPrices
          .map((gp: any) => parsePrice(gp.price))
          .filter((p: number) => p > 0);

        if (prices.length > 0) {
          minPrice = Math.min(...prices);
        }
      }

      return minPrice;
    };

    // 1. NEPAL MEGA MENU (derived from admin Activities)

    const publishedActivities = await prisma.activity.findMany({
      where: { published: true },
      orderBy: { title: 'asc' },
      select: { title: true, slug: true },
    });

    // Keep the two umbrella tabs first, then append activities from the admin panel.
    const nepalActivities = [
      { name: "Trekking in Nepal", type: "trek", filter: "all-trekking" },
      { name: "Tours in Nepal", type: "tour", filter: "all-tours" },
      // dynamic activities from admin (will match both tours and treks)
      ...publishedActivities.map((a) => ({ name: a.title, filter: a.slug })),
    ];

    const nepalTabs = nepalActivities.map((act) => {
      let items: any[] = [];

      if (act.filter === "all-trekking") {
        items = allTreks
          .filter(
            (t) =>
              !t.title.toLowerCase().includes("bhutan") &&
              !t.title.toLowerCase().includes("tibet"),
          )
          .slice(0, 10)
          .map((t) => ({ ...t, _type: 'trek' }));
      } else if (act.filter === "all-tours") {
        items = allTours
          .filter(
            (t) =>
              (t.destination || "").toLowerCase().includes("nepal") ||
              (t.primaryDestination || "").toLowerCase().includes("nepal"),
          )
          .slice(0, 10)
          .map((t) => ({ ...t, _type: 'tour' }));
      } else {
        const matchedTours = allTours.filter((t) => matchesActivityFilter(t.activity, act.filter)).map((t) => ({ ...t, _type: 'tour' }));
        const matchedTreks = allTreks.filter((t) => matchesActivityFilter(t.activity, act.filter)).map((t) => ({ ...t, _type: 'trek' }));

        // Combine tours first then treks, keep original ordering and limit to 10
        items = [...matchedTours, ...matchedTreks].slice(0, 10);
      }

      return {
        name: act.name,

        slug: act.filter,

        href:
          act.filter === "all-trekking"
            ? "/trekking"
            : act.filter === "all-tours"
              ? "/tour-destination/nepal"
              : `/activities/${act.filter}`,

        items: items.map((t) => ({
          title: t.title,

          slug: t.slug,

          durationDays: (t as any).durationDays || (t as any).duration,

          heroImage: t.heroImage,

          lowestPrice: getMinPrice(t),

          type: t._type === 'trek' ? 'trek' : 'tour',
        })),
      };
    });

    // 2. NEPAL TREKKING (Dynamic Categories)

    const targetTrekRegions = await prisma.trekCategory.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true },
    });

    const nepalTrekkingTabs = targetTrekRegions.map((region) => {
      const cleanSlug = region.slug.toLowerCase();

      const matchedTreks = allTreks
        .filter((t) => {
          if (cleanSlug === 'all-trekking-packages' || region.name.toLowerCase().includes('all trekking')) {
            return true;
          }

          const inRegions =
            t.regions &&
            t.regions.some(
              (r: string) =>
                r.toLowerCase().includes(cleanSlug) ||
                r.toLowerCase().includes(region.name.toLowerCase()),
            );

          const inRegion =
            t.region &&
            (t.region.toLowerCase().includes(cleanSlug) ||
              t.region.toLowerCase().includes(region.name.toLowerCase()));

          return inRegions || inRegion;
        })
        .slice(0, 10);

      // NO FALLBACK

      return {
        name: region.name,

        slug: region.slug,

        href: `/trekking-types/${region.slug}-region-trekking`,

        iconName: getIconForCategory(region.name, region.slug),

        treks: matchedTreks.map((t) => ({
          ...t,

          lowestPrice: getMinPrice(t),
        })),
      };
    });

    // 3. TOURS IN NEPAL

    const targetTourCategories = [
      { name: "Nepal Classic Tour", slug: "nepal-classic-tour" },

      {
        name: "Nepal Heritage & Wildlife Tour",
        slug: "nepal-heritage-wildlife-tour",
      },

      { name: "Nepal Honeymoon Tour", slug: "nepal-honeymoon-tour" },

      { name: "Kathmandu City Tour", slug: "kathmandu-city-tour" },

      { name: "Kathmandu & Lumbini Tour", slug: "kathmandu-lumbini-tour" },

      { name: "Pokhara & Nagarkot Tour", slug: "pokhara-nagarkot-tour" },

      { name: "Nagarkot Sunrise Tour", slug: "nagarkot-sunrise-tour" },
    ];

    const nepalToursTabs = targetTourCategories.map((cat) => {
      const cleanSlug = cat.slug.toLowerCase();

      const matchedTours = allTours
        .filter((t) => {
          // Match if the tour has this category checked in its regions array

          return (
            t.regions &&
            t.regions.some(
              (r: string) =>
                r.toLowerCase().includes(cleanSlug) ||
                r.toLowerCase().includes(cat.name.toLowerCase()),
            )
          );
        })
        .slice(0, 10);

      return {
        name: cat.name,

        slug: cat.slug,

        href: `/tour-category/${cat.slug}`, // Assuming a generic category route if needed

        tours: matchedTours.map((t) => ({
          ...t,

          lowestPrice: getMinPrice(t),

          durationDays: t.duration,
        })),
      };
    });

    // 4. TIBET & BHUTAN (2 Tabs)

    const tibetBhutanTabs = [
      { name: "Tibet Tours", slug: "tibet", dest: "tibet" },

      { name: "Bhutan Tours", slug: "bhutan", dest: "bhutan" },
    ];

    const tibetBhutanMenu = tibetBhutanTabs.map((tab) => {
      const items = allTours
        .filter(
          (t) =>
            (t.destination || "").toLowerCase().includes(tab.dest) ||
            (t.primaryDestination || "").toLowerCase().includes(tab.dest),
        )
        .slice(0, 10);

      // NO FALLBACK

      return {
        name: tab.name,

        slug: tab.slug,

        href: `/tour-destination/${tab.dest}`,

        items: items.map((t) => ({
          title: t.title,

          slug: t.slug,

          durationDays: t.duration,

          heroImage: t.heroImage,

          lowestPrice: getMinPrice(t),
        })),
      };
    });

    return {
      settings,

      nepalTabs,

      nepalTrekkingTabs,

      nepalToursTabs,

      tibetBhutanMenu,
    };
  },

  ["navbar-data"],

  { revalidate: 3600, tags: ["treks", "tours", "settings", "activities"] },
);

export default async function Navbar() {
  const {
    settings,
    nepalTabs,
    nepalTrekkingTabs,
    nepalToursTabs,
    tibetBhutanMenu,
  } = await getNavbarData();

  return (
    <NavbarClient
      nepalTabs={nepalTabs}
      nepalTrekkingTabs={nepalTrekkingTabs}
      nepalToursTabs={nepalToursTabs}
      tibetBhutanMenu={tibetBhutanMenu}
      logoImage={settings?.logoImage ?? undefined}
      settings={settings}
    />
  );
}
