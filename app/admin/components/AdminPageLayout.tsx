import React from "react";

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminPageLayout({
  title,
  description,
  actions,
  children,
}: AdminPageLayoutProps) {
  return (
    // CRITICAL FIX: Removed the extra p-4 md:p-6 lg:p-8 here.
    <div className="w-full flex flex-col gap-4 sm:gap-6 min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4 w-full">
        <div className="space-y-1 max-w-full sm:max-w-[70%] min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 break-words">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-500 break-words">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto justify-start sm:justify-end">
            {actions}
          </div>
        )}
      </div>
      
      <div className="flex-1 w-full min-w-0">
        {children}
      </div>
    </div>
  );
}