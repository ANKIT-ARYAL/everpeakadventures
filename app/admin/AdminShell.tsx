'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './components/LogoutButton';
import BookingsNotification from './components/BookingsNotification';
import SiteSwitcher from './components/SiteSwitcher';
import { AdminPermsProvider } from './AdminPermsContext';
import {
  LayoutDashboard, Compass, Tags, Package, Briefcase, FileStack,
  HelpCircle, Users, BookOpen, Images, ShieldCheck, Menu, X, ChevronLeft, ChevronRight, Settings, Database, ChevronDown, Search, Server, Backpack
} from 'lucide-react';
import { SITEMAP_SECTIONS, sectionChildren } from '@/lib/sitemap';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  color: string;
  perm: string;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

interface AdminShellProps {
  name: string;
  username: string;
  email: string | null;
  role: string | null;
  isSuperAdmin: boolean;
  permissions: string[];
  children: React.ReactNode;
  logoImage?: string;
}

export default function AdminShell({
  name,
  username,
  email,
  role,
  isSuperAdmin,
  permissions,
  children,
  logoImage,
}: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Dashboard': true,
    'Trekking': true,
    'Tours': true,
    'Content': true,
    'System': true
  });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved !== null) {
      const t = setTimeout(() => setCollapsed(saved === 'true'), 0);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin-sidebar-collapsed', String(collapsed));
    }
  }, [collapsed, mounted]);


  const can = (perm: string) => isSuperAdmin || permissions.includes(perm);

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const navGroups: NavGroup[] = [
    {
      name: 'Dashboard',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'text-[#f59e0b]', perm: 'dashboard:view' },
      ]
    },
    {
      name: 'Trekking',
      items: [
        { href: '/admin/treks', label: 'Treks', icon: Compass, color: 'text-[#24a0ed]', perm: 'treks:view' },
        { href: '/admin/trek-categories', label: 'Trekking Categories', icon: Tags, color: 'text-emerald-400', perm: 'trek-categories:view' },
        { href: '/admin/packing-list', label: 'Packing List', icon: Backpack, color: 'text-rose-400', perm: 'treks:view' },
      ]
    },
    {
      name: 'Tours',
      items: [
        { href: '/admin/tours', label: 'Tours', icon: Package, color: 'text-[#24a0ed]', perm: 'tours:view' },
        { href: '/admin/tour-categories', label: 'Tour Categories', icon: Tags, color: 'text-emerald-400', perm: 'tour-categories:view' },
        { href: '/admin/departures', label: 'Fixed Departures', icon: Briefcase, color: 'text-[#24a0ed]', perm: 'departures:view' },
      ]
    },
    {
      name: 'Content',
      items: [
        { href: '/admin/pages', label: 'All Pages', icon: FileStack, color: 'text-indigo-400', perm: 'pages:view' },
        { href: '/admin/activities', label: 'Activities', icon: Compass, color: 'text-indigo-400', perm: 'pages:view' },
        { href: '/admin/blogs', label: 'Blog Posts', icon: BookOpen, color: 'text-emerald-400', perm: 'blogs:view' },
        { href: '/admin/faqs', label: 'All FAQs', icon: HelpCircle, color: 'text-rose-400', perm: 'faqs:view' },
        { href: '/admin/media', label: 'Media Gallery', icon: Images, color: 'text-pink-400', perm: 'media:view' },
      ]
    },
    {
      name: 'System',
      items: [
        { href: '/admin/users', label: 'Users', icon: Users, color: 'text-emerald-400', perm: 'users:view' },
        { href: '/admin/roles', label: 'Roles', icon: ShieldCheck, color: 'text-emerald-400', perm: 'roles:view' },
        { href: '/admin/site-settings', label: 'Site Settings', icon: Settings, color: 'text-gray-400', perm: 'site-settings:view' },
        { href: '/admin/import', label: 'Data Import', icon: Database, color: 'text-gray-400', perm: 'site-settings:view' },
        ...(isSuperAdmin ? [{ href: '/admin/sites', label: 'Sites & Databases', icon: Server, color: 'text-purple-400', perm: 'dashboard:view' }] : [])
      ]
    }
  ];

  const showBookings = can('bookings:view');

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'));

  const displayName = name?.trim() || username || 'Admin';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const roleLabel = isSuperAdmin ? 'Super Admin' : role || '';

  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-3 rounded-lg mx-1 hover:bg-white/5 hover:text-white transition-colors ${
        isActive(item.href) ? 'bg-white/10 text-white font-semibold' : ''
      } ${collapsed ? 'justify-center px-2 py-2.5 mb-1' : 'px-3 py-2.5 mb-1'}`}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
      {!collapsed && <span className="text-sm truncate">{item.label}</span>}
    </Link>
  );

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
              <Link href="/admin" onClick={() => setSidebarOpen(false)} className="font-bold text-white tracking-wider flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"}
                  alt="Ever Peak Adventures"
                  className="h-9 w-auto object-contain"
                />
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

      {/* Navigation links */}
      <div className={`flex-1 py-4 space-y-4 ${collapsed ? 'px-1' : 'px-2'}`}>
        {showBookings && <BookingsNotification collapsed={collapsed} onNavigate={() => setSidebarOpen(false)} />}
        
        {navGroups.map((group) => {
          const groupItems = group.items.filter(item => can(item.perm));
          if (groupItems.length === 0) return null;
          
          return (
            <div key={group.name} className="mb-4">
              {!collapsed && (
                <button 
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between px-3 py-1 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
                >
                  <span>{group.name}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openGroups[group.name] ? 'rotate-180' : ''}`} />
                </button>
              )}
              {collapsed && (
                <div className="flex justify-center mb-2">
                   <div className="w-6 h-px bg-white/10"></div>
                </div>
              )}
              
              <div className={`${!collapsed && !openGroups[group.name] ? 'hidden' : 'block'}`}>
                {groupItems.map(item => renderNavItem(item))}
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-white/10 mt-4 space-y-1">
          <Link
            href="/admin/profile"
            className={`flex items-center gap-3 rounded-lg mx-1 hover:bg-white/5 hover:text-white transition-colors text-gray-300 ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
            title={collapsed ? 'My Profile' : undefined}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full border-2 border-gray-400"></span>
            </div>
            {!collapsed && <span className="text-sm truncate">My Profile</span>}
          </Link>
          <LogoutButton collapsed={collapsed} />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f0f2f5] flex font-sans text-gray-800 admin-panel">

      {/* Sidebar - sticky on desktop, drawer on mobile */}
      <aside className={`bg-[#101b25] text-gray-300 flex-col sticky top-0 h-screen z-40 overflow-y-auto hidden lg:flex transition-all duration-300 shrink-0 ${collapsed ? 'w-16' : 'w-64 lg:w-64 xl:w-72 2xl:w-80'}`}>
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
      <aside className={`w-full max-w-64 bg-[#101b25] text-gray-300 flex-col inset-y-0 left-0 z-50 overflow-y-auto fixed transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {renderNav()}
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0 min-w-0">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex relative items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-72 lg:w-80 xl:w-96 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all border border-transparent focus-within:border-blue-300 min-w-0">
               <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0"/>
               <input 
                 type="text" 
                 placeholder="Search admin..." 
                 className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 min-w-0" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               
               {searchQuery.trim().length > 0 && (() => {
                 const allLinks: any[] = [];
                 
                 navGroups.forEach(g => {
                   g.items.forEach(item => {
                     allLinks.push({ ...item, groupName: g.name });
                   });
                 });
                 
                 SITEMAP_SECTIONS.forEach(section => {
                   const children = sectionChildren(section);
                   children.forEach(child => {
                     if (!allLinks.some(l => l.href === child.href)) {
                       allLinks.push({
                         href: child.href,
                         label: child.label,
                         icon: FileStack,
                         color: 'text-indigo-400',
                         perm: child.perm,
                         groupName: section.label
                       });
                     }
                   });
                 });
                 
                 const filteredLinks = allLinks.filter(item => 
                   can(item.perm) && 
                   (item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.groupName.toLowerCase().includes(searchQuery.toLowerCase()))
                 );

                 return (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-2 max-h-96 overflow-y-auto z-50 flex flex-col gap-2">
                   <div>
                     <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-1">Admin Pages</div>
                     {filteredLinks.length === 0 ? (
                       <div className="p-2 text-xs text-gray-400">No pages found.</div>
                     ) : (
                       filteredLinks.map((item, idx) => (
                         <Link 
                           key={`nav-${item.href}-${idx}`}
                           href={item.href}
                           onClick={() => setSearchQuery('')}
                           className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                         >
                           <div className={`p-1.5 rounded-md bg-gray-50 ${item.color}`}>
                             <item.icon className="w-4 h-4" />
                           </div>
                           <div>
                             <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                             <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.groupName}</div>
                           </div>
                         </Link>
                       ))
                     )}
                   </div>
                 </div>
                 );
               })()}
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
             {isSuperAdmin && <SiteSwitcher />}
             
             {mounted && (
               <div className="flex items-center gap-2 border-l border-gray-200 pl-4 ml-1">
                 <div className="hidden sm:block text-right">
                   <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                   <p className="text-[11px] text-gray-500">{roleLabel || username}</p>
                 </div>
                 <Link href="/admin/profile" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#24a0ed] text-white text-sm font-bold flex items-center justify-center shrink-0 hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer">
                   {initials || '•'}
                 </Link>
               </div>
             )}
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 xl:p-10 flex-1 site-container min-w-0 w-full">
          {!email && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="bg-amber-200 text-amber-900 w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">!</span>
                <div>
                  <p className="font-bold text-lg">Recovery email not set</p>
                  <p className="text-md text-amber-700">Please set a recovery email in your profile to secure your account and enable password resets.</p>
                </div>
              </div>
              <Link href="/admin/profile" className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-lg text-md transition-colors shrink-0 whitespace-nowrap">
                Update Profile
              </Link>
            </div>
          )}
          
          <AdminPermsProvider value={{ isSuperAdmin, permissions }}>
            {children}
          </AdminPermsProvider>
        </div>
      </main>
    </div>
  );
}
