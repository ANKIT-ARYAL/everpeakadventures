'use client';

import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function BookingsNotification() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.bookings)) setCount(data.bookings.length);
      })
      .catch(() => {});
  }, []);

  if (count === null) {
    return (
      <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
        <Bell className="w-4 h-4 text-orange-400" /> Booking Requests
      </Link>
    );
  }

  return (
    <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors">
      <Bell className="w-4 h-4 text-orange-400" /> Booking Requests
      <span className="ml-auto bg-orange-500 text-white text-[10px] font-black min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
        {count}
      </span>
    </Link>
  );
}