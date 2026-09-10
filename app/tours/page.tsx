import { Suspense } from "react";
import TourPackagesWrapper from "@/app/components/wrappers/TourPackagesWrapper";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading tours...</div>}>
      <TourPackagesWrapper searchParams={searchParams} />
    </Suspense>
  );
}
