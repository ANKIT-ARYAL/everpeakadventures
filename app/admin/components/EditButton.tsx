"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Edit } from 'lucide-react';
import { useAdminPerms } from '../AdminPermsContext';
import { resolveResourceForPath, hasPerm } from '@/lib/permissions';

interface EditButtonProps {
  href: string;
  resource?: string;
}

export default function EditButton({ href, resource }: EditButtonProps) {
  const pathname = usePathname();
  const { isSuperAdmin, permissions } = useAdminPerms();
  const res = resource ?? (resolveResourceForPath(pathname) ?? '');

  if (!isSuperAdmin && !hasPerm(permissions, res, 'edit')) {
    return null;
  }

  return (
    <Link 
      href={href}
      title="Edit Item"
      aria-label={`Edit ${resource ?? 'item'}`}
      className="inline-flex items-center gap-1 px-3 py-3 sm:px-2 sm:py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
    >
      <Edit className="w-3.5 h-3.5" />
      <span className="hidden md:inline text-xs font-medium">Edit</span>
    </Link>
  );
}