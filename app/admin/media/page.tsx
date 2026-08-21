import { prisma } from "@/lib/prisma";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { Images } from "lucide-react";
import MediaGalleryGrid, { GalleryFile } from "@/app/components/admin/MediaGalleryGrid";
import { IMAGE_SLOTS } from "@/lib/media-slots";

export const dynamic = 'force-dynamic';

function collectUsage() {
  const usage: Record<string, { label: string; type: string }[]> = {};
  const add = (url?: string | null, label?: string, type?: string) => {
    if (!url) return;
    const u = url.trim();
    if (!u) return;
    if (!usage[u]) usage[u] = [];
    usage[u].push({ label: label || 'Unknown', type: type || 'Used' });
  };
  const addList = (urls: string[] | undefined, label?: string, type?: string) => {
    (urls || []).forEach((u) => add(u, label, type));
  };
  const addItineraryGallery = (itinerary: unknown, label?: string) => {
    if (!Array.isArray(itinerary)) return;
    itinerary.forEach((day: unknown, i: number) => {
      if (day && typeof day === 'object' && Array.isArray((day as { gallery?: unknown[] }).gallery)) {
        const d = day as { gallery: string[]; day?: number };
        addList(d.gallery, `${label || ''} · Day ${d.day || i + 1}`, 'Itinerary');
      }
    });
  };
  return { usage, add, addList, addItineraryGallery };
}

export default async function AdminMediaPage() {
  const u = collectUsage();

  const [
    treks, tours, blogs, team, reviews, director, aboutContent,
    heroContents, videoBanners, ctaBanners, welcome, subpageHeroes,
    trustedPartner, legalDocs, site, contentPages,
  ] = await Promise.all([
    prisma.trek.findMany(),
    prisma.tour.findMany(),
    prisma.blogPost.findMany(),
    prisma.teamMember.findMany(),
    prisma.clientReview.findMany(),
    prisma.directorMessageContent.findMany(),
    prisma.aboutPageContent.findMany(),
    prisma.heroContent.findMany(),
    prisma.videoBannerContent.findMany(),
    prisma.ctaBannerContent.findMany(),
    prisma.welcomeContent.findMany(),
    prisma.subpageHero.findMany(),
    prisma.trustedPartnerContent.findMany(),
    prisma.legalDocument.findMany(),
    prisma.siteSettings.findMany(),
    prisma.contentPage.findMany(),
  ]);

  treks.forEach((t) => {
    u.add(t.heroImage, t.title, 'Trek Hero');
    u.addList(t.gallery, t.title, 'Trek Gallery');
    u.add(t.mapImage, t.title, 'Trek Route Map');
    u.addItineraryGallery(t.itinerary, t.title);
  });
  tours.forEach((t) => {
    u.add(t.heroImage, t.title, 'Tour Hero');
    u.addList(t.gallery, t.title, 'Tour Gallery');
    u.add(t.mapImage, t.title, 'Tour Route Map');
    u.addItineraryGallery(t.itinerary, t.title);
  });
  blogs.forEach((b) => u.add(b.image, b.title, 'Blog Cover'));
  team.forEach((m) => u.add(m.image, m.name, 'Team Member'));
  reviews.forEach((r) => u.add(r.avatar, r.name, 'Testimonial Avatar'));
  director.forEach((d) => u.add(d.founderImage, d.founderName, 'Founder'));
  aboutContent.forEach((a) => u.add(a.featuredImage, 'About Page', 'About Featured'));
  heroContents.forEach((h) => u.add(h.heroMediaUrl, 'Home Hero', 'Hero Banner'));
  videoBanners.forEach((v) => u.addList(v.backgroundImages, 'Video/CTA Section', 'Background'));
  ctaBanners.forEach((c) => u.add(c.bgImage, 'CTA Banner', 'Background'));
  welcome.forEach((w) => u.addList(w.carouselImages, 'Welcome Section', 'Carousel'));
  subpageHeroes.forEach((s) => u.add(s.image, s.title, 'Subpage Hero'));
  trustedPartner.forEach((t) => {
    u.add(t.storyImage, 'Trusted Partner', 'Story');
    u.add(t.bgHeroImage, 'Trusted Partner', 'Background');
  });
  legalDocs.forEach((l) => u.add(l.image, l.title, 'Legal Document'));
  site.forEach((s) => {
    u.add(s.logoImage, 'Site', 'Logo');
    u.add(s.footerBgImage, 'Site', 'Footer Background');
  });
  contentPages.forEach((p) => u.add(p.heroImage, p.title, 'Page Hero'));

  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
  const known = new Set(assets.map((a) => a.url));

  const files: GalleryFile[] = assets.map((a) => ({
    id: a.id,
    url: a.url,
    kind: a.kind,
    originalName: a.originalName,
    size: a.size,
    createdAt: a.createdAt ? a.createdAt.toISOString() : null,
    usedIn: u.usage[a.url] || [],
  }));

  // Content-referenced images (e.g. Unsplash heroes, galleries) that are not
  // in the media library yet, so the gallery reflects every image used on the site.
  for (const url of Object.keys(u.usage)) {
    if (!known.has(url)) {
      files.push({
        id: null,
        url,
        kind: 'image',
        originalName: url.split('/').pop() || 'content-image',
        size: null,
        createdAt: null,
        usedIn: u.usage[url] || [],
      });
      known.add(url);
    }
  }

  try {
    const base = path.join(process.cwd(), 'public', 'uploads');
    for (const subdir of ['images', 'videos']) {
      const dir = path.join(base, subdir);
      let entries: string[] = [];
      try {
        entries = await readdir(dir);
      } catch {
        entries = [];
      }
      for (const name of entries) {
        const url = `/uploads/${subdir}/${name}`;
        if (!known.has(url)) {
          files.push({
            id: null,
            url,
            kind: subdir === 'videos' ? 'video' : 'image',
            originalName: name,
            size: null,
            createdAt: null,
            usedIn: u.usage[url] || [],
          });
        }
      }
    }
  } catch {
    // ignore filesystem errors
  }

  const siteSettings = site[0] ?? null;
  const hero = heroContents[0] ?? null;
  const cta = ctaBanners[0] ?? null;
  const about = aboutContent[0] ?? null;
  const dirMsg = director[0] ?? null;
  const trusted = trustedPartner[0] ?? null;

  const slots = IMAGE_SLOTS.map((slot) => {
    let value: string | null = null;
    switch (slot.key) {
      case 'logo': value = siteSettings?.logoImage ?? null; break;
      case 'footerBg': value = siteSettings?.footerBgImage ?? null; break;
      case 'homeHero': value = hero?.heroMediaUrl ?? null; break;
      case 'ctaBg': value = cta?.bgImage ?? null; break;
      case 'aboutFeatured': value = about?.featuredImage ?? null; break;
      case 'founder': value = dirMsg?.founderImage ?? null; break;
      case 'trustedStory': value = trusted?.storyImage ?? null; break;
      case 'trustedHero': value = trusted?.bgHeroImage ?? null; break;
    }
    return { ...slot, value };
  });

  const totalFiles = files.length;
  const usedCount = files.filter((f) => f.usedIn.length > 0).length;

  return (
    <div className="space-y-6 max-w-[1400px] xl:max-w-none mx-auto text-sm">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#112233] uppercase tracking-wide flex items-center gap-3">
            <Images className="w-6 h-6 text-pink-500" /> All Gallery
          </h1>
          <p className="text-gray-500 mt-1">
            Every image and video uploaded through the admin, with where each one is used.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1.5 rounded-full">{totalFiles} files</span>
          <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-full">{usedCount} in use</span>
          <span className="bg-orange-50 text-orange-600 font-bold px-3 py-1.5 rounded-full">{totalFiles - usedCount} unused</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-6xl xl:max-w-none mx-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-[#f8f9fa]">
          <h3 className="font-bold text-[#112233] uppercase tracking-wide">Files</h3>
        </div>
        <MediaGalleryGrid files={files} slots={slots} />
      </div>
    </div>
  );
}