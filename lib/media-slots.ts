export type ImageSlotKey =
  | 'logo'
  | 'footerBg'
  | 'homeHero'
  | 'ctaBg'
  | 'aboutFeatured'
  | 'founder'
  | 'trustedStory'
  | 'trustedHero';

export interface ImageSlot {
  key: ImageSlotKey;
  label: string;
  group: string;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: 'logo', label: 'Site Logo', group: 'Branding' },
  { key: 'footerBg', label: 'Footer Background', group: 'Branding' },
  { key: 'homeHero', label: 'Home Hero Banner', group: 'Home' },
  { key: 'ctaBg', label: 'CTA Banner Background', group: 'Home' },
  { key: 'aboutFeatured', label: 'About Page Image', group: 'About Us' },
  { key: 'founder', label: 'Founder Image', group: 'About Us' },
  { key: 'trustedStory', label: 'Trusted Partner Story Image', group: 'About Us' },
  { key: 'trustedHero', label: 'Trusted Partner Hero Image', group: 'About Us' },
];