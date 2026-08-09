import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import NewsletterForm from './NewsletterForm';

// ---------- defaults mirror everpeakadventures.com ----------
const DEFAULT_FOOTER_BG =
  "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c/w:1536/h:1024/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/Ever-peak-Adventure-footer-image.png";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type FooterLogo = { label: string; src: string; href?: string };

type FooterLogos = { associations: FooterLogo[]; payments: FooterLogo[] };

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Popular Trekking',
    links: [
      { label: 'Everest Region', href: '/trekking-types/everest-region' },
      { label: 'Manaslu Region', href: '/trekking-types/manaslu-region' },
      { label: 'Annapurna Region', href: '/trekking-types/annapurna-region' },
      { label: 'Langtang Region', href: '/trekking-types/langtang-region' },
      { label: 'Mustang Region', href: '/trekking-types/mustang-region' },
      { label: 'Kanchenjunga Region', href: '/trekking-types/kanchenjunga-region' },
    ],
  },
  {
    title: 'Tour Categories',
    links: [
      { label: 'Adventure Sports', href: '/tour' },
      { label: 'Culture + Nature Tours', href: '/tour' },
      { label: 'Day Tours', href: '/tour' },
      { label: 'Multi Country Tours', href: '/tour-destination/nepal' },
    ],
  },
  {
    title: 'Popular Tours',
    links: [
      { label: 'Spiritual Tours', href: '/tour-destination/nepal' },
      { label: 'Village Tours', href: '/tour-destination/nepal' },
      { label: 'Wildlife Safari Tours', href: '/tour-destination/nepal' },
      { label: 'Cultural Tours', href: '/tour' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about-us' },
      { label: 'Our Team', href: '/our-team' },
      { label: 'Responsible Tourism', href: '/responsible-travel' },
      { label: 'Registrations & Affiliations', href: '/legal-document' },
    ],
  },
  {
    title: 'Useful Links',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { label: 'B2B Partner', href: '/contact-us' },
      { label: 'Gallery', href: '/trekking' },
    ],
  },
];

const DEFAULT_LOGOS: FooterLogos = {
  associations: [
    {
      label: 'Proud Member of Trekking Agencies Association of Nepal',
      src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:150/h:150/q:mauto/rt:fill/g:ce/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/Proud-Member-of-Trekking-Agencys-Association-of-Nepal-Logo.png',
    },
    {
      label: 'Nepal Tourism Board - Department of Tourism',
      src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:150/h:150/q:mauto/rt:fill/g:ce/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/Nepal-Tourism-Board-Department-of-Tourism-Logo.jpg',
    },
    {
      label: 'Government of Nepal',
      src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:150/h:150/q:mauto/rt:fill/g:ce/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/Goverment-of-Nepal-Logo.png',
    },
    {
      label: 'General Member of Nepal Mountaineering Association',
      src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:150/h:150/q:mauto/rt:fill/g:ce/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/General-Member-of-Nepal-Mountaineering-Association-Logo.png',
    },
  ],
  payments: [
    {
      label: 'eSewa Nepal',
      src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:300/h:104/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/ESEWA.png',
    },
    {
      label: 'Khalti',
      src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:300/h:115/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/logo-khalti.png',
    },
    {
      label: 'VISA',
      src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:112/h:36/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/Visa.png',
    },
  ],
};

const clean = (arr: unknown): FooterColumn[] => {
  if (!Array.isArray(arr)) return DEFAULT_COLUMNS;
  const cols = arr
    .map((raw) => {
      const c = raw as Partial<FooterColumn> | null | undefined;
      return {
        title: String(c?.title || ''),
        links: (Array.isArray(c?.links) ? c.links : []) as FooterLink[],
      };
    })
    .filter((c: FooterColumn) => c.title && Array.isArray(c.links) && c.links.length > 0);
  return cols.length ? cols : DEFAULT_COLUMNS;
};

const cleanLogos = (v: unknown): FooterLogos => {
  if (!v || typeof v !== 'object') return DEFAULT_LOGOS;
  const obj = v as FooterLogos;
  const assoc: FooterLogo[] = Array.isArray(obj.associations)
    ? obj.associations.filter((l) => l?.src)
    : DEFAULT_LOGOS.associations;
  const pay: FooterLogo[] = Array.isArray(obj.payments)
    ? obj.payments.filter((l) => l?.src)
    : DEFAULT_LOGOS.payments;
  return { associations: assoc.length ? assoc : DEFAULT_LOGOS.associations, payments: pay.length ? pay : DEFAULT_LOGOS.payments };
};

function FooterLinkItem({ link }: { link: FooterLink }) {
  const isInternal = link.href.startsWith('/');
  if (isInternal) {
    return (
      <Link href={link.href} className="hover:text-white transition-colors">
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
      {link.label}
    </a>
  );
}

export default async function Footer() {
  const settings = await prisma.siteSettings.findFirst();

  const bgImage = settings?.footerBgImage || DEFAULT_FOOTER_BG;
  const columns = settings?.footerColumns ? clean(settings.footerColumns) : DEFAULT_COLUMNS;
  const logos = settings?.footerLogos ? cleanLogos(settings.footerLogos) : DEFAULT_LOGOS;
  const newsletterTitle = settings?.newsletterTitle || 'Subscribe to our Newsletter';

  return (
    <footer className="relative font-sans overflow-hidden">
      {/* -------- DARK TOP SECTION: photo + gray→teal gradient overlay -------- */}
      <div className="relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{ backgroundImage: 'linear-gradient(180deg, rgba(84,84,84,0.5) 33%, rgba(5,76,104,0.5) 100%)' }}
        />

        <div className="relative z-20 max-w-[1200px] mx-auto px-5 pt-16 pb-10 text-white">
          {/* TOP ROW: Logo | Newsletter | Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_5fr_3fr] gap-8 pb-12 items-start">
            {/* Logo */}
            <div className="pt-1">
              <Link href="/" className="inline-block">
                <img
                  src={settings?.logoImage || '/logo.png'}
                  alt="Ever Peak Adventures"
                  className="h-[52px] w-auto object-contain"
                />
              </Link>
            </div>

            {/* Newsletter */}
            <div className="pt-1">
              <h2 className="text-xl md:text-[22px] font-black oswald uppercase tracking-wide mb-3 text-white">{newsletterTitle}</h2>
              <p className="text-xs text-white/80 mb-4 max-w-md">Get the latest offers, new treks &amp; travel tips in your inbox.</p>
              <NewsletterForm />
            </div>

            {/* Contact */}
            <div className="text-xs space-y-4 text-white/90">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 text-[#7ac7e1] mt-0.5 flex shrink-0 items-center justify-center"><Phone className="w-4 h-4" /></span>
                <div>
                  <p className="font-bold text-white text-[13px] mb-1">{settings?.emergencyLabel || 'Emergency SOS (24/7):'}</p>
                  <p className="leading-relaxed">Landline: {settings?.emergencyLandline || '+977-4588-1199'}</p>
                  <p className="flex-1">Phone: {settings?.emergencyPhone || '9851093960'}</p>
                  <p className="flex-1">WhatsApp: {settings?.whatsapp || '9851093960'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#26a7de] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-[13px] mb-0.5">Email:</p>
                  <p><a href={`mailto:${settings?.email || 'info@everpeakadventures.com'}`} className="hover:text-white transition-colors">{settings?.email || 'info@everpeakadventures.com'}</a></p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2687de] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-[13px] mb-0.5">Address:</p>
                  <p className="leading-relaxed">{settings?.addressLine1 || 'Pahutardara'}</p>
                  <p><a href={settings?.addressMapUrl || 'https://maps.app.goo.gl/1vfJx36bEbCc7UA7'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{settings?.addressLine2 || 'Kathmandu, Nepal'}</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW — link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-10 border-t border-white/10 text-xs">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white text-[13px] mb-2 oswald uppercase tracking-wider">{col.title}</h4>
                <span className="block w-8 h-0.5 bg-[#2688de] mb-4" />
                <ul className="space-y-2.5 text-gray-300">
                  {col.links.map((link: FooterLink) => (
                    <li key={link.href + link.label}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -------- LIGHT BOTTOM BAR: associations / copyright / payments -------- */}
      <div className="bg-[#f1f6ff] text-gray-500 relative z-20">
        <div className="max-w-[1200px] mx-auto px-5 py-6 flex flex-col lg:flex-row items-center justify-between gap-6 text-[11.5px]">
          {/* Associations */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-black text-[#2688c8] uppercase text-xs mr-1">Associations</span>
            {logos.associations.map((l) => (
              <a key={l.src} href={l.href || '#'} title={l.label} className="inline-flex">
                <img src={l.src} alt={l.label} className="h-7 w-auto object-contain hover:opacity-80 transition-opacity" loading="lazy" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p>
              {settings?.copyrightText || 'Copyright &copy; 2026 Everpeak Adventures | Designed By Fly Up Technology'}
            </p>
          </div>

          {/* Payments */}
          <div className="flex items-center gap-3">
            <span className="font-bold uppercase text-xs mr-1">Payments</span>
            {logos.payments.map((l) => (
              <span key={l.label}>
                <img src={l.src} alt={l.label} className="h-7 w-auto object-contain hover:opacity-95" loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}