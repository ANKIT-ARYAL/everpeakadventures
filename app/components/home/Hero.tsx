import { prisma } from "@/lib/prisma";
import HeroContent from "./HeroContent";
import HeroSearchBar from "./HeroSearchBar";
import HeroMedia from "./HeroMedia";

export default async function Hero() {
  // Fetch hero configuration dynamically from the database
  const heroData = await prisma.heroContent.findFirst({
    where: { published: true },
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
    <>
      <section className="relative w-full h-[80vh] min-h-[500px] max-h-[800px] xl:max-h-[700px] overflow-hidden flex flex-col justify-center pt-28 pb-20">
        {/* MEDIA (youtube video | uploaded video | image) */}
        <HeroMedia
          mediaType={(mediaType === "youtube" || mediaType === "video" || mediaType === "image" ? mediaType : "youtube")}
          videoId={videoId}
          mediaUrl={mediaUrl ?? undefined}
        />

        {/* OVERLAY: Gradient from bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* OVERLAY: Gradient from top for navbar legibility */}
        <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />

        {/* CONTENT */}
        <HeroContent hero={hero} />
      </section>

      {/* MODERN SEARCH FUNCTIONALITY - Floating Pill Design */}
      <HeroSearchBar />
    </>
  );
}
