import TourPackagesWrapper from "@/app/components/wrappers/TourPackagesWrapper";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default function Page({ searchParams }: PageProps)  {
  return <TourPackagesWrapper searchParams={searchParams} />;
}