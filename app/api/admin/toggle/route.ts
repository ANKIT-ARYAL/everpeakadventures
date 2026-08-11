import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from "@/app/lib/require-admin";

const modelMap: Record<string, any> = {
  // Items
  treks: prisma.trek,
  tours: prisma.tour,
  blogs: prisma.blogPost,
  testimonials: prisma.clientReview,
  faqs: prisma.fAQ,
  team: prisma.teamMember,
  'legal-documents': prisma.legalDocument,
  'why-choose-us-items': prisma.whyChooseUsItem,
  'why-choose-us-features': prisma.whyChooseUsFeature,
  'welcome-features': prisma.welcomeFeature,
  'subpage-heroes': prisma.subpageHero,
  departures: prisma.departure,
  'trust-items': prisma.trustItem,
  'trek-categories': prisma.trekCategory,
  'tour-categories': prisma.tourCategory,
  'page-categories': prisma.pageCategory,
  pages: prisma.contentPage,
  // Single-instance sections
  'hero-content': prisma.heroContent,
  'home-section-content': prisma.homeSectionContent,
  'video-banner-content': prisma.videoBannerContent,
  'cta-banner-content': prisma.ctaBannerContent,
  'about-content': prisma.aboutPageContent,
  'director-message': prisma.directorMessageContent,
  'why-page': prisma.whyPageContent,
  'responsible-travel': prisma.responsibleTravelContent,
  'terms-page': prisma.termsPageContent,
  'privacy-policy': prisma.privacyPolicyContent,
  'contact-info': prisma.contactInfo,
  'contact-widget': prisma.contactWidgetSettings,
  'trusted-partner': prisma.trustedPartnerContent,
  'testimonials-section': prisma.testimonialSectionContent,
  'blue-banner': prisma.blueBannerContent,
  'welcome-content': prisma.welcomeContent,
};

const resourceByModel: Record<string, string> = {
  treks: 'treks',
  tours: 'tours',
  blogs: 'blogs',
  testimonials: 'testimonials',
  faqs: 'faqs',
  team: 'team',
  'legal-documents': 'legal-documents',
  'why-choose-us-items': 'why-choose-us',
  'why-choose-us-features': 'why-choose-us',
  'welcome-features': 'welcome-features',
  'subpage-heroes': 'subpage-hero',
  departures: 'departures',
  'trust-items': 'trust-items',
  'trek-categories': 'trek-categories',
  'tour-categories': 'tour-categories',
  'page-categories': 'page-categories',
  pages: 'pages',
  'hero-content': 'hero-content',
  'home-section-content': 'home-section-content',
  'video-banner-content': 'video-banners',
  'cta-banner-content': 'video-banners',
  'about-content': 'about-content',
  'director-message': 'director-message',
  'why-page': 'why-page',
  'responsible-travel': 'responsible-travel',
  'terms-page': 'terms-page',
  'privacy-policy': 'privacy-policy',
  'contact-info': 'contact-info',
  'contact-widget': 'contact-widget',
  'trusted-partner': 'why-choose-us',
  'testimonials-section': 'testimonials',
  'blue-banner': 'testimonials',
  'welcome-content': 'welcome-features',
};

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !body.model || typeof body.id !== "string") {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const model = body.model as string;
  const delegate = modelMap[model];

  if (!delegate) {
    return NextResponse.json({ success: false, error: "Invalid model" }, { status: 400 });
  }

  const unauthorized = await requireAdmin(resourceByModel[model] ?? model, "edit");
  if (unauthorized) return unauthorized;

  try {
    const published = !!body.published;
    if (body.id === "__single__") {
      const first = await delegate.findFirst();
      if (first) await delegate.update({ where: { id: first.id }, data: { published } });
    } else {
      await delegate.update({ where: { id: body.id }, data: { published } });
    }
    return NextResponse.json({ success: true, published });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update visibility" }, { status: 500 });
  }
}