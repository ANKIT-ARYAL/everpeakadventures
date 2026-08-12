'use client';

import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function BookingsNotification({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.bookings)) setCount(data.bookings.length);
      })
      .catch(() => {});
  }, []);

  const base = `flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors ${collapsed ? 'justify-center px-2' : ''}`;

  return (
    <Link href="/admin/bookings" onClick={onNavigate} className={base} title={collapsed ? 'Booking Requests' : undefined}>
      <span className="relative">
        <Bell className="w-4 h-4 text-orange-400" />
        {count !== null && count > 0 && (
          <span className={`absolute ${collapsed ? '-top-1.5 -right-1.5' : '-top-1 -right-2'} bg-orange-500 text-white text-[9px] font-black min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center`}>
            {count}
          </span>
        )}
      </span>
      {!collapsed && <span>Booking Requests</span>}
    </Link>
  );
}