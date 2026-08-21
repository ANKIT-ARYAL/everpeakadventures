import Hero from "./components/home/Hero";
import BestSellersWrapper from "./components/wrappers/BestSellersWrapper";
import BlueBannerWrapper from "./components/wrappers/BlueBannerWrapper";
import ClientReviewsWrapper from "./components/wrappers/ClientReviewsWrapper";
import CtaBannerWrapper from "./components/wrappers/CtaBannerWrapper";
import ExploreBlogsWrapper from "./components/wrappers/ExploreBlogsWrapper";
import FeaturedTreksWrapper from "./components/wrappers/FeaturedTreksWrapper";
import FixedDeparturesWrapper from "./components/wrappers/FixedDeparturesWrapper";
import PopularToursWrapper from "./components/wrappers/PopularToursWrapper";
import TrustedPartnerWrapper from "./components/wrappers/TrustedPartnerWrapper";
import VideoBannerWrapper from "./components/wrappers/VideoBannerWrapper";
import WelcomeSectionWrapper from "./components/wrappers/WelcomeSectionWrapper";
import WhyChooseUsWrapper from "./components/wrappers/WhyChooseUsWrapper";


export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <FeaturedTreksWrapper />
      <BestSellersWrapper />
      <FixedDeparturesWrapper />
      <WelcomeSectionWrapper />
      <TrustedPartnerWrapper />
      <WhyChooseUsWrapper />
      <VideoBannerWrapper />
      <PopularToursWrapper />
      <CtaBannerWrapper />
      <ExploreBlogsWrapper />
      <ClientReviewsWrapper />
      <BlueBannerWrapper />
    </main>
  );
}
