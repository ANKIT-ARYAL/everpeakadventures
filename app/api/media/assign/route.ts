import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/require-admin';
import { prisma } from '@/lib/prisma';
import { IMAGE_SLOTS, type ImageSlotKey } from '@/lib/media-slots';

type SlotTarget = {
  read: () => Promise<string | null>;
  write: (value: string) => Promise<unknown>;
};

const SLOT_TARGETS: Record<ImageSlotKey, SlotTarget> = {
  logo: {
    read: async () => (await prisma.siteSettings.findFirst())?.logoImage ?? null,
    write: (v) => prisma.siteSettings.updateMany({ data: { logoImage: v } }),
  },
  footerBg: {
    read: async () => (await prisma.siteSettings.findFirst())?.footerBgImage ?? null,
    write: (v) => prisma.siteSettings.updateMany({ data: { footerBgImage: v } }),
  },
  homeHero: {
    read: async () => (await prisma.heroContent.findFirst())?.heroMediaUrl ?? null,
    write: (v) => prisma.heroContent.updateMany({ data: { heroMediaUrl: v || null } }),
  },
  ctaBg: {
    read: async () => (await prisma.ctaBannerContent.findFirst())?.bgImage ?? null,
    write: (v) => prisma.ctaBannerContent.updateMany({ data: { bgImage: v } }),
  },
  aboutFeatured: {
    read: async () => (await prisma.aboutPageContent.findFirst())?.featuredImage ?? null,
    write: (v) => prisma.aboutPageContent.updateMany({ data: { featuredImage: v } }),
  },
  founder: {
    read: async () => (await prisma.directorMessageContent.findFirst())?.founderImage ?? null,
    write: (v) => prisma.directorMessageContent.updateMany({ data: { founderImage: v } }),
  },
  trustedStory: {
    read: async () => (await prisma.trustedPartnerContent.findFirst())?.storyImage ?? null,
    write: (v) => prisma.trustedPartnerContent.updateMany({ data: { storyImage: v } }),
  },
  trustedHero: {
    read: async () => (await prisma.trustedPartnerContent.findFirst())?.bgHeroImage ?? null,
    write: (v) => prisma.trustedPartnerContent.updateMany({ data: { bgHeroImage: v } }),
  },
};

export async function POST(request: Request) {
  const unauthorized = await requireAdmin('media', 'edit');
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    if (!url) {
      return NextResponse.json({ success: false, error: 'Missing url' }, { status: 400 });
    }

    const requested = Array.isArray(body.slots)
      ? new Set(body.slots.filter((s: unknown): s is ImageSlotKey => {
          return typeof s === 'string' && Object.prototype.hasOwnProperty.call(SLOT_TARGETS, s);
        }))
      : new Set<ImageSlotKey>();

    let applied = 0;
    const results: { slot: string; action: 'assigned' | 'cleared' | 'unchanged' }[] = [];

    for (const slot of IMAGE_SLOTS) {
      const target = SLOT_TARGETS[slot.key];
      const current = await target.read();
      const desired = requested.has(slot.key);

      if (desired && current !== url) {
        await target.write(url);
        applied++;
        results.push({ slot: slot.key, action: 'assigned' });
      } else if (!desired && current === url) {
        await target.write('');
        applied++;
        results.push({ slot: slot.key, action: 'cleared' });
      } else {
        results.push({ slot: slot.key, action: 'unchanged' });
      }
    }

    return NextResponse.json({ success: true, applied, results });
  } catch (error) {
    console.error('Media assign failed:', error);
    return NextResponse.json({ success: false, error: 'Assign failed' }, { status: 500 });
  }
}