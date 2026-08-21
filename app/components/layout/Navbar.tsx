'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavLinkItem {
  name: string;
  href: string;
}

interface NavbarProps {
  trekkingLinks?: NavLinkItem[];
  logoImage?: string;
}

export default function Navbar({ trekkingLinks = [], logoImage }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const aboutUsLinks = [
    { name: 'Message From Founder', href: '/message-from-managing-director' },
    { name: 'Our Team', href: '/our-team' },
    { name: 'Why Ever Peak Adventures', href: '/why-ever-peak-adventures' },
    { name: 'Responsible Travel', href: '/responsible-travel' },
    { name: 'Terms and Conditions', href: '/terms-and-conditions' },
    { name: 'Registrations / Affiliations', href: '/legal-document' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Testimonials', href: '/testimonials' },
  ];

  const tourLinks = [
    { name: 'Nepal', href: '/tour-destination/nepal' },
    { name: 'Bhutan', href: '/tour-destination/bhutan' },
    { name: 'Tibet', href: '/tour-destination/tibet' },
  ];

  return (
    <header className="bg-[#112233] text-white sticky top-0 z-50 shadow-md border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-5 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src={logoImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
            alt="Ever Peak Adventures" 
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-[#24a0ed] transition-colors py-2">
            Home
          </Link>

          {/* About Us Dropdown with clickable Parent Link */}
          <div 
            className="relative group py-2"
            onMouseEnter={() => setActiveDropdown('about')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center gap-1 hover:text-[#24a0ed] transition-colors cursor-pointer">
              <Link href="/about-us">About Us</Link>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {activeDropdown === 'about' && (
              <div className="absolute top-full left-0 w-64 bg-[#172a3a] border border-white/10 rounded-xl shadow-2xl py-2 mt-1 flex flex-col z-50">
                {aboutUsLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="px-4 py-2.5 text-[11px] font-medium text-gray-200 hover:bg-[#f59e0b] hover:text-[#112233] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Trekking in Nepal Dropdown with clickable Parent Link */}
          <div 
            className="relative group py-2"
            onMouseEnter={() => setActiveDropdown('trekking')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center gap-1 hover:text-[#24a0ed] transition-colors cursor-pointer">
              <Link href="/trekking">Trekking In Nepal</Link>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {activeDropdown === 'trekking' && (
              <div className="absolute top-full left-0 w-64 bg-[#172a3a] border border-white/10 rounded-xl shadow-2xl py-2 mt-1 flex flex-col z-50">
                {trekkingLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="px-4 py-2.5 text-[11px] font-medium text-gray-200 hover:bg-[#f59e0b] hover:text-[#112233] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Tour Packages Dropdown with clickable Parent Link */}
          <div 
            className="relative group py-2"
            onMouseEnter={() => setActiveDropdown('tours')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center gap-1 hover:text-[#24a0ed] transition-colors cursor-pointer">
              <Link href="/tour">Tour Packages</Link>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {activeDropdown === 'tours' && (
              <div className="absolute top-full left-0 w-52 bg-[#172a3a] border border-white/10 rounded-xl shadow-2xl py-2 mt-1 flex flex-col z-50">
                {tourLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="px-4 py-2.5 text-[11px] font-medium text-gray-200 hover:bg-[#f59e0b] hover:text-[#112233] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/faq" className="hover:text-[#24a0ed] transition-colors py-2">
            FAQ
          </Link>
          <Link href="/blog" className="hover:text-[#24a0ed] transition-colors py-2">
            Blogs
          </Link>
          <Link href="/contact-us" className="hover:text-[#24a0ed] transition-colors py-2">
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#24a0ed] focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#112233] border-t border-white/10 px-5 py-6 space-y-4 text-xs font-bold uppercase tracking-wider max-h-[80vh] overflow-y-auto">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-[#24a0ed]"
          >
            Home
          </Link>
          
          <div className="py-2 border-t border-white/10 pt-3">
            <Link href="/about-us" onClick={() => setMobileMenuOpen(false)} className="text-[#f59e0b] block mb-2">About Us</Link>
            <div className="pl-3 flex flex-col space-y-2 normal-case font-normal text-gray-300">
              {aboutUsLinks.map((link, idx) => (
                <Link key={idx} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="py-2 border-t border-white/10 pt-3">
            <Link href="/trekking" onClick={() => setMobileMenuOpen(false)} className="text-[#f59e0b] block mb-2">Trekking in Nepal</Link>
            <div className="pl-3 flex flex-col space-y-2 normal-case font-normal text-gray-300">
              {trekkingLinks.map((link, idx) => (
                <Link key={idx} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="py-2 border-t border-white/10 pt-3">
            <Link href="/tour" onClick={() => setMobileMenuOpen(false)} className="text-[#f59e0b] block mb-2">Tour Packages</Link>
            <div className="pl-3 flex flex-col space-y-2 normal-case font-normal text-gray-300">
              {tourLinks.map((link, idx) => (
                <Link key={idx} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col space-y-3 uppercase">
            <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blogs</Link>
            <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            <Link href="/about-us" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          </div>
        </div>
      )}
    </header>
  );
}
