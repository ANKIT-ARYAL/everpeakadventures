import { prisma } from "@/lib/prisma";
import HeroContent from "./HeroContent";

export default async function Hero() {
  // Fetch hero configuration & trust items dynamically from the database
  const heroData = await prisma.heroContent.findFirst();
  const trustItems = await prisma.trustItem.findMany({
    orderBy: { order: 'asc' },
  });

  // Fallback defaults if database is empty
  const hero = heroData || {
    topLabel: "Your Adventure, Our Expertise",
    mainHeading: "Explore Nepal. Beyond the peak",
    subtext: "Authentic treks, Trusted guides. Unforgettable experiences.",
    youtubeVideoId: "gCRNEJxDJKM",
    searchPlaceholder: "Search by trek name",
    primaryButtonText: "▲ View Treks",
    primaryButtonLink: "/trekking",
    secondaryButtonText: "Book Now",
    secondaryButtonLink: "/send-inquiry",
  };

  const videoUrl = `https://www.youtube.com/embed/${hero.youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${hero.youtubeVideoId}&playsinline=1&modestbranding=1&rel=0`;

  return (
    <section className="relative w-screen h-[75vh] overflow-hidden">

      {/* VIDEO */}
      <iframe
        className="
          absolute top-1/2 left-1/2
          w-[177.77vh] h-[100vh]
          min-w-full min-h-full
          -translate-x-1/2 -translate-y-1/2
          pointer-events-none
        "
        src={videoUrl}
        allow="autoplay; fullscreen"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/25" />

      {/* CONTENT */}
      <HeroContent hero={hero} trustItems={trustItems} />

    </section>
  );
}
