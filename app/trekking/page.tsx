import { Suspense } from "react";
import TrekkingPageWrapper from "@/app/components/wrappers/TrekkingPageWrapper";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading treks...</div>}>
      <TrekkingPageWrapper searchParams={searchParams} />
    </Suspense>
  );
}