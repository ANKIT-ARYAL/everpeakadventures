import React from 'react';
import AdminCard from './AdminCard';

interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
}

export default function AdminTable({ children, className = '' }: AdminTableProps) {
  return (
    <AdminCard noPadding className={className}>
      <div className="overflow-x-auto w-full -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full text-left text-sm text-gray-700 min-w-[800px]">
          {children}
        </table>
      </div>
    </AdminCard>
  );
}
