import { prisma } from "@/lib/prisma";
import Navbar from "../layout/Navbar";

export default async function NavbarWrapper() {
  const settings = await prisma.siteSettings.findFirst();
  const trekkingRegions = [
    { name: 'Everest Region', href: '/trekking-types/everest-region' },
    { name: 'Manaslu Region', href: '/trekking-types/manaslu-region' },
    { name: 'Annapurna Region', href: '/trekking-types/annapurna-region' },
    { name: 'Langtang Region', href: '/trekking-types/langtang-region' },
    { name: 'Kanchenjunga Region', href: '/trekking-types/kanchenjunga-region-trekking' },
    { name: 'Makalu Region', href: '/trekking-types/makalu-region-trekking' },
    { name: 'Mustang Region', href: '/trekking-types/mustang-region-trekking' },
    { name: 'Dolpo Region', href: '/trekking-types/dolpo-region-trekking' },
  ];

  return <Navbar trekkingLinks={trekkingRegions} logoImage={settings?.logoImage ?? undefined} />;
}