import { prisma } from "@/lib/prisma";
import HeroContent from "./HeroContent";
import HeroMedia from "./HeroMedia";

export default async function Hero() {
  // Fetch hero configuration & trust items dynamically from the database
  const heroData = await prisma.heroContent.findFirst({
    where: { published: true },
  });
  const trustItems = await prisma.trustItem.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  // Fallback defaults if database is empty
  const hero = heroData || {
    topLabel: "Your Adventure, Our Expertise",
    mainHeading: "Explore Nepal. Beyond the peak",
    subtext: "Authentic treks, Trusted guides. Unforgettable experiences.",
    heroMediaType: "youtube",
    heroMediaUrl: "",
    youtubeVideoId: "gCRNEJxDJKM",
    searchPlaceholder: "Search by trek name",
    primaryButtonText: "▲ View Treks",
    primaryButtonLink: "/trekking",
    secondaryButtonText: "Book Now",
    secondaryButtonLink: "/send-inquiry",
  };

  const mediaType = hero.heroMediaType || "youtube";
  const videoId =
    mediaType === "youtube" && hero.youtubeVideoId
      ? hero.youtubeVideoId
      : undefined;
  const mediaUrl =
    mediaType !== "youtube" ? hero.heroMediaUrl : undefined;

  return (
    <section className="relative w-screen h-[90vh] overflow-hidden">

      {/* MEDIA (youtube video | uploaded video | image) */}
      <HeroMedia
        mediaType={(mediaType === "youtube" || mediaType === "video" || mediaType === "image" ? mediaType : "youtube")}
        videoId={videoId}
        mediaUrl={mediaUrl ?? undefined}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

      {/* CONTENT */}
      <HeroContent hero={hero} trustItems={trustItems} />

    </section>
  );
}
