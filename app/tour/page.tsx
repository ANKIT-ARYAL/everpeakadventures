import TourPackagesWrapper from "@/app/components/wrappers/TourPackagesWrapper";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default function Page({ searchParams }: PageProps)  {
  return <TourPackagesWrapper searchParams={searchParams} />;
}