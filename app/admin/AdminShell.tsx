'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './components/LogoutButton';
import BookingsNotification from './components/BookingsNotification';
import { AdminPermsProvider } from './AdminPermsContext';
import {
  LayoutDashboard, Compass, Tags, Package, Briefcase, FileStack, Bell,
  HelpCircle, Users, BookOpen, Images, ShieldCheck, Menu, X, ChevronLeft, ChevronRight,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  color: string;
  perm: string;
}

interface AdminShellProps {
  name: string;
  username: string;
  role: string | null;
  isSuperAdmin: boolean;
  permissions: string[];
  children: React.ReactNode;
  logoImage?: string;
}

export default function AdminShell({
  name,
  username,
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

  const navItems: NavItem[] = [
    { href: '/admin/treks', label: 'Treks', icon: Compass, color: 'text-[#24a0ed]', perm: 'treks:view' },
    { href: '/admin/trek-categories', label: 'Trekking Categories', icon: Tags, color: 'text-emerald-400', perm: 'trek-categories:view' },
    { href: '/admin/tours', label: 'Tours', icon: Package, color: 'text-[#24a0ed]', perm: 'tours:view' },
    { href: '/admin/tour-categories', label: 'Tour Categories', icon: Tags, color: 'text-emerald-400', perm: 'tour-categories:view' },
    { href: '/admin/departures', label: 'Fixed Departures', icon: Briefcase, color: 'text-[#24a0ed]', perm: 'departures:view' },
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'text-[#f59e0b]', perm: 'dashboard:view' },
    { href: '/admin/pages', label: 'All Pages', icon: FileStack, color: 'text-indigo-400', perm: 'pages:view' },
    { href: '/admin/blogs', label: 'Blog Posts', icon: BookOpen, color: 'text-emerald-400', perm: 'blogs:view' },
    { href: '/admin/faqs', label: 'All FAQs', icon: HelpCircle, color: 'text-rose-400', perm: 'faqs:view' },
    { href: '/admin/media', label: 'Media Gallery', icon: Images, color: 'text-pink-400', perm: 'media:view' },
    { href: '/admin/users', label: 'Users', icon: Users, color: 'text-emerald-400', perm: 'users:view' },
    { href: '/admin/roles', label: 'Roles', icon: ShieldCheck, color: 'text-emerald-400', perm: 'roles:view' },
  ];

  const filteredNav = navItems.filter((item) => can(item.perm));
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
      } ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
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
              <Link href="/admin" className="font-bold text-white tracking-wider flex items-center gap-2">
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

      {/* Signed-in user chip */}
      {mounted && (
        <div className={`px-4 py-3 border-b border-white/10 flex items-center gap-3 ${collapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-[#24a0ed] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {initials || '•'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-200 truncate">{displayName}</p>
              <p className="text-[11px] text-gray-500 truncate">{roleLabel || username}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation links */}
      <div className={`flex-1 py-4 space-y-1 ${collapsed ? 'px-1' : ''}`}>
        {showBookings && <BookingsNotification collapsed={collapsed} />}
        {filteredNav.map((item) => renderNavItem(item))}

        <div className="pt-4 border-t border-white/10 mt-4">
          <LogoutButton collapsed={collapsed} />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-gray-800 admin-panel">

      {/* Sidebar - fixed on desktop, drawer on mobile */}
      <aside className={`bg-[#101b25] text-gray-300 flex-col fixed inset-y-0 left-0 z-50 overflow-y-auto pb-10 hidden lg:flex transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
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
      <aside className={`w-64 bg-[#101b25] text-gray-300 flex-col inset-y-0 left-0 z-50 overflow-y-auto pb-10 fixed transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
          <img
            src={logoImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"}
            alt="Ever Peak Adventures"
            className="h-8 w-auto object-contain"
          />
        </div>
        <AdminPermsProvider value={{ isSuperAdmin, permissions }}>
          {children}
        </AdminPermsProvider>
      </main>

    </div>
  );
}