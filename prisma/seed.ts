import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with dynamic data...');

  // Clear existing data safely
  await prisma.heroContent.deleteMany().catch(() => {});
  await prisma.trustItem.deleteMany().catch(() => {});
  await prisma.trek.deleteMany().catch(() => {});
  await prisma.fixedDeparture.deleteMany().catch(() => {});
  await prisma.welcomeContent.deleteMany().catch(() => {});
  await prisma.trustedPartnerContent.deleteMany().catch(() => {});
  await prisma.whyChooseUsItem.deleteMany().catch(() => {});
  await prisma.whyChooseUsFeature.deleteMany().catch(() => {});
  await prisma.videoBannerContent.deleteMany().catch(() => {});
  await prisma.tour.deleteMany().catch(() => {});
  await prisma.section.deleteMany().catch(() => {});
  await prisma.page.deleteMany().catch(() => {});
  await prisma.teamMember.deleteMany().catch(() => {});

  // 1. Seed Hero Section Data
  await prisma.heroContent.create({
    data: {
      topLabel: 'Your Adventure, Our Expertise',
      mainHeading: 'Explore Nepal. Beyond the peak',
      subtext: 'Authentic treks, Trusted guides. Unforgettable experiences.',
      youtubeVideoId: 'gCRNEJxDJKM',
      searchPlaceholder: 'Search by trek name',
    },
  });

  // 2. Seed Trust Bar Items
  await prisma.trustItem.createMany({
    data: [
      { title: '100%', subtitle: 'Safety First', iconName: 'ShieldCheck', order: 1 },
      { title: 'Expert', subtitle: 'Local Guides', iconName: 'Footprints', order: 2 },
      { title: '24/7', subtitle: 'Support', iconName: 'Headphones', order: 3 },
      { title: 'Tailor-Made', subtitle: 'Adventures', iconName: 'Users', order: 4 },
    ],
  });

  // 3. Seed Featured & Best Seller Treks
  await prisma.trek.createMany({
    data: [
      {
        title: 'Everest Base Camp Trek',
        description: 'Stand at the foot of the world’s highest peak on this legendary Himalayan journey.',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        durationDays: '14 Days',
        price: 1450,
        region: 'everest',
        difficulty: 'Moderate',
        isBestSeller: true,
        order: 1,
      },
      {
        title: 'Annapurna Circuit Trek',
        description: 'Diverse landscapes, deep gorges, and rich cultural encounters around the Annapurna massif.',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        durationDays: '16 Days',
        price: 1300,
        region: 'annapurna',
        difficulty: 'Strenuous',
        isBestSeller: true,
        order: 2,
      },
      {
        title: 'Langtang Valley Trek',
        description: 'Explore the valley of glaciers, friendly Tamang villages, and stunning alpine scenery.',
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        durationDays: '10 Days',
        price: 950,
        region: 'langtang',
        difficulty: 'Easy to Moderate',
        isBestSeller: true,
        order: 3,
      },
    ],
  });

  // 4. Seed Fixed Departures
  await prisma.fixedDeparture.createMany({
    data: [
      {
        title: 'Everest Base Camp Trek',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        durationDays: '14 Days',
        startDate: '15 Sep 2026',
        endDate: '28 Sep 2026',
        status: 'Guaranteed',
        seatsLeft: 5,
        price: 1450,
        originalPrice: 1600,
        order: 1,
      },
      {
        title: 'Annapurna Circuit Trek',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        durationDays: '16 Days',
        startDate: '01 Oct 2026',
        endDate: '16 Oct 2026',
        status: 'Filling Fast',
        seatsLeft: 3,
        price: 1300,
        originalPrice: 1450,
        order: 2,
      },
      {
        title: 'Langtang Valley Trek',
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        durationDays: '10 Days',
        startDate: '12 Oct 2026',
        endDate: '21 Oct 2026',
        status: 'Guaranteed',
        seatsLeft: 8,
        price: 950,
        originalPrice: 1100,
        order: 3,
      },
    ],
  });

  // 5. Seed Welcome Section Data
  await prisma.welcomeContent.create({
    data: {
      companyName: 'Ever Peak Adventure',
      description: 'Ever Peak Adventure is a trusted Nepal trekking company specializing in trekking, peak climbing, hiking, and customized Himalayan adventures. Our experienced local guides lead unforgettable journeys to Everest Base Camp, Annapurna Base Camp, Langtang Valley, Upper Mustang, Manaslu Circuit, and many other spectacular destinations across Nepal. We focus on safety, personalized service, and authentic mountain experiences for every traveler.',
      carouselImages: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
      ],
    },
  });

  // 6. Seed Trusted Partner / Why Choose Us Data
  await prisma.trustedPartnerContent.create({
    data: {
      mainTitle: 'Your Trusted Partner For Himalayan Adventures',
      description: 'Explore the Himalayas with confidence through expert guidance, local knowledge, and a strong commitment to safety and authentic experiences.',
      badgeTitle: "Traveler's Choice",
      badgeSubtitle: "Ever Peak Adventures Trip Advisor Traveler's Choice. Carrying on a Legacy - Our badge of excellence",
      reviewCountText: 'Reviews 5/5',
      storyTitle: 'Traveler Story',
      storyDescription: 'Based on 100+ trusted Reviews on TripAdvisor. Your journey with us is built on a foundation of proven quality and memorable experiences.',
      storyImage: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=200&h=200&fit=crop',
      bgHeroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop',
    },
  });

  await prisma.whyChooseUsItem.createMany({
    data: [
      { title: 'Flexible Itineraries', desc: 'Tailored Routes to Match your Time, Interests, And Fitness level', iconName: 'Map', order: 1 },
      { title: 'Trusted Award- Winning Company', desc: '13+ TripAdvisor Excellence Winner', iconName: 'Award', order: 2 },
      { title: 'Safe & Supported', desc: 'Certified Guides, 24/7 Assistance from Start to Finish', iconName: 'ShieldCheck', order: 3 },
      { title: 'Local Experts', desc: 'Over A Decade of Experience With Global Service Standards', iconName: 'MapPin', order: 4 },
      { title: 'Happiness Guaranteed', desc: 'Joyful Journey Designed With Care - Where Every Moment Feels Fulfilling', iconName: 'Smile', order: 5 },
      { title: 'Sustainable Travel', desc: 'Eco-Conscious Treks That Respect Nature And Uplift Local Communities', iconName: 'Leaf', order: 6 },
    ],
  });

  // 7. Seed Why Choose Us Features
  await prisma.whyChooseUsFeature.createMany({
    data: [
      {
        icon: '🏔️',
        title: 'Experienced Local Experts',
        description: 'Our professional guides have years of experience leading treks across Nepal, ensuring every journey is safe, informative, and enjoyable.',
        order: 1,
      },
      {
        icon: '🛡️',
        title: 'Safety First',
        description: 'From carefully planned itineraries to altitude awareness and emergency support, your safety is always our highest priority.',
        order: 2,
      },
      {
        icon: '😊',
        title: 'Personalized Service',
        description: 'Every traveler is different. We tailor each adventure according to your fitness level, interests, and travel goals.',
        order: 3,
      },
      {
        icon: '🌿',
        title: 'Responsible Trekking',
        description: 'We are committed to sustainable tourism, leaving no trace, and actively supporting the local communities we visit.',
        order: 4,
      },
      {
        icon: '⭐',
        title: 'Quality You Can Trust',
        description: 'We don’t compromise on quality. From teahouses to transport, we ensure comfortable and reliable services throughout.',
        order: 5,
      },
      {
        icon: '❤️',
        title: 'Passion for Adventure',
        description: 'We do what we love. Our passion for the Himalayas translates into unforgettable, life-changing experiences for you.',
        order: 6,
      },
    ],
  });

  // 8. Seed Video Banner Content
  await prisma.videoBannerContent.create({
    data: {
      title: 'Explore Full Itineraries & Trip Ideas For Trekking',
      subtitle: 'Carefully crafted Trekking plans designed for every trail, pace, and adventure level.',
      buttonText: 'START JOURNEY',
      buttonLink: '/tours',
      videoUrl: 'https://www.youtube.com/watch?v=gCRNEJxDJKM',
      backgroundImages: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
      ],
    },
  });

  // 9. Seed Popular Tours
  await prisma.tour.createMany({
    data: [
      {
        title: 'Kathmandu Valley Cultural Tour',
        slug: 'kathmandu-valley-cultural-tour',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        duration: '5 Days',
        bestTime: 'Year-round',
        order: 1,
      },
      {
        title: 'Pokhara & Chitwan Wildlife Adventure',
        slug: 'pokhara-chitwan-wildlife-adventure',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        duration: '7 Days',
        bestTime: 'Sept–May',
        order: 2,
      },
      {
        title: 'Lumbini & Heritage Exploration',
        slug: 'lumbini-heritage-exploration',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        duration: '6 Days',
        bestTime: 'Oct–March',
        order: 3,
      },
      {
        title: 'Nagarkot Sunrise & Village Tour',
        slug: 'nagarkot-sunrise-village-tour',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop',
        duration: '4 Days',
        bestTime: 'Sept–June',
        order: 4,
      },
    ],
  });
// Seed CTA Banner Content
  await prisma.ctaBannerContent.deleteMany().catch(() => {});
  await prisma.ctaBannerContent.create({
    data: {
      title: 'Experience nature in a new way. Visit Us.',
      subtitle: 'Where every step brings you closer to nature.',
      bgImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop',
      primaryLink: '/contact',
      secondaryLink: '/tours',
    },
  });
  // Seed Blog Posts
  await prisma.blogPost.deleteMany().catch(() => {});
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Essential Guide to Packing for Everest Base Camp Trek',
        slug: 'essential-guide-to-packing-for-everest-base-camp',
        excerpt: 'Discover everything you need to pack for your journey to the roof of the world, from proper layering to high-altitude gear essentials.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        category: 'Everest Region',
        date: 'Sep 15, 2026',
        order: 1,
      },
      {
        title: 'Understanding Altitude Sickness: Prevention and Tips',
        slug: 'understanding-altitude-sickness-prevention-and-tips',
        excerpt: 'Learn the symptoms of acute mountain sickness and how proper acclimatization can keep your Himalayan adventure safe and enjoyable.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        category: 'Safety & Health',
        date: 'Sep 10, 2026',
        order: 2,
      },
      {
        title: 'Culture and Traditions of the Sherpa People',
        slug: 'culture-and-traditions-of-the-sherpa-people',
        excerpt: 'Immerse yourself in the rich Buddhist heritage, warm hospitality, and unique mountain lifestyle of the Sherpa communities.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        category: 'Local Culture',
        date: 'Sep 05, 2026',
        order: 3,
      },
    ],
  });
  // Seed Client Reviews
  await prisma.clientReview.deleteMany().catch(() => {});
  await prisma.clientReview.createMany({
    data: [
      {
        quote: 'Standing at Everest Base Camp was a life-changing experience. Our guide was incredibly knowledgeable, supportive, and prioritized our safety every step of the way.',
        name: 'Sarah Jenkins',
        location: 'United Kingdom',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        order: 1,
      },
      {
        quote: 'The Annapurna Circuit trek offered breathtaking views and deep cultural immersion. Ever Peak Adventures handled every single detail seamlessly from start to finish.',
        name: 'Michael Schmidt',
        location: 'Germany',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        order: 2,
      },
      {
        quote: 'An absolute masterpiece of organization and hospitality. The team felt like family by the end of the trip. Cannot wait to return for the Langtang Valley trek!',
        name: 'Emma Watson',
        location: 'Australia',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        order: 3,
      },
    ],
  });
  // Seed Blue Banner Content
  await prisma.blueBannerContent.deleteMany().catch(() => {});
  await prisma.blueBannerContent.create({
    data: {
      title: 'Explore the Himalayas with Trusted Local Experts',
      subtitle: 'Ever Peak Adventures offers unforgettable trekking, peak climbing, and cultural journeys across Everest, Annapurna, and beyond. Safe, authentic, and professionally guided.',
      buttonText: 'View All Trek Packages →',
      buttonLink: '/tours',
    },
  });
  // Seed About Us Page Content
  await prisma.aboutPageContent.deleteMany().catch(() => {});
  await prisma.aboutPageContent.create({
    data: {
      title: 'About Us',
      featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
      happyTravelers: '1,000+',
      yearsExperience: '10+',
      successfulTrips: '100+',
      expertGuides: '20+',
    },
  });
  // Seed Director Message Page
  await prisma.directorMessageContent.deleteMany().catch(() => {});
  await prisma.directorMessageContent.create({
    data: {
      contentHtml: `
        <h2 class="text-2xl md:text-3xl font-extrabold text-[#222222] mb-6 oswald uppercase tracking-tight">Message From Managing Director</h2>
        <div class="space-y-4 text-gray-600 text-[14px] leading-relaxed">
          <p>Welcome to Ever Peak Adventures. When we founded this company, our goal was simple yet profound: to share the raw majesty of the Himalayas while ensuring absolute safety, deep cultural respect, and sustainable tourism.</p>
          <p>Nepal is not just a destination; it is a living sanctuary of mountains, ancient traditions, and warm-hearted communities. Every trek we design is crafted to give you a genuine, life-changing connection with this incredible landscape.</p>
          <p>Whether you are stepping onto the glaciers of Everest Base Camp or exploring the green valleys of Annapurna, our dedicated team of local experts is with you every step of the way.</p>
        </div>
      `,
      founderName: 'Dipesh Aryal',
      founderTitle: 'Founder, Ever Peak Adventures',
      founderEmail: 'dipesh@everpeakadventure.com',
      founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
  });
  // Seed Team Members
  await prisma.teamMember.deleteMany().catch(() => {});
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Dipesh Aryal',
        role: 'Founder & Lead Guide',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        order: 1,
      },
      {
        name: 'Pasang Sherpa',
        role: 'Senior Mountaineering Guide',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
        order: 2,
      },
      {
        name: 'Ankit Aryal',
        role: 'Trekking Coordinator',
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop',
        order: 3,
      },
    ],
  });
  // Seed Why Ever Peak Page Content
  await prisma.whyPageContent.deleteMany().catch(() => {});
  await prisma.whyPageContent.create({
    data: {
      title: 'Why Ever Peak Adventures',
      subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
      contentHtml: `
        <div class="space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
          <div class="border-b border-gray-100 pb-4">
            <h3 class="font-bold text-gray-900 text-base oswald mb-1 flex items-center gap-2">Local Himalayan Experts</h3>
            <p>Founded and operated by experienced Nepali mountaineers and travel professionals, we bring deep local knowledge and firsthand mountain experience to every journey.</p>
          </div>
          <div class="border-b border-gray-100 pb-4">
            <h3 class="font-bold text-gray-900 text-base oswald mb-1 flex items-center gap-2">Safety Without Compromise</h3>
            <p>Your safety is our highest priority. We follow strict safety standards, provide professional guidance, proper acclimatization, and well-planned itineraries for a secure adventure.</p>
          </div>
          <div class="border-b border-gray-100 pb-4">
            <h3 class="font-bold text-gray-900 text-base oswald mb-1 flex items-center gap-2">Licensed & Trusted Company</h3>
            <p>Fully licensed by the Ministry of Tourism, Government of Nepal, and proud members of TAAN and NMA, we operate with transparency, professionalism, and ethical responsibility.</p>
          </div>
          <div class="border-b border-gray-100 pb-4">
            <h3 class="font-bold text-gray-900 text-base oswald mb-1 flex items-center gap-2">Personalized Adventures</h3>
            <p>Every traveler is unique. We design tailor-made itineraries to match your interests, schedule, fitness level, and adventure goals.</p>
          </div>
          <div class="border-b border-gray-100 pb-4">
            <h3 class="font-bold text-gray-900 text-base oswald mb-1 flex items-center gap-2">Experienced Guides & Strong Support Team</h3>
            <p>Our certified guides and support staff have more than a decade of hands-on experience leading treks and climbs across Nepal’s iconic regions.</p>
          </div>
          <div class="border-b border-gray-100 pb-4">
            <h3 class="font-bold text-gray-900 text-base oswald mb-1 flex items-center gap-2">Authentic Cultural Experiences</h3>
            <p>Go beyond the trails. We connect you with local communities, traditions, and lifestyles for a deeper Himalayan experience.</p>
          </div>
          <div class="border-b border-gray-100 pb-4">
            <h3 class="font-bold text-gray-900 text-base oswald mb-1 flex items-center gap-2">Responsible & Sustainable Tourism</h3>
            <p>We support local livelihoods, respect cultural heritage, and promote eco-friendly practices to protect the mountains we love.</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-base oswald mb-1 flex items-center gap-2">Honest Service & Transparent Pricing</h3>
            <p>No hidden costs, no false promises—just clear communication, fair pricing, and reliable service from start to finish.</p>
          </div>
        </div>
      `,
    },
  });
  // Seed Responsible Travel Page Content
  await prisma.responsibleTravelContent.deleteMany().catch(() => {});
  await prisma.responsibleTravelContent.create({
    data: {
      title: 'Responsible Travel',
      subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
      contentHtml: `
        <div class="space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
          <h2 class="text-2xl font-bold text-gray-900 oswald mb-4">Our Commitment to Sustainable Tourism</h2>
          <p>At Ever Peak Adventures, we believe that traveling through the majestic Himalayas comes with a profound responsibility to protect the environment, respect local cultures, and support indigenous mountain communities.</p>
          <p>We actively practice Leave No Trace principles, minimize plastic waste on our trails, and ensure fair working conditions, proper insurance, and safety equipment for all our local guides and porters.</p>
          <p>By booking with us, you directly contribute to community development, education initiatives, and environmental preservation in the remote regions we visit.</p>
        </div>
      `,
    },
  });
  // Seed Terms and Conditions Page Content
  await prisma.termsPageContent.deleteMany().catch(() => {});
  await prisma.termsPageContent.create({
    data: {
      title: 'Terms and Conditions',
      subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
      contentHtml: `
        <div class="space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
          <h2 class="text-2xl font-bold text-gray-900 oswald mb-4">Booking & Payment Conditions</h2>
          <p>Please read these terms and conditions carefully before booking any trek, tour, or climbing expedition with Ever Peak Adventures. By booking a trip with us, you accept these terms in full.</p>
          <h3 class="text-lg font-bold text-gray-800 oswald mt-6 mb-2">1. Deposits and Payments</h3>
          <p>To secure a booking, a non-refundable deposit of 20% of the total trip cost is required upon confirmation. The remaining balance can be paid upon arrival in Kathmandu prior to departure.</p>
          <h3 class="text-lg font-bold text-gray-800 oswald mt-6 mb-2">2. Cancellations and Refunds</h3>
          <p>If you need to cancel your trip, notice must be given in writing. Cancellation fees apply depending on how close to the departure date notice is received. We strongly recommend comprehensive travel insurance covering trip cancellation.</p>
          <h3 class="text-lg font-bold text-gray-800 oswald mt-6 mb-2">3. Health and Fitness</h3>
          <p>Clients must disclose any medical conditions or physical limitations at the time of booking. Our itineraries involve high-altitude trekking where medical facilities can be remote.</p>
        </div>
      `,
    },
  });
  // Seed FAQs
  await prisma.fAQ.deleteMany().catch(() => {});
  await prisma.fAQ.createMany({
    data: [
      {
        question: "How long is the Manaslu Circuit Trek?",
        answer: "The Manaslu Circuit Trek typically takes between 14 to 18 days depending on your exact itinerary, side trips, and acclimatization schedule.",
        order: 1,
      },
      {
        question: "How difficult is the Manaslu Circuit Trek?",
        answer: "It is considered a challenging trek involving high mountain passes like Larkya La (5,106m), requiring good physical fitness and prior high-altitude hiking experience.",
        order: 2,
      },
      {
        question: "Do I need prior trekking experience?",
        answer: "Yes, previous high-altitude trekking experience is highly recommended due to remote terrain and strenuous daily elevation gains.",
        order: 3,
      },
      {
        question: "What is the best time to trek the Manaslu Circuit?",
        answer: "The best seasons are Autumn (September to November) and Spring (March to May) offering stable weather and crystal-clear mountain views.",
        order: 4,
      },
      {
        question: "Do I need a special permit?",
        answer: "Yes, Manaslu is a restricted area requiring a Special Restricted Area Permit, TIMS, and ACAP/MCAP permits handled through a registered agency.",
        order: 5,
      },
      {
        question: "Can I trek solo in Manaslu?",
        answer: "No, solo trekking is strictly prohibited in the Manaslu region. You must be accompanied by a licensed guide and have at least two trekkers in your group.",
        order: 6,
      },
      {
        question: "What is the highest point of the trek?",
        answer: "The highest point is the breathtaking Larkya La Pass standing at an elevation of 5,106 meters (16,752 feet).",
        order: 7,
      },
      {
        question: "Will I get altitude sickness?",
        answer: "Altitude sickness can affect anyone. Proper acclimatization, staying hydrated, and ascending gradually significantly lower the risks.",
        order: 8,
      },
      {
        question: "What happens in case of emergency?",
        answer: "Our expert guides carry comprehensive medical kits, oximeters, and maintain direct satellite/cellular communication with our Kathmandu headquarters for immediate rescue evacuation if required.",
        order: 9,
      },
      {
        question: "What type of accommodation is available?",
        answer: "Accommodations consist of cozy local teahouses and lodges offering twin-sharing rooms with basic amenities and warm hospitality.",
        order: 10,
      },
    ],
  });
  // Seed Blog Posts
  await prisma.blogPost.deleteMany().catch(() => {});
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Essential Guide to Packing for Everest Base Camp Trek',
        slug: 'essential-guide-to-packing-for-everest-base-camp',
        excerpt: 'Discover everything you need to pack for your journey to the roof of the world, from proper layering to high-altitude gear essentials.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        category: 'Everest Region',
        date: 'September 15, 2026',
        order: 1,
      },
      {
        title: 'Understanding Altitude Sickness: Prevention and Tips',
        slug: 'understanding-altitude-sickness-prevention-and-tips',
        excerpt: 'Learn the symptoms of acute mountain sickness and how proper acclimatization can keep your Himalayan adventure safe and enjoyable.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        category: 'Safety & Health',
        date: 'September 10, 2026',
        order: 2,
      },
      {
        title: 'Culture and Traditions of the Sherpa People',
        slug: 'culture-and-traditions-of-the-sherpa-people',
        excerpt: 'Immerse yourself in the rich Buddhist heritage, warm hospitality, and unique mountain lifestyle of the Sherpa communities.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        category: 'Local Culture',
        date: 'September 05, 2026',
        order: 3,
      },
    ],
  });
  // Seed Contact Info
  await prisma.contactInfo.deleteMany().catch(() => {});
  await prisma.contactInfo.create({
    data: {
      address: 'Kathmandu, Nepal',
      phone: '9851093960',
      email: 'info@everpeakadventures.com',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.246473636257!2d85.3150!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zThe Kathmandu!5e0!3m2!1sen!2snp!4v1650000000000!5m2!1sen!2snp',
    },
  });
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });