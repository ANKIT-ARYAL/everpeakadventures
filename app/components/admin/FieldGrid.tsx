'use client';

import React from 'react';

interface Props {
  cols?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}

export default function FieldGrid({ cols = 2, className = '', children }: Props) {
  const colsCls = cols === 4 ? 'lg:grid-cols-4 md:grid-cols-2' : cols === 3 ? 'lg:grid-cols-3 md:grid-cols-2' : 'lg:grid-cols-2';
  return <div className={`grid grid-cols-1 ${colsCls} gap-3 [&>*]:min-w-0 ${className}`}>{children}</div>;
}
