import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function AdminCard({ children, className = '', noPadding = false }: AdminCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className={noPadding ? '' : 'p-4 md:p-6'}>
        {children}
      </div>
    </div>
  );
}
