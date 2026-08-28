import React from 'react';
import AdminPageLayout from './components/AdminPageLayout';

export default function AdminLoading() {
  return (
    <AdminPageLayout title="Loading..." description="Please wait while we fetch your data.">
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium text-sm animate-pulse">Loading data...</p>
        </div>
      </div>
    </AdminPageLayout>
  );
}
