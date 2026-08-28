// Sitemap definition for the admin "All Pages" hub and its section pages.
// Each top-level section maps to the content/CRUD pages that previously lived
// in the admin sidebar dropdown groups.

export type SitemapIcon =
  | 'home'
  | 'info'
  | 'contact'
  | 'faq'
  | 'blog'
  | 'system'
  | 'file'
  | 'settings'
  | 'shield'
  | 'team'
  | 'review'
  | 'dashboard'
  | 'message'
  | 'image'
  | 'layers'
  | 'sparkles'
  | 'video'
  | 'mail'
  | 'checklist'
  | 'folder';

export interface SitemapLink {
  href: string;
  label: string;
  perm: string;
  icon?: SitemapIcon;
}

export interface SitemapGroup {
  label: string;
  links: SitemapLink[];
}

export interface SitemapSection {
  key: string;
  label: string;
  description: string;
  icon: SitemapIcon;
  links?: SitemapLink[];
  groups?: SitemapGroup[];
}

export const SITEMAP_SECTIONS: SitemapSection[] = [
  {
    key: 'home',
    label: 'Home',
    description: 'Dashboard, hero banners, home sections, video & CTA banners and welcome features.',
    icon: 'home',
    links: [
      { href: '/admin', label: 'Dashboard', perm: 'dashboard:view', icon: 'dashboard' },
      { href: '/admin/hero-content', label: 'Hero Banners', perm: 'hero-content:view', icon: 'image' },
      { href: '/admin/home-section-content', label: 'Home Sections', perm: 'home-section-content:view', icon: 'layers' },
      { href: '/admin/video-banners', label: 'Video & CTA Banners', perm: 'video-banners:view', icon: 'video' },
      { href: '/admin/welcome-features', label: 'Welcome Features', perm: 'welcome-features:view', icon: 'sparkles' },
    ],
  },
  {
    key: 'about',
    label: 'About Us',
    description: 'Company information, trust & travel and team & review content.',
    icon: 'info',
    groups: [
      {
        label: 'Company Info',
        links: [
          { href: '/admin/about-content', label: 'About Page Content', perm: 'about-content:view', icon: 'file' },
          { href: '/admin/director-message', label: 'Message From Founder', perm: 'director-message:view', icon: 'message' },
          { href: '/admin/why-page', label: 'Why Ever Peak', perm: 'why-page:view', icon: 'checklist' },
          { href: '/admin/why-choose-us', label: 'Why Choose Us', perm: 'why-choose-us:view', icon: 'layers' },
        ],
      },
      {
        label: 'Trust & Travel',
        links: [
          { href: '/admin/responsible-travel', label: 'Responsible Travel', perm: 'responsible-travel:view', icon: 'shield' },
          { href: '/admin/trust-items', label: 'Trust Items & Badges', perm: 'trust-items:view', icon: 'shield' },
        ],
      },
      {
        label: 'Team & Reviews',
        links: [
          { href: '/admin/team', label: 'Team Members', perm: 'team:view', icon: 'team' },
          { href: '/admin/testimonials', label: 'Testimonials (Reviews)', perm: 'testimonials:view', icon: 'review' },
        ],
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contact Us',
    description: 'Contact information, the contact widget and submitted messages.',
    icon: 'contact',
    links: [
      { href: '/admin/contact-info', label: 'Contact Info', perm: 'contact-info:view', icon: 'settings' },
      { href: '/admin/contact-widget', label: 'Contact Widget', perm: 'contact-widget:view', icon: 'message' },
      { href: '/admin/contact-submissions', label: 'Contact Submissions', perm: 'contact-submissions:view', icon: 'mail' },
    ],
  },
  {
    key: 'faq',
    label: 'FAQ',
    description: 'Questions and answers shown on the FAQ page.',
    icon: 'faq',
    links: [{ href: '/admin/faqs', label: 'All FAQs', perm: 'faqs:view', icon: 'faq' }],
  },
  {
    key: 'blogs',
    label: 'Blogs',
    description: 'Blog posts and publishing.',
    icon: 'blog',
    links: [{ href: '/admin/blogs', label: 'Blog Posts', perm: 'blogs:view', icon: 'blog' }],
  },
  {
    key: 'system',
    label: 'System',
    description: 'Site settings, subpage heroes and legal pages.',
    icon: 'system',
    links: [
      { href: '/admin/site-settings', label: 'Site Settings', perm: 'site-settings:view', icon: 'settings' },
      { href: '/admin/subpage-hero', label: 'Subpage Heroes', perm: 'subpage-hero:view', icon: 'image' },
      { href: '/admin/terms-page', label: 'Terms & Conditions', perm: 'terms-page:view', icon: 'file' },
      { href: '/admin/privacy-policy', label: 'Privacy Policy', perm: 'privacy-policy:view', icon: 'file' },
      { href: '/admin/legal-documents', label: 'Legal Documents', perm: 'legal-documents:view', icon: 'shield' },
    ],
  },
];

export function getSitemapSection(key: string): SitemapSection | undefined {
  return SITEMAP_SECTIONS.find((s) => s.key === key);
}

/** Flatten every link (through any grouped subsections) of a section. */
export function sectionChildren(section: SitemapSection): SitemapLink[] {
  if (section.links) return section.links;
  return (section.groups ?? []).flatMap((g) => g.links);
}

/** A user can reach a section if they can view at least one of its links. */
export function sectionCanView(
  section: SitemapSection,
  isSuperAdmin: boolean,
  permissions: string[]
): boolean {
  return sectionChildren(section).some(
    (l) => isSuperAdmin || permissions.includes(l.perm)
  );
}