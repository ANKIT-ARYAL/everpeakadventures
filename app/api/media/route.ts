import { NextResponse } from 'next/server';
import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { requireAdmin } from "@/app/lib/require-admin";
import { prisma } from '@/lib/prisma';

async function collectContentImages() {
  const urls = new Set<string>();
  const add = (val: string | null | undefined | string[]) => {
    if (!val) return;
    if (Array.isArray(val)) val.forEach(v => v && urls.add(v));
    else if (typeof val === 'string' && val) urls.add(val);
  };

  const [
    treks,
    tours,
    blogs,
    reviews,
    team,
    directorMsg,
    aboutPage,
    welcomeContent,
    videoBanners,
    ctaBanners,
    trustedPartner,
    siteSettings,
  ] = await Promise.all([
    prisma.trek.findMany({ select: { heroImage: true, gallery: true, mapImage: true } }),
    prisma.tour.findMany({ select: { heroImage: true, gallery: true, mapImage: true } }),
    prisma.blogPost.findMany({ select: { image: true } }),
    prisma.clientReview.findMany({ select: { avatar: true } }),
    prisma.teamMember.findMany({ select: { image: true } }),
    prisma.directorMessageContent.findMany({ select: { founderImage: true } }),
    prisma.aboutPageContent.findMany({ select: { featuredImage: true } }),
    prisma.welcomeContent.findMany({ select: { carouselImages: true } }),
    prisma.videoBannerContent.findMany({ select: { backgroundImages: true } }),
    prisma.ctaBannerContent.findMany({ select: { bgImage: true } }),
    prisma.trustedPartnerContent.findMany({ select: { storyImage: true, bgHeroImage: true } }),
    prisma.siteSettings.findMany({ select: { logoImage: true, footerBgImage: true } }),
  ]);

  treks.forEach(t => { add(t.heroImage); add(t.gallery); add(t.mapImage); });
  tours.forEach(t => { add(t.heroImage); add(t.gallery); add(t.mapImage); });
  blogs.forEach(b => add(b.image));
  reviews.forEach(r => add(r.avatar));
  team.forEach(m => add(m.image));
  directorMsg.forEach(d => add(d.founderImage));
  aboutPage.forEach(a => add(a.featuredImage));
  welcomeContent.forEach(w => add(w.carouselImages));
  videoBanners.forEach(v => add(v.backgroundImages));
  ctaBanners.forEach(c => add(c.bgImage));
  trustedPartner.forEach(t => { add(t.storyImage); add(t.bgHeroImage); });
  siteSettings.forEach(s => { add(s.logoImage); add(s.footerBgImage); });

  return urls;
}

interface MediaFile {
  url: string;
  kind: string;
  originalName: string | null;
  size: number | null;
  createdAt: Date | string | null;
  source?: string;
}

export async function GET() {
  const unauthorized = await requireAdmin("media", "view");
  if (unauthorized) return unauthorized;

  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
  const known = new Set(assets.map((a) => a.url));

  // Collect all images used in content across the app
  const contentImageUrls = await collectContentImages();
  contentImageUrls.forEach(u => known.add(u));

  const files: MediaFile[] = assets.map((a) => ({
    url: a.url,
    kind: a.kind,
    originalName: a.originalName,
    size: a.size,
    createdAt: a.createdAt,
  }));

  // Add content images not already in MediaAsset
  for (const url of contentImageUrls) {
    if (!assets.some(a => a.url === url)) {
      files.push({
        url,
        kind: 'image',
        originalName: url.split('/').pop() || 'content-image',
        size: null,
        createdAt: null,
        source: 'content',
      });
    }
  }

  // List files already on disk that predate the media library
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
            url,
            kind: subdir === 'videos' ? 'video' : 'image',
            originalName: name,
            size: null,
            createdAt: null,
          });
        }
      }
    }
  } catch {
    // ignore filesystem errors
  }

  return NextResponse.json({ success: true, files });
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function deleteFileFromDisk(url?: string | null) {
  if (!url || !url.startsWith('/uploads')) return;
  try {
    await unlink(path.join(PUBLIC_DIR, url));
  } catch {
    // file already gone or not on disk
  }
}

// Delete by URL, used for legacy files that only exist on disk (no DB record).
export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin('media', 'delete');
  if (unauthorized) return unauthorized;

  try {
    const { url } = await request.json().catch(() => ({}));
    if (typeof url !== 'string' || !url) {
      return NextResponse.json({ success: false, error: 'Missing url' }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.findFirst({ where: { url } });
    if (asset) {
      await deleteFileFromDisk(asset.url);
      await prisma.mediaAsset.delete({ where: { id: asset.id } });
    } else {
      await deleteFileFromDisk(url);
    }

    return NextResponse.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Media delete failed:', error);
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}