'use client';

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
import QuickSearchModal from './QuickSearchModal';

const iconMap: Record<string, React.ElementType> = {
  Mountain, Map, Compass, Navigation, Tent, Footprints, Users, Sun
};

interface Trek {
  title: string;
  slug: string | null;
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



export default function NavbarClient({ nepalTabs = [], nepalTrekkingTabs = [], nepalToursTabs = [], tibetBhutanMenu = [], logoImage, settings }: any) {

  const pathname = usePathname() || "";
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  
  const [scrolled, setScrolled] = useState(false);
  const [activeNepalTabIdx, setActiveNepalTabIdx] = useState<number>(0);
  const [activeTrekkingTabIdx, setActiveTrekkingTabIdx] = useState<number>(0);
  const [activeToursTabIdx, setActiveToursTabIdx] = useState<number>(0);
  const [activeTibetBhutanTabIdx, setActiveTibetBhutanTabIdx] = useState<number>(0);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const isSlugPage = pathname.split('/').length > 2 || pathname === "/contact-us" || pathname === "/about-us" || pathname === "/blog";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    ? "bg-[#112233] text-white shadow-md border-b border-gray-800 transition-all duration-300"
    : "bg-transparent text-white border-transparent shadow-none transition-all duration-300";

  const navTextClasses = "text-[13px] font-bold tracking-wider";


  const toggleMobileSection = (section: string) => {
    if (expandedMobileSection === section) setExpandedMobileSection(null);
    else setExpandedMobileSection(section);
  };

  const closeDesktopMenu = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 ${headerClasses}`}>
        {/* DESKTOP NAV */}
        <div className="hidden lg:flex h-20 items-center justify-between px-5 lg:px-20">
          <Link href="/" className="flex items-center">
            <img src={logoImage || "/logo.png"} alt="Ever Peak Adventures" className="h-14 w-auto object-contain drop-shadow-sm" />
          </Link>

          <div className="hidden lg:flex xl:gap-6 items-center gap-4 font-bold text-[13px] text-white">
            <Link href="/" className="hover:text-accent-amber transition-colors uppercase">Home</Link>
            
            {/* 1. NEPAL */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => { setActiveDropdown('nepal'); setActiveNepalTabIdx(0); }}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <Link href="/tour-destination/nepal" className="uppercase">Nepal</Link>
                <ChevronDown className="w-4 h-4" />
              </div>

              {activeDropdown === 'nepal' && (
                <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[1100px] bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 flex overflow-hidden text-[#112233]">
                  {/* Sidebar Tabs */}
                  <div className="w-[300px] bg-gray-50 flex flex-col py-4 border-r border-gray-100">
                    {nepalTabs.map((tab: any, idx: number) => {
                      const isActive = activeNepalTabIdx === idx;
                      return (
                        <div 
                          key={tab.name}
                          onMouseEnter={() => setActiveNepalTabIdx(idx)}
                          className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${isActive ? 'bg-white text-[#112233] border-l-4 border-l-accent-amber font-extrabold shadow-sm relative -mr-[1px]' : 'text-gray-600 hover:text-[#112233] hover:bg-gray-100 font-semibold border-l-4 border-l-transparent'}`}
                        >
                          <span className="text-[14px] normal-case tracking-normal">{tab.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-8 bg-white flex flex-col">
                    {nepalTabs[activeNepalTabIdx] && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-accent-amber">
                            <Mountain className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#112233]/50 uppercase tracking-widest mb-1">Featured {nepalTabs[activeNepalTabIdx].name}</div>
                            <h3 className="text-2xl font-bold text-[#112233] normal-case tracking-tight">Handpicked {nepalTabs[activeNepalTabIdx].name.toLowerCase()}</h3>
                          </div>
                        </div>

                        {/* Grid */}
                        {nepalTabs[activeNepalTabIdx].items.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                            {nepalTabs[activeNepalTabIdx].items.map((item: any) => (
                              <Link key={item.slug} href={item.type === 'trek' ? `/trekking/${item.slug}` : `/tour/${item.slug}`} onClick={closeDesktopMenu} className="flex items-center justify-between group p-3 rounded-xl border border-gray-100 hover:border-[#112233]/20 hover:shadow-sm transition-all bg-white">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <Footprints className="w-4 h-4 text-[#112233]/40 group-hover:text-accent-amber shrink-0" />
                                  <span className="text-[14px] font-bold text-[#112233] truncate normal-case tracking-normal group-hover:text-accent-amber transition-colors">{item.title} - {item.durationDays}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent-amber shrink-0" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 italic text-sm py-4">No packages found for this category yet.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. NEPAL TREKKING */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => { setActiveDropdown('trekking'); setActiveTrekkingTabIdx(0); }}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <Link href="/trekking" className="uppercase">Nepal Trekking</Link>
                <ChevronDown className="w-4 h-4" />
              </div>

              {activeDropdown === 'trekking' && (
                <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[1100px] bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 flex overflow-hidden">
                  {/* Sidebar Regions */}
                  <div className="w-72 bg-gray-50 flex flex-col py-4 border-r border-gray-100">
                    {nepalTrekkingTabs.map((region: any, idx: number) => {
                      const Icon = iconMap[region.iconName] || Mountain;
                      const isActive = activeTrekkingTabIdx === idx;
                      return (
                        <div 
                          key={region.slug}
                          onMouseEnter={() => setActiveTrekkingTabIdx(idx)}
                          className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${isActive ? 'bg-white text-[#112233] border-l-4 border-l-accent-amber font-extrabold shadow-sm relative -mr-[1px]' : 'text-gray-600 hover:text-[#112233] hover:bg-gray-100 font-semibold border-l-4 border-l-transparent'}`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? 'text-accent-amber' : 'text-gray-400'}`} />
                          <span className="text-[14px] normal-case tracking-normal">{region.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-8 bg-white flex flex-col">
                    {nepalTrekkingTabs[activeTrekkingTabIdx] && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-accent-amber">
                            <Mountain className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#112233]/50 uppercase tracking-widest mb-1">Featured {nepalTrekkingTabs[activeTrekkingTabIdx].name.split(' ')[0]} Trips</div>
                            <h3 className="text-2xl font-bold text-[#112233] normal-case tracking-tight">Handpicked adventures in the {nepalTrekkingTabs[activeTrekkingTabIdx].name.split(' ')[0]} region</h3>
                          </div>
                        </div>

                        {/* Treks Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                          {nepalTrekkingTabs[activeTrekkingTabIdx].treks.map((trek: any) => (
                            <Link key={trek.slug} href={`/trekking/${trek.slug}`} onClick={closeDesktopMenu} className="flex items-center justify-between group p-3 rounded-xl border border-gray-100 hover:border-[#112233]/20 hover:shadow-sm transition-all bg-white">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <Footprints className="w-4 h-4 text-[#112233]/40 group-hover:text-accent-amber shrink-0" />
                                <span className="text-[14px] font-bold text-[#112233] truncate normal-case tracking-normal group-hover:text-accent-amber transition-colors">{trek.title} - {trek.durationDays}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent-amber shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. NEPAL TOURS */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => { setActiveDropdown('tours'); setActiveToursTabIdx(0); }}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <Link href="/tour-destination/nepal" className="uppercase">Tours in Nepal</Link>
                <ChevronDown className="w-4 h-4" />
              </div>

              {activeDropdown === 'tours' && (
                <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[1100px] bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 flex overflow-hidden text-[#112233]">
                  {/* Sidebar Tabs */}
                  <div className="w-[300px] bg-gray-50 flex flex-col py-4 border-r border-gray-100 shrink-0">
                    {nepalToursTabs?.map((tab: any, idx: number) => {
                      const isActive = activeToursTabIdx === idx;
                      return (
                        <div 
                          key={tab.slug}
                          onMouseEnter={() => setActiveToursTabIdx(idx)}
                          className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${isActive ? 'bg-white text-[#112233] border-l-4 border-l-accent-amber font-extrabold shadow-sm relative -mr-[1px]' : 'text-gray-500 hover:bg-gray-100 hover:text-[#112233] font-bold border-l-4 border-l-transparent'}`}
                        >
                          <Sun className={`w-5 h-5 ${isActive ? 'text-accent-amber' : 'text-gray-400'}`} />
                          <span className="text-[14px] normal-case tracking-normal">{tab.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-8 bg-white flex flex-col min-h-[400px]">
                    {nepalToursTabs && nepalToursTabs[activeToursTabIdx] && (
                      <div key={activeToursTabIdx} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-accent-amber">
                            <Sun className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#112233]/50 uppercase tracking-widest mb-1">Featured Tours</div>
                            <h3 className="text-2xl font-bold text-[#112233] normal-case tracking-tight">Handpicked {nepalToursTabs[activeToursTabIdx].name.toLowerCase()}</h3>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                          {nepalToursTabs[activeToursTabIdx].tours?.length > 0 ? (
                            nepalToursTabs[activeToursTabIdx].tours.map((tour: any) => (
                              <Link key={tour.slug} href={`/tour/${tour.slug}`} onClick={closeDesktopMenu} className="flex items-center justify-between group p-3 rounded-xl border border-gray-100 hover:border-[#112233]/20 hover:shadow-sm transition-all bg-white">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <Footprints className="w-4 h-4 text-[#112233]/40 group-hover:text-accent-amber shrink-0" />
                                  <span className="text-[14px] font-bold text-[#112233] truncate normal-case tracking-normal group-hover:text-accent-amber transition-colors">{tour.title} - {tour.durationDays}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent-amber shrink-0" />
                              </Link>
                            ))
                          ) : (
                            <div className="text-gray-400 italic text-sm py-4">No packages found for this category yet.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. TIBET & BHUTAN */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => { setActiveDropdown('tibet-bhutan'); setActiveTibetBhutanTabIdx(0); }}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <span className="uppercase">Tibet & Bhutan</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {activeDropdown === 'tibet-bhutan' && (
                <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[1100px] bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 flex overflow-hidden text-[#112233]">
                  
                  {/* Sidebar Tabs */}
                  <div className="w-[300px] bg-gray-50 flex flex-col py-4 border-r border-gray-100">
                    {tibetBhutanMenu.map((tab: any, idx: number) => {
                      const isActive = activeTibetBhutanTabIdx === idx;
                      return (
                        <div 
                          key={tab.name}
                          onMouseEnter={() => setActiveTibetBhutanTabIdx(idx)}
                          className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${isActive ? 'bg-white text-[#112233] border-l-4 border-l-accent-amber font-extrabold shadow-sm relative -mr-[1px]' : 'text-gray-600 hover:text-[#112233] hover:bg-gray-100 font-semibold border-l-4 border-l-transparent'}`}
                        >
                          <span className="text-[14px] normal-case tracking-normal">{tab.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-8 bg-white flex flex-col">
                    {tibetBhutanMenu[activeTibetBhutanTabIdx] && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-accent-amber">
                            <Mountain className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#112233]/50 uppercase tracking-widest mb-1">Featured {tibetBhutanMenu[activeTibetBhutanTabIdx].name}</div>
                            <h3 className="text-2xl font-bold text-[#112233] normal-case tracking-tight">Handpicked {tibetBhutanMenu[activeTibetBhutanTabIdx].name.toLowerCase()}</h3>
                          </div>
                        </div>

                        {/* Grid */}
                        {tibetBhutanMenu[activeTibetBhutanTabIdx].items.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                            {tibetBhutanMenu[activeTibetBhutanTabIdx].items.map((item: any) => (
                              <Link key={item.slug} href={`/tour/${item.slug}`} onClick={closeDesktopMenu} className="flex items-center justify-between group p-3 rounded-xl border border-gray-100 hover:border-[#112233]/20 hover:shadow-sm transition-all bg-white">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <Footprints className="w-4 h-4 text-[#112233]/40 group-hover:text-accent-amber shrink-0" />
                                  <span className="text-[14px] font-bold text-[#112233] truncate normal-case tracking-normal group-hover:text-accent-amber transition-colors">{item.title} - {item.durationDays}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent-amber shrink-0" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 italic text-sm py-4">No packages found for this category yet.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 5. ABOUT US */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <span className="uppercase">About Us</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {activeDropdown === 'about' && (
                <div className="absolute top-[80px] left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-4 duration-200">
                  <Link href="/about" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-[#112233] font-bold hover:text-accent-amber hover:bg-gray-50 transition-colors normal-case">
                    About Us
                  </Link>
                  <Link href="/message-from-founder" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-[#112233] font-bold hover:text-accent-amber hover:bg-gray-50 transition-colors normal-case">
                    Message from Founder
                  </Link>
                  <Link href="/our-team" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-[#112233] font-bold hover:text-accent-amber hover:bg-gray-50 transition-colors normal-case">
                    Our Team
                  </Link>
                  <Link href="/why-choose-us" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-[#112233] font-bold hover:text-accent-amber hover:bg-gray-50 transition-colors normal-case">
                    Why Choose Us
                  </Link>
                  <Link href="/legal-documents" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-[#112233] font-bold hover:text-accent-amber hover:bg-gray-50 transition-colors normal-case">
                    Legal Documents
                  </Link>
                  <Link href="/terms" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-[#112233] font-bold hover:text-accent-amber hover:bg-gray-50 transition-colors normal-case">
                    Terms & Conditions
                  </Link>
                  <Link href="/reviews" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-[#112233] font-bold hover:text-accent-amber hover:bg-gray-50 transition-colors normal-case">
                    Reviews
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/blog" className="hover:text-accent-amber transition-colors uppercase">Blog</Link>
            <Link href="/contact-us" className="hover:text-accent-amber transition-colors uppercase">Contact</Link>
            
            <button 
              aria-label="Search" 
              onClick={() => setSearchModalOpen(true)}
              className="ml-2 p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-white"
            >
              <Search className="w-5 h-5 hover:text-accent-amber transition-colors" />
            </button>
          </div>
        </div>

        {/* MOBILE TOP BAR */}
        <div className="lg:hidden flex items-center justify-between px-5 h-16 bg-[#112233] shadow-sm border-b border-[#1f3045]">
          <Link href="/">
            <img src={logoImage || "/logo.png"} alt="Logo" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4 text-white">
            <button 
              aria-label="Search" 
              onClick={() => setSearchModalOpen(true)} 
              className="p-1 cursor-pointer"
            >
              <Search className="w-6 h-6 hover:text-accent-amber transition-colors" />
            </button>
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
              
              {/* 1. NEPAL */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileSection('nepal')} 
                  className={`flex items-center justify-between w-full px-6 py-5 font-bold text-[16px] ${expandedMobileSection === 'nepal' ? 'text-[#1e857c]' : 'text-[#112233]'}`}
                >
                  <div className="flex items-center gap-4"><Mountain className="w-5 h-5"/> Nepal</div>
                  {expandedMobileSection === 'nepal' 
                    ? <div className="w-7 h-7 rounded-full border border-[#1e857c] flex items-center justify-center"><ChevronUp className="w-5 h-5" /></div>
                    : <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <AnimatePresence>
                  {expandedMobileSection === 'nepal' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50">
                      <div className="px-6 py-4 flex flex-col">
                        <div className="border-l-2 border-[#1e857c] ml-2 pl-6 flex flex-col gap-4">
                          <Link href="/trekking" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Trekking in Nepal</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/tour-destination/nepal" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Tours in Nepal</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/peak-climbing" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Peak Climbing</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/helicopter-tour" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Helicopter Tours</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/wildlife-safari" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Wildlife Safari</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/rafting" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Rafting</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/bungee-jump" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Bungee Jump</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/mountain-flight" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Mountain Flight</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/day-tour" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Day Tours</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. NEPAL TREKKING */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileSection('trekking')} 
                  className={`flex items-center justify-between w-full px-6 py-5 font-bold text-[16px] ${expandedMobileSection === 'trekking' ? 'text-[#1e857c]' : 'text-[#112233]'}`}
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
                          {nepalTrekkingTabs.map((region: any) => (
                            <Link key={region.slug} href={region.href} className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
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

              {/* 3. TOURS IN NEPAL */}
              <Link href="/tour-destination/nepal" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-4"><Sun className="w-5 h-5"/> Tours in Nepal</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              {/* 4. TIBET & BHUTAN */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileSection('tibet-bhutan')} 
                  className={`flex items-center justify-between w-full px-6 py-5 font-bold text-[16px] ${expandedMobileSection === 'tibet-bhutan' ? 'text-[#1e857c]' : 'text-[#112233]'}`}
                >
                  <div className="flex items-center gap-4"><Compass className="w-5 h-5"/> Tibet & Bhutan</div>
                  {expandedMobileSection === 'tibet-bhutan' 
                    ? <div className="w-7 h-7 rounded-full border border-[#1e857c] flex items-center justify-center"><ChevronUp className="w-5 h-5" /></div>
                    : <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <AnimatePresence>
                  {expandedMobileSection === 'tibet-bhutan' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50">
                      <div className="px-6 py-4 flex flex-col">
                        <div className="border-l-2 border-[#1e857c] ml-2 pl-6 flex flex-col gap-4">
                          <Link href="/tour-destination/tibet" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Tibet Tours</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/tour-destination/bhutan" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Bhutan Tours</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. ABOUT US */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileSection('about')} 
                  className={`flex items-center justify-between w-full px-6 py-5 font-bold text-[16px] ${expandedMobileSection === 'about' ? 'text-[#1e857c]' : 'text-[#112233]'}`}
                >
                  <div className="flex items-center gap-4"><Users className="w-5 h-5"/> About Us</div>
                  {expandedMobileSection === 'about' 
                    ? <div className="w-7 h-7 rounded-full border border-[#1e857c] flex items-center justify-center"><ChevronUp className="w-5 h-5" /></div>
                    : <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <AnimatePresence>
                  {expandedMobileSection === 'about' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50">
                      <div className="px-6 py-4 flex flex-col">
                        <div className="border-l-2 border-[#1e857c] ml-2 pl-6 flex flex-col gap-4">
                          <Link href="/about" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> About Us</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/message-from-founder" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Message from Founder</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/our-team" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Our Team</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/why-choose-us" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Why Choose Us</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/legal-documents" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Legal Documents</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/terms" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Terms & Conditions</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/reviews" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]" onClick={() => setMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Reviews</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* 6. BLOG */}
              <Link href="/blog" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-4"><Map className="w-5 h-5"/> Blog</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              
              {/* 7. CONTACT US */}
              <Link href="/contact-us" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-4"><MessageCircle className="w-5 h-5"/> Contact Us</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

            </div>

            <div className="px-6 py-8 mt-auto flex flex-col items-center">
              <Link href="/contact-us" className="w-full bg-[#056d81] hover:bg-[#04596b] text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 text-lg shadow-lg" onClick={() => setMobileMenuOpen(false)}>
                <Navigation className="w-5 h-5" /> Plan a Trip
              </Link>

              <div className="w-full flex flex-col gap-4 mt-8 text-[#112233]">
                <a href={`tel:${settings?.emergencyPhone || '+977 9851 234567'}`} className="flex items-center gap-4 text-[15px] font-semibold">
                  <MessageCircle className="w-6 h-6 text-[#1e857c]" /> {settings?.emergencyPhone || '+977 9851 234567'}
                </a>
                <a href={`mailto:${settings?.email || 'info@everpeaknepal.com'}`} className="flex items-center gap-4 text-[15px] font-semibold">
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

      {/* QUICK SEARCH MODAL */}
      <QuickSearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </>
  );
}
