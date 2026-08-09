"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useAdminPerms } from '../AdminPermsContext';
import { resolveResourceForPath, hasPerm } from '@/lib/permissions';

interface AddNewButtonProps {
  href: string;
  label?: string;
  resource?: string;
}

export default function AddNewButton({ href, label = 'Add New', resource }: AddNewButtonProps) {
  const pathname = usePathname();
  const { isSuperAdmin, permissions } = useAdminPerms();
  const res = resource ?? (resolveResourceForPath(pathname) ?? '');

  if (!isSuperAdmin && !hasPerm(permissions, res, 'create')) {
    return null;
  }

  return (
    <Link 
      href={href}
      className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider"
    >
      <Plus className="w-4 h-4" /> {label}
    </Link>
  );
}