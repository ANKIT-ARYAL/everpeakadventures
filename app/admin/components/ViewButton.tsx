import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface ViewButtonProps {
  href: string;
  title?: string;
}

export default function ViewButton({ href, title = 'View on site' }: ViewButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
    >
      <ExternalLink className="w-3.5 h-3.5" />
    </Link>
  );
}