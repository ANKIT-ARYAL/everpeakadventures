import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface AddNewButtonProps {
  href: string;
  label?: string;
}

export default function AddNewButton({ href, label = 'Add New' }: AddNewButtonProps) {
  return (
    <Link 
      href={href}
      className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors uppercase tracking-wider"
    >
      <Plus className="w-4 h-4" /> {label}
    </Link>
  );
}