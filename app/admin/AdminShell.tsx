'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './components/LogoutButton';
import BookingsNotification from './components/BookingsNotification';
import { AdminPermsProvider } from './AdminPermsContext';
import { 
  LayoutDashboard, Compass, Layers, FileText, MessageSquare, 
  HelpCircle, Image as ImageIcon, Shield, Users, Database, 
  Settings, Video, Mail, FileCheck, Layers3, Briefcase, Sparkles, Menu, X, ChevronLeft, ChevronRight, Home, Info, MapPin, Package, BookOpen, MessageCircle, ChevronDown, ShieldCheck
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  color: string;
  perm: string;
}

interface NavGroup {
  label: string;
  icon: any;
  items: NavItem[];
}

interface AdminShellProps {
  username: string;
  role: string | null;
  isSuperAdmin: boolean;
  permissions: string[];
  children: React.ReactNode;
}

export default function AdminShell({
  username,
  role,
  isSuperAdmin,
  permissions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [groupCollapsed, setGroupCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => setMounted(true), []);

  // Handle sidebar collapse persistence
  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin-sidebar-collapsed', String(collapsed));
    }
  }, [collapsed, mounted]);

  const can = (perm: string) => isSuperAdmin || permissions.includes(perm);

  const navGroups: NavGroup[] = [
    {
      label: 'Home',
      icon: Home,
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'text-[#f59e0b]', perm: 'dashboard:view' },
        { href: '/admin/hero-content', label: 'Hero Banners', icon: ImageIcon, color: 'text-gray-400', perm: 'hero-content:view' },
        { href: '/admin/home-section-content', label: 'Home Sections', icon: ImageIcon, color: 'text-gray-400', perm: 'home-section-content:view' },
        { href: '/admin/video-banners', label: 'Video & CTA Banners', icon: Video, color: 'text-gray-400', perm: 'video-banners:view' },
        { href: '/admin/welcome-features', label: 'Welcome Features', icon: Sparkles, color: 'text-gray-400', perm: 'welcome-features:view' },
      ]
    },
    {
      label: 'About Us',
      icon: Info,
      items: [
        { href: '/admin/about-content', label: 'About Page Content', icon: FileText, color: 'text-blue-400', perm: 'about-content:view' },
        { href: '/admin/director-message', label: 'Message From Founder', icon: MessageSquare, color: 'text-blue-400', perm: 'director-message:view' },
        { href: '/admin/why-page', label: 'Why Ever Peak', icon: HelpCircle, color: 'text-blue-400', perm: 'why-page:view' },
        { href: '/admin/responsible-travel', label: 'Responsible Travel', icon: Shield, color: 'text-emerald-400', perm: 'responsible-travel:view' },
        { href: '/admin/why-choose-us', label: 'Why Choose Us', icon: Layers3, color: 'text-gray-400', perm: 'why-choose-us:view' },
        { href: '/admin/trust-items', label: 'Trust Items & Badges', icon: Shield, color: 'text-gray-400', perm: 'trust-items:view' },
        { href: '/admin/team', label: 'Team Members', icon: Users, color: 'text-cyan-400', perm: 'team:view' },
        { href: '/admin/testimonials', label: 'Testimonials (Reviews)', icon: MessageSquare, color: 'text-purple-400', perm: 'testimonials:view' },
      ]
    },
    {
      label: 'Trekking In Nepal',
      icon: MapPin,
      items: [
        { href: '/admin/treks', label: 'Treks', icon: Compass, color: 'text-[#24a0ed]', perm: 'treks:view' },
      ]
    },
    {
      label: 'Tour Packages',
      icon: Package,
      items: [
        { href: '/admin/tours', label: 'Tours', icon: Layers, color: 'text-[#24a0ed]', perm: 'tours:view' },
        { href: '/admin/departures', label: 'Fixed Departures', icon: Briefcase, color: 'text-[#24a0ed]', perm: 'departures:view' },
      ]
    },
    {
      label: 'FAQ',
      icon: HelpCircle,
      items: [
        { href: '/admin/faqs', label: 'All FAQs', icon: HelpCircle, color: 'text-rose-400', perm: 'faqs:view' },
      ]
    },
    {
      label: 'Blogs',
      icon: BookOpen,
      items: [
        { href: '/admin/blogs', label: 'Blog Posts', icon: FileText, color: 'text-emerald-400', perm: 'blogs:view' },
      ]
    },
    {
      label: 'Contact Us',
      icon: MessageCircle,
      items: [
        { href: '/admin/contact-info', label: 'Contact Info', icon: Settings, color: 'text-gray-400', perm: 'contact-info:view' },
        { href: '/admin/contact-widget', label: 'Contact Widget', icon: MessageSquare, color: 'text-gray-400', perm: 'contact-widget:view' },
        { href: '/admin/contact-submissions', label: 'Contact Submissions', icon: Mail, color: 'text-yellow-400', perm: 'contact-submissions:view' },
      ]
    },
    {
      label: 'System',
      icon: Database,
      items: [
        { href: '/admin/site-settings', label: 'Site Settings', icon: Settings, color: 'text-gray-400', perm: 'site-settings:view' },
        { href: '/admin/subpage-hero', label: 'Subpage Heroes', icon: Layers3, color: 'text-gray-400', perm: 'subpage-hero:view' },
        { href: '/admin/terms-page', label: 'Terms & Conditions', icon: FileCheck, color: 'text-indigo-400', perm: 'terms-page:view' },
        { href: '/admin/privacy-policy', label: 'Privacy Policy', icon: FileCheck, color: 'text-indigo-400', perm: 'privacy-policy:view' },
        { href: '/admin/legal-documents', label: 'Legal Documents', icon: Shield, color: 'text-indigo-400', perm: 'legal-documents:view' },
      ]
    },
    {
      label: 'Administration',
      icon: ShieldCheck,
      items: [
        { href: '/admin/users', label: 'Users', icon: Users, color: 'text-emerald-400', perm: 'users:view' },
        { href: '/admin/roles', label: 'Roles', icon: ShieldCheck, color: 'text-emerald-400', perm: 'roles:view' },
      ]
    },
  ];

  const filteredGroups = navGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => can(item.perm)) }))
    .filter((group) => group.items.length > 0);

  const showBookings = can('bookings:view');

  const toggleGroup = (label: string) => {
    setGroupCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNav = () => (
    <>
      {/* Brand Header */}
      <div className="p-4 bg-[#0b131a] border-b border-white/10 flex items-center sticky top-0 z-10 bg-[#101b25]">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mx-auto p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between flex-1 min-w-0">
              <Link href="/admin" className="font-bold text-white tracking-wider flex items-center gap-2">
                <span className="bg-[#f59e0b] text-[#112233] px-2 py-0.5 rounded text-[10px]">ADMIN</span>
                {<span className={mounted ? '' : 'invisible'}>Ever Peak CMS</span>}
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Signed-in user chip */}
      {!collapsed && mounted && (
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-[11px] font-semibold text-gray-300 truncate">{username}</p>
          <p className="text-[10px] text-gray-500 truncate">
            {isSuperAdmin ? 'Super Admin' : role ? `Role: ${role}` : ''}
          </p>
        </div>
      )}

      {/* Navigation Links Grouped */}
      {collapsed ? (
        /* Collapsed: flat list of icon-only items */
        <div className="flex-1 py-4 space-y-1 px-1">
          {filteredGroups
            .flatMap((group) => group.items)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-center px-1 py-2.5 hover:bg-white/5 hover:text-white transition-colors rounded-lg ${pathname === item.href ? 'bg-white/10 text-white' : ''}`}
                title={item.label}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </Link>
            ))}
          {showBookings && <BookingsNotification collapsed={collapsed} />}
          <div className="pt-4 border-t border-white/10 mt-4">
            <LogoutButton collapsed={collapsed} />
          </div>
        </div>
      ) : (
      <div className="flex-1 py-4 space-y-1">
        {filteredGroups.map((group) => (
          <div key={group.label} className="group">
            {/* Group Header with Collapsible */}
            <div className="pt-4 px-4 pb-1">
              <button
                type="button"
                onClick={() => !collapsed && toggleGroup(group.label)}
                className={`w-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors ${collapsed ? 'justify-center px-2' : ''}`}
                disabled={collapsed}
              >
                {!collapsed && <group.icon className="w-3.5 h-3.5 text-gray-400" />}
                {!collapsed && <span>{group.label}</span>}
                {!collapsed && (
                  <ChevronDown className={`w-3 h-3 ml-auto text-gray-400 transition-transform ${groupCollapsed[group.label] ? '-rotate-90' : ''}`} />
                )}
              </button>
            </div>
            
            {/* Group Items */}
            <div className={`overflow-hidden transition-all duration-200 ${!collapsed && !groupCollapsed[group.label] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              {group.items.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setSidebarOpen(false)} 
                  className={`flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors ${pathname === item.href ? 'bg-white/10 text-white' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {!collapsed && <span className="text-xs">{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Bookings Notification */}
        {showBookings && (
          <div className={`${collapsed ? 'pt-4 px-0' : 'pt-4 px-4'} pb-1`}>
            <BookingsNotification collapsed={collapsed} />
          </div>
        )}

        <div className="pt-4 border-t border-white/10 mt-4">
          <LogoutButton collapsed={collapsed} />
        </div>
      </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-gray-800">
      
      {/* Sidebar - fixed on desktop, drawer on mobile */}
      <aside className={`bg-[#101b25] text-gray-300 flex-col fixed inset-y-0 left-0 z-50 overflow-y-auto text-xs pb-10 hidden lg:flex transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        {renderNav()}
      </aside>

      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside className={`w-64 bg-[#101b25] text-gray-300 flex-col inset-y-0 left-0 z-50 overflow-y-auto text-xs pb-10 fixed transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {renderNav()}
      </aside>

      {/* Main Content Viewport */}
      <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button 
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-[#112233] oswald tracking-wide">Ever Peak CMS</span>
        </div>
        <AdminPermsProvider value={{ isSuperAdmin, permissions }}>
          {children}
        </AdminPermsProvider>
      </main>

    </div>
  );
}
