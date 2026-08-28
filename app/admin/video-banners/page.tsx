import { prisma } from "@/lib/prisma";
import VideoBannerForm from "./VideoBannerForm";

export const dynamic = 'force-dynamic';

export default async function VideoBannersPage() {
  const [videoBanner, ctaBanner] = await Promise.all([
    prisma.videoBannerContent.findFirst(),
    prisma.ctaBannerContent.findFirst(),
  ]);
  return <VideoBannerForm videoBannerData={videoBanner} ctaBannerData={ctaBanner} />;
}
