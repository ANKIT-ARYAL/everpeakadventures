import { prisma } from "@/lib/prisma";
import Navbar from "../layout/Navbar";

export default async function NavbarWrapper() {
  const trekkingRegions = [
    { name: 'Everest Region', href: 'https://everpeakadventures.com/trekking-types/everest-region/' },
    { name: 'Manaslu Region', href: 'https://everpeakadventures.com/trekking-types/manaslu-region/' },
    { name: 'Annapurna Region', href: 'https://everpeakadventures.com/trekking-types/annapurna-region/' },
    { name: 'Langtang Region', href: 'https://everpeakadventures.com/trekking-types/langtang-region/' },
    { name: 'Kanchenjunga Region', href: 'https://everpeakadventures.com/trekking-types/kanchenjunga-region-trekking/' },
    { name: 'Makalu Region', href: 'https://everpeakadventures.com/trekking-types/makalu-region-trekking/' },
    { name: 'Mustang Region', href: 'https://everpeakadventures.com/trekking-types/mustang-region-trekking/' },
    { name: 'Dolpo Region', href: 'https://everpeakadventures.com/trekking-types/dolpo-region-trekking/' },
  ];

  return <Navbar trekkingLinks={trekkingRegions} />;
}