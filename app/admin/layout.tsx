'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './components/LogoutButton';
import { 
  LayoutDashboard, Compass, Layers, FileText, MessageSquare, 
  HelpCircle, Image as ImageIcon, Shield, Users, Database, 
  Settings, ArrowLeft, Video, Mail, FileCheck, Layers3, Briefcase, Sparkles
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-gray-800">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-gray-800">
      
      {/* Sidebar (Includes every model from schema) */}
      <aside className="w-64 bg-[#101b25] text-gray-300 flex flex-col fixed inset-y-0 left-0 z-50 overflow-y-auto text-xs pb-10">
        
        {/* Brand Header */}
        <div className="p-4 bg-[#0b131a] border-b border-white/10 flex items-center justify-between sticky top-0 z-10 bg-[#101b25]">
          <Link href="/admin" className="font-bold text-white tracking-wider flex items-center gap-2">
            <span className="bg-[#f59e0b] text-[#112233] px-2 py-0.5 rounded text-[10px]">ADMIN</span>
            Ever Peak CMS
          </Link>
          <Link href="/" title="Visit Site" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Links Grouped */}
        <div className="flex-1 py-4 space-y-1">
          
          {/* DASHBOARD */}
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4 text-[#f59e0b]" /> Dashboard
          </Link>

          {/* CORE PACKAGES */}
          <div className="pt-4 px-4 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Core Packages</div>
          <Link href="/admin/treks" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Compass className="w-4 h-4 text-[#24a0ed]" /> Treks
          </Link>
          <Link href="/admin/tours" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Layers className="w-4 h-4 text-[#24a0ed]" /> Tours
          </Link>
          <Link href="/admin/departures" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Briefcase className="w-4 h-4 text-[#24a0ed]" /> Fixed Departures
          </Link>

          {/* CONTENT & ENGAGEMENT */}
          <div className="pt-4 px-4 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Content & Stories</div>
          <Link href="/admin/blogs" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <FileText className="w-4 h-4 text-emerald-400" /> Blog Posts
          </Link>
          <Link href="/admin/testimonials" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4 text-purple-400" /> Testimonials (Reviews)
          </Link>
          <Link href="/admin/faqs" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <HelpCircle className="w-4 h-4 text-rose-400" /> FAQs
          </Link>
          <Link href="/admin/team" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Users className="w-4 h-4 text-cyan-400" /> Team Members
          </Link>

          {/* PAGES & LEGAL */}
          <div className="pt-4 px-4 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pages & Legal</div>
          <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <FileCheck className="w-4 h-4 text-amber-400" /> Dynamic Pages
          </Link>
          <Link href="/admin/legal-documents" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Shield className="w-4 h-4 text-indigo-400" /> Legal Documents
          </Link>

          {/* BANNERS & SECTIONS */}
          <div className="pt-4 px-4 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Banners & Layouts</div>
          <Link href="/admin/hero-content" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <ImageIcon className="w-4 h-4 text-gray-400" /> Hero Banners
          </Link>
          <Link href="/admin/subpage-hero" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Layers3 className="w-4 h-4 text-gray-400" /> Subpage Heroes
          </Link>
          <Link href="/admin/home-section-content" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <ImageIcon className="w-4 h-4 text-gray-400" /> Home Sections
          </Link>
          <Link href="/admin/video-banners" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Video className="w-4 h-4 text-gray-400" /> Video & CTA Banners
          </Link>
          <Link href="/admin/why-choose-us" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Layers3 className="w-4 h-4 text-gray-400" /> Why Choose Us
          </Link>
          <Link href="/admin/welcome-features" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Sparkles className="w-4 h-4 text-gray-400" /> Welcome Features
          </Link>
          <Link href="/admin/trust-items" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Shield className="w-4 h-4 text-gray-400" /> Trust Items & Badges
          </Link>

          {/* SUBMISSIONS & CONFIG */}
          <div className="pt-4 px-4 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">System & Inquiries</div>
          <Link href="/admin/contact-submissions" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Mail className="w-4 h-4 text-yellow-400" /> Contact Submissions
          </Link>
          <Link href="/admin/contact-info" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Settings className="w-4 h-4 text-gray-400" /> Contact Info
          </Link>
          <Link href="/admin/site-settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <Settings className="w-4 h-4 text-gray-400" /> Site Settings
          </Link>
          <Link href="/admin/contact-widget" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4 text-gray-400" /> Contact Widget
          </Link>

          <div className="pt-4 border-t border-white/10 mt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

    </div>
  );
}
