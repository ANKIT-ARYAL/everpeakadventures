import { prisma } from "@/lib/prisma";
import AboutUsPage from "../pages/AboutUsPage";

export default async function AboutPageWrapper() {
  const content = await prisma.aboutPageContent.findFirst();

  const defaultData = {
    title: 'About Us',
    featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    happyTravelers: '1,000+',
    yearsExperience: '10+',
    successfulTrips: '100+',
    expertGuides: '20+',
    paragraph1: 'Ever Peak Adventure is a leading Nepal-based adventure travel company dedicated to delivering authentic, safe, and unforgettable Himalayan experiences.',
    paragraph2: 'We specialize in trekking, hiking, peak climbing, mountaineering, and cultural tours across Nepal\'s most breathtaking and diverse landscapes.',
    paragraph3: 'We strictly follow government regulations and international safety guidelines to ensure every journey is conducted with care and transparency.',
    paragraph4: 'Our guides are highly trained, knowledgeable, and deeply familiar with the terrain, culture, and challenges of high-altitude travel.',
    cultureTitle: 'Our Company Culture',
    cultureText: 'Driven by passion, integrity, and respect, we foster a safety-first, team-oriented culture that values authentic experiences and responsible tourism.',
    missionText: 'To deliver safe, authentic, and enriching Himalayan adventure experiences while promoting responsible tourism, cultural respect, and environmental sustainability.',
    visionText: 'To become a globally trusted adventure travel company recognized for excellence, integrity, and innovation showcasing Nepal as a premier destination.',
    goalsText: 'To design and operate high-quality, personalized adventure journeys that inspire confidence, challenge limits, and foster genuine connections.',
  };

  return <AboutUsPage data={content || defaultData} />;
}