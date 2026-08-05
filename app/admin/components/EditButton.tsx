import React from 'react';
import Link from 'next/link';
import { Edit } from 'lucide-react';

interface EditButtonProps {
  href: string;
}

export default function EditButton({ href }: EditButtonProps) {
  return (
    <Link 
      href={href}
      title="Edit Item"
      className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
    >
      <Edit className="w-3.5 h-3.5" />
    </Link>
  );
}