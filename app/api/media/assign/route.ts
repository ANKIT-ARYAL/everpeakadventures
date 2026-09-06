import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/require-admin';
import { prisma } from '@/lib/prisma';
import { STATIC_IMAGE_SLOTS, type ImageSlotKey } from '@/lib/media-slots';

type SlotTarget = {
  read: () => Promise<string | null>;
  write: (value: string) => Promise<unknown>;
};

const STATIC_SLOT_TARGETS: Record<string, SlotTarget> = {
  logo: {
    read: async () => (await prisma.siteSettings.findFirst())?.logoImage ?? null,
    write: (v) => prisma.siteSettings.updateMany({ data: { logoImage: v } }),
  },
  footerBg: {
    read: async () => (await prisma.siteSettings.findFirst())?.footerBgImage ?? null,
    write: (v) => prisma.siteSettings.updateMany({ data: { footerBgImage: v } }),
  },
  loginHero: {
    read: async () => (await prisma.siteSettings.findFirst())?.loginHeroImage ?? null,
    write: (v) => prisma.siteSettings.updateMany({ data: { loginHeroImage: v } }),
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
  bookingHero: {
    read: async () => (await prisma.subpageHero.findFirst({ where: { slug: 'booking-form' } }))?.image ?? null,
    write: async (v) => {
      const existing = await prisma.subpageHero.findFirst({ where: { slug: 'booking-form' } });
      if (existing) {
        return prisma.subpageHero.update({ where: { id: existing.id }, data: { image: v } });
      } else {
        return prisma.subpageHero.create({
          data: {
            slug: 'booking-form',
            title: 'Book Your Adventure',
            subtitle: 'Ready for the Himalayas? Fill out the form below to request a booking or customize your trip.',
            image: v,
            published: true,
          }
        });
      }
    }
  },
};

// Helper function to dynamically resolve read/write functions for a given slot key
function getTargetForSlot(slot: string): SlotTarget | null {
  if (STATIC_SLOT_TARGETS[slot]) {
    return STATIC_SLOT_TARGETS[slot];
  }
  
  const [model, id] = slot.split(':');
  if (!model || !id) return null;

  switch (model) {
    case 'subpageHero':
      return {
        read: async () => (await prisma.subpageHero.findUnique({ where: { id } }))?.image ?? null,
        write: (v) => prisma.subpageHero.update({ where: { id }, data: { image: v } }),
      };
    case 'contentPage':
      return {
        read: async () => (await prisma.contentPage.findUnique({ where: { id } }))?.heroImage ?? null,
        write: (v) => prisma.contentPage.update({ where: { id }, data: { heroImage: v } }),
      };
    case 'tour':
      return {
        read: async () => (await prisma.tour.findUnique({ where: { id } }))?.heroImage ?? null,
        write: (v) => prisma.tour.update({ where: { id }, data: { heroImage: v } }),
      };
    case 'trek':
      return {
        read: async () => (await prisma.trek.findUnique({ where: { id } }))?.heroImage ?? null,
        write: (v) => prisma.trek.update({ where: { id }, data: { heroImage: v } }),
      };
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin('media', 'edit');
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    if (!url) {
      return NextResponse.json({ success: false, error: 'Missing url' }, { status: 400 });
    }

    const requested = Array.isArray(body.slots) ? new Set<string>(body.slots) : new Set<string>();
    const availableSlots = Array.isArray(body.availableSlots) ? body.availableSlots : [];

    let applied = 0;
    const results: { slot: string; action: 'assigned' | 'cleared' | 'unchanged' }[] = [];

    for (const slot of availableSlots) {
      if (typeof slot !== 'string') continue;
      
      const target = getTargetForSlot(slot);
      if (!target) continue;

      const current = await target.read();
      const desired = requested.has(slot);

      if (desired && current !== url) {
        await target.write(url);
        applied++;
        results.push({ slot, action: 'assigned' });
      } else if (!desired && current === url) {
        await target.write('');
        applied++;
        results.push({ slot, action: 'cleared' });
      } else {
        results.push({ slot, action: 'unchanged' });
      }
    }

    return NextResponse.json({ success: true, applied, results });
  } catch (error) {
    console.error('Media assign failed:', error);
    return NextResponse.json({ success: false, error: 'Assign failed' }, { status: 500 });
  }
}
