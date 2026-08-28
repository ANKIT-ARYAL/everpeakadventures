const fs = require('fs');
const content = `'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, Menu, X, Search, Mountain, Map, Compass, 
  Navigation, Tent, Footprints, Users, Sun, ShieldCheck, 
  Clock, Award, MessageCircle, Mail, MapPin, ChevronRight,
  ChevronUp
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
  Mountain, Map, Compass, Navigation, Tent, Footprints, Users, Sun
};

interface Trek {
  title: string;
  slug: string;
  durationDays: string;
  heroImage: string;
}

interface Region {
  name: string;
  slug: string;
  href: string;
  iconName: string;
  treks: Trek[];
}

interface NavbarProps {
  megaMenuData?: Region[];
  logoImage?: string;
  settings?: any;
}

export default function NavbarClient({ megaMenuData = [], logoImage, settings }: NavbarProps) {
  const pathname = usePathname() || "";
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  
  const [scrolled, setScrolled] = useState(false);
  const [activeRegionIdx, setActiveRegionIdx] = useState<number>(0);

  const isSlugPage = pathname.split('/').length > 2;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isSolid = scrolled || isSlugPage || mobileMenuOpen;
  
  const headerClasses = isSolid 
    ? "bg-white text-[#112233] shadow-md border-b border-gray-100 transition-all duration-300"
    : "bg-transparent text-white border-transparent shadow-none transition-all duration-300";

  const navTextClasses = "text-[13px] font-bold tracking-wider";

  const activeRegion = megaMenuData[activeRegionIdx];

  const toggleMobileSection = (section: string) => {
    if (expandedMobileSection === section) setExpandedMobileSection(null);
    else setExpandedMobileSection(section);
  };

  return (
    <>
      <header className={\`fixed top-0 w-full z-50 \${headerClasses}\`}>
        {/* DESKTOP NAV */}
        <div className="hidden lg:flex max-w-[1600px] mx-auto px-6 xl:px-12 h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src={logoImage || "/logo.png"} alt="Ever Peak Adventures" className="h-14 w-auto object-contain drop-shadow-sm" />
          </Link>

          <nav className={\`flex items-center gap-6 xl:gap-8 uppercase \${navTextClasses}\`}>
            {/* Top Level Nav (from mockup) */}
            <Link href="/tour-destination/nepal" className="hover:text-accent-amber transition-colors">Nepal</Link>
            <Link href="/tour-destination/tibet" className="hover:text-accent-amber transition-colors">Tibet</Link>
            <Link href="/tour-destination/bhutan" className="hover:text-accent-amber transition-colors">Bhutan</Link>

            {/* Nepal Trekking Mega Menu */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => setActiveDropdown('trekking')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <span>Nepal Trekking</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {activeDropdown === 'trekking' && (
                <div className="absolute top-full -left-64 w-[1100px] bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 flex overflow-hidden">
                  
                  {/* Sidebar Regions */}
                  <div className="w-72 bg-gray-50 flex flex-col py-4 border-r border-gray-100">
                    {megaMenuData.map((region, idx) => {
                      const Icon = iconMap[region.iconName] || Mountain;
                      const isActive = activeRegionIdx === idx;
                      return (
                        <div 
                          key={region.slug}
                          onMouseEnter={() => setActiveRegionIdx(idx)}
                          className={\`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors \${isActive ? 'bg-white text-[#112233] border-l-4 border-l-accent-amber font-extrabold shadow-sm relative -mr-[1px]' : 'text-gray-600 hover:text-[#112233] hover:bg-gray-100 font-semibold border-l-4 border-l-transparent'}\`}
                        >
                          <Icon className={\`w-5 h-5 \${isActive ? 'text-accent-amber' : 'text-gray-400'}\`} />
                          <span className="text-[14px] normal-case tracking-normal">{region.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-8 bg-white flex flex-col">
                    {activeRegion && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-accent-amber">
                            <Mountain className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#112233]/50 uppercase tracking-widest mb-1">Featured {activeRegion.name.split(' ')[0]} Trips</div>
                            <h3 className="text-2xl font-bold text-[#112233] normal-case tracking-tight">Handpicked adventures in the {activeRegion.name.split(' ')[0]} region</h3>
                          </div>
                        </div>

                        {/* Treks Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                          {activeRegion.treks.map(trek => (
                            <Link key={trek.slug} href={\`/trekking/\${trek.slug}\`} className="flex items-center justify-between group p-3 rounded-xl border border-gray-100 hover:border-[#112233]/20 hover:shadow-sm transition-all bg-white">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <Footprints className="w-4 h-4 text-[#112233]/40 group-hover:text-accent-amber shrink-0" />
                                <span className="text-[14px] font-bold text-[#112233] truncate normal-case tracking-normal group-hover:text-accent-amber transition-colors">{trek.title} - {trek.durationDays}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent-amber shrink-0" />
                            </Link>
                          ))}
                        </div>

                        {/* Bottom Banner */}
                        <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center border border-gray-100 group cursor-pointer relative">
                          <div className="w-48 h-28 relative shrink-0">
                            <img src={activeRegion.treks[0]?.heroImage || "/default-hero.jpg"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Banner" />
                          </div>
                          <div className="p-5 flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center">
                                  <Mountain className="w-5 h-5 text-accent-amber" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-[#112233] normal-case tracking-normal text-[15px]">Ready for your {activeRegion.name.split(' ')[0]} adventure?</h4>
                                  <p className="text-[12px] text-gray-500 normal-case tracking-normal">Our local experts will help you choose the perfect itinerary.</p>
                                </div>
                              </div>
                              <Link href={activeRegion.href} className="bg-[#112233] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] normal-case tracking-normal hover:bg-[#1a2f4c] transition-colors flex items-center gap-2">
                                Explore All Trips <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                            <div className="flex items-center gap-6 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 normal-case tracking-normal"><ShieldCheck className="w-3.5 h-3.5 text-accent-amber"/> Expert Local Guides</div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 normal-case tracking-normal"><Clock className="w-3.5 h-3.5 text-accent-amber"/> 24/7 On-Trek Support</div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 normal-case tracking-normal"><Award className="w-3.5 h-3.5 text-accent-amber"/> Best Price Guarantee</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Tour Packages (Simple Dropdown) */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => setActiveDropdown('tours')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <span>Tour Packages</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              {activeDropdown === 'tours' && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-b-2xl shadow-xl border-t border-gray-100 py-2">
                  {tourLinks.map((link, idx) => (
                    <Link key={idx} href={link.href} className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">{link.name}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/blog" className="hover:text-accent-amber transition-colors">Travel Guide</Link>
            
            <div 
              className="relative group py-7"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <span>About Us</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-b-2xl shadow-xl border-t border-gray-100 py-2">
                  {aboutUsLinks.map((link, idx) => (
                    <Link key={idx} href={link.href} className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">{link.name}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/contact-us" className="text-[#e85b2b] hover:text-[#d44718] transition-colors">Contact Us</Link>
            
            <button aria-label="Search" className="ml-2">
              <Search className="w-5 h-5 hover:text-accent-amber transition-colors" />
            </button>
          </nav>
        </div>

        {/* MOBILE TOP BAR */}
        <div className="lg:hidden flex items-center justify-between px-5 h-16 bg-white shadow-sm border-b border-gray-100">
          <Link href="/">
            <img src={logoImage || "/logo.png"} alt="Logo" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4 text-[#112233]">
            <Search className="w-6 h-6" />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* FULL SCREEN MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 top-16 bg-white z-[40] overflow-y-auto flex flex-col pb-24"
          >
            <div className="flex flex-col border-t border-gray-100">
              
              <Link href="/tour-destination/nepal" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><Mountain className="w-5 h-5"/> Nepal</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link href="/tour-destination/tibet" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><Tent className="w-5 h-5"/> Tibet</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link href="/tour-destination/bhutan" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><Map className="w-5 h-5"/> Bhutan</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              {/* Accordion: Nepal Trekking */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileSection('trekking')} 
                  className={\`flex items-center justify-between w-full px-6 py-5 font-bold text-[16px] \${expandedMobileSection === 'trekking' ? 'text-[#1e857c]' : 'text-[#112233]'}\`}
                >
                  <div className="flex items-center gap-4"><Footprints className="w-5 h-5"/> Nepal Trekking</div>
                  {expandedMobileSection === 'trekking' 
                    ? <div className="w-7 h-7 rounded-full border border-[#1e857c] flex items-center justify-center"><ChevronUp className="w-5 h-5" /></div>
                    : <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <AnimatePresence>
                  {expandedMobileSection === 'trekking' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50">
                      <div className="px-6 py-4 flex flex-col">
                        <div className="border-l-2 border-[#1e857c] ml-2 pl-6 flex flex-col gap-4">
                          {megaMenuData.map((region) => (
                            <Link key={region.slug} href={region.href} className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                              <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> {region.name}</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion: Tour Packages */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileSection('tours')} 
                  className={\`flex items-center justify-between w-full px-6 py-5 font-bold text-[16px] \${expandedMobileSection === 'tours' ? 'text-[#1e857c]' : 'text-[#112233]'}\`}
                >
                  <div className="flex items-center gap-4"><Compass className="w-5 h-5"/> Tour Packages</div>
                  {expandedMobileSection === 'tours' 
                    ? <div className="w-7 h-7 rounded-full border border-[#1e857c] flex items-center justify-center"><ChevronUp className="w-5 h-5" /></div>
                    : <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <AnimatePresence>
                  {expandedMobileSection === 'tours' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50">
                      <div className="px-6 py-4 flex flex-col">
                        <div className="border-l-2 border-[#1e857c] ml-2 pl-6 flex flex-col gap-4">
                          {tourLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                              <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> {link.name}</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/blog" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><Map className="w-5 h-5"/> Travel Guide</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link href="/about-us" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><Users className="w-5 h-5"/> About Us</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link href="/contact-us" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><MessageCircle className="w-5 h-5"/> Contact Us</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

            </div>

            <div className="px-6 py-8 mt-auto flex flex-col items-center">
              <Link href="/contact-us" className="w-full bg-[#056d81] hover:bg-[#04596b] text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 text-lg shadow-lg">
                <Navigation className="w-5 h-5" /> Plan a Trip
              </Link>

              <div className="w-full flex flex-col gap-4 mt-8 text-[#112233]">
                <a href={\`tel:\${settings?.emergencyPhone || '+977 9851 234567'}\`} className="flex items-center gap-4 text-[15px] font-semibold">
                  <MessageCircle className="w-6 h-6 text-[#1e857c]" /> {settings?.emergencyPhone || '+977 9851 234567'}
                </a>
                <a href={\`mailto:\${settings?.email || 'info@everpeaknepal.com'}\`} className="flex items-center gap-4 text-[15px] font-semibold">
                  <Mail className="w-6 h-6 text-[#1e857c]" /> {settings?.email || 'info@everpeaknepal.com'}
                </a>
                <div className="flex items-center gap-4 text-[15px] font-semibold">
                  <MapPin className="w-6 h-6 text-[#1e857c] shrink-0" /> {settings?.addressLine1 || 'Thamel'}, {settings?.addressLine2 || 'Kathmandu, Nepal'}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
`;
fs.writeFileSync('app/components/layout/NavbarClient.tsx', content);
