import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ChevronRight, Send, Clock, ShieldCheck, Footprints, Headphones, Users, Award, Star } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { prisma } from '@/lib/prisma';
import NewsletterForm from './NewsletterForm';
import type { ComponentType, SVGProps } from 'react';
import Image from 'next/image';

// Icon Map for Trust Items
const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  ShieldCheck,
  Footprints,
  Headphones,
  Users,
  Award,
  Star
};

// Types & defaults
type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type FooterLogo = { label: string; src: string; href?: string };
type FooterLogos = { associations: FooterLogo[]; payments: FooterLogo[] };

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Popular Treks',
    links: [
      { label: 'Everest Base Camp Trek', href: '/trekking-types/everest-region' },
      { label: 'Annapurna Circuit Trek', href: '/trekking-types/annapurna-region' },
      { label: 'Langtang Valley Trek', href: '/trekking-types/langtang-region' },
      { label: 'Manaslu Circuit Trek', href: '/trekking-types/manaslu-region' },
      { label: 'Upper Mustang Trek', href: '/trekking-types/mustang-region' },
    ],
  },
  {
    title: 'Destinations',
    links: [
      { label: 'Everest Region', href: '/trekking-types/everest-region' },
      { label: 'Annapurna Region', href: '/trekking-types/annapurna-region' },
      { label: 'Langtang Region', href: '/trekking-types/langtang-region' },
      { label: 'Manaslu Region', href: '/trekking-types/manaslu-region' },
      { label: 'Mustang Region', href: '/trekking-types/mustang-region' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Our Team', href: '/our-team' },
      { label: 'Responsible Tourism', href: '/responsible-travel' },
      { label: 'Reviews', href: '/testimonials' },
      { label: 'Contact Us', href: '/contact-us' },
    ],
  },
];

const DEFAULT_LOGOS: FooterLogos = {
  associations: [
    { label: 'TAAN', src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:150/h:150/q:mauto/rt:fill/g:ce/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/Proud-Member-of-Trekking-Agencys-Association-of-Nepal-Logo.png' },
    { label: 'NTB', src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:150/h:150/q:mauto/rt:fill/g:ce/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/Nepal-Tourism-Board-Department-of-Tourism-Logo.jpg' },
  ],
  payments: [
    { label: 'eSewa', src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:300/h:104/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/ESEWA.png' },
    { label: 'Khalti', src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:300/h:115/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/logo-khalti.png' },
    { label: 'VISA', src: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:112/h:36/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2026/01/Visa.png' },
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
  const assoc = Array.isArray(obj.associations) ? obj.associations.filter((l) => l?.src) : DEFAULT_LOGOS.associations;
  const pay = Array.isArray(obj.payments) ? obj.payments.filter((l) => l?.src) : DEFAULT_LOGOS.payments;
  return { associations: assoc.length ? assoc : DEFAULT_LOGOS.associations, payments: pay.length ? pay : DEFAULT_LOGOS.payments };
};

// Social Icons helper
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-8 h-8 rounded-full border border-[#EFE6D8]/20 flex items-center justify-center text-[#EFE6D8]/80 hover:text-accent-amber hover:border-accent-amber transition-all"
  >
    <Icon className="w-4 h-4" />
  </a>
);

export default async function Footer() {
  const settings = await prisma.siteSettings.findFirst();
  
  // Fetch trust items
  const trustItems = await prisma.trustItem.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    take: 5
  });

  const columns = settings?.footerColumns ? clean(settings.footerColumns) : DEFAULT_COLUMNS;
  const logos = settings?.footerLogos ? cleanLogos(settings.footerLogos) : DEFAULT_LOGOS;

  return (
    <footer className="bg-[#0b1521] text-[#EFE6D8] font-sans border-t border-[#EFE6D8]/10 pt-10">
      <div className="px-5 lg:px-20">
        
        {/* ROW 1: Trust Items (from image top row) */}
        {trustItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 pb-10 border-b border-[#EFE6D8]/10">
            {trustItems.map((item) => {
              const Icon = iconMap[item.iconName] || ShieldCheck;
              return (
                <div key={item.id} className="flex flex-col items-center text-center group">
                  <div className="w-14 h-14 rounded-full bg-accent-amber/10 flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1">
                    <Icon className="w-6 h-6 text-accent-amber" />
                  </div>
                  <h4 className="font-bold text-lg lg:text-[15px] mb-2">{item.title}</h4>
                  <p className="text-md text-[#EFE6D8]/60 leading-relaxed px-5 lg:px-20">
                    {item.subtitle.replace(/<[^>]*>?/gm, '')}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ROW 2: Newsletter Block */}
        <div className="py-10 border-b border-[#EFE6D8]/10">
          <div className="bg-[#112233] rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-14 h-14 rounded-full bg-background border border-[#EFE6D8]/10 items-center justify-center shrink-0 shadow-inner">
                <Send className="w-6 h-6 text-accent-amber -ml-1 mt-1" />
              </div>
              <div>
                <h3 className="text-[1rem] font-black oswald tracking-wider mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-[1rem] text-[#EFE6D8]/70">Get the latest treks, travel tips & exclusive offers straight to your inbox.</p>
              </div>
            </div>
            <div className="w-full md:w-auto md:min-w-[320px]">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* ROW 3: Main Links & Contact */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] gap-x-6 gap-y-10">
          
          {/* Col 1: Brand & Social */}
          <div className="pr-4">
            <Link href="/" className="inline-block mb-6">
              <img
                src={settings?.logoImage || '/logo.png'}
                alt="Ever Peak Adventures"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-[#EFE6D8]/70 leading-relaxed mb-6">
              Your trusted partner for unforgettable trekking and adventure experiences across Nepal.
            </p>
            <div className="flex items-center gap-2.5">
              <SocialIcon href={(settings as any)?.facebookUrl || '#'} icon={FaFacebookF} />
              <SocialIcon href={(settings as any)?.instagramUrl || '#'} icon={FaInstagram} />
              <SocialIcon href={`https://wa.me/${settings?.whatsapp || '9851093960'}`} icon={FaWhatsapp} />
              <SocialIcon href={(settings as any)?.youtubeUrl || '#'} icon={FaYoutube} />
              <SocialIcon href={`mailto:${settings?.email || 'info@everpeakadventures.com'}`} icon={Mail} />
            </div>
          </div>

          {/* Col 2-4: Links */}
          {columns.slice(0, 3).map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-[15px] mb-6 tracking-wide">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[13px] text-[#EFE6D8]/70 hover:text-accent-amber transition-colors flex items-center justify-between group">
                      <span>{link.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 5: Contact Us */}
          <div>
            <h4 className="font-bold text-[15px] mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-5 text-[13px] text-[#EFE6D8]/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings?.addressLine1 || 'Thamel'}, {settings?.addressLine2 || 'Kathmandu, Nepal'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent-amber shrink-0" />
                <a href={`tel:${settings?.emergencyPhone || '+9779812345678'}`} className="hover:text-accent-amber transition-colors">
                  {settings?.emergencyPhone || '+977 9812345678'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent-amber shrink-0" />
                <a href={`mailto:${settings?.email || 'info@everpeakadventures.com'}`} className="hover:text-accent-amber transition-colors">
                  {settings?.email || 'info@everpeakadventures.com'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
                <span>Mon - Sun: 6:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>

      {/* ROW 4: Bottom Bar */}
      <div className="border-t border-[#EFE6D8]/10 bg-[#112233]">
        <div className="py-6 flex flex-col lg:flex-row items-center justify-between gap-6 text-[12px] text-[#EFE6D8]/60 px-5 lg:px-20">
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="font-medium">We Accept</span>
            <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
              {logos.payments.map((l) => (
                <img key={l.label} src={l.src} alt={l.label} className="h-4 sm:h-6 w-auto object-contain bg-white rounded px-1.5 py-0.5" />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 lg:ml-auto">
            <Link href="/privacy-policy" className="hover:text-accent-amber transition-colors">Privacy Policy</Link>
            <span className="w-px h-3 bg-[#EFE6D8]/20" />
            <Link href="/terms-and-conditions" className="hover:text-accent-amber transition-colors">Terms & Conditions</Link>
          </div>

          <div className="text-center lg:text-right">
            {settings?.copyrightText || '© 2026 Ever Peak Adventures. All Rights Reserved.'}
          </div>
          
        </div>
      </div>
    </footer>
  );
}