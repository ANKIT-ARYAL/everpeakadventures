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
  await prisma.homeSectionContent.deleteMany().catch(() => {});
  await prisma.siteSettings.deleteMany().catch(() => {});
  await prisma.contactWidgetSettings.deleteMany().catch(() => {});
  await prisma.welcomeFeature.deleteMany().catch(() => {});
  await prisma.subpageHero.deleteMany().catch(() => {});

  // 1. Seed Hero Section Data
  await prisma.heroContent.create({
    data: {
      topLabel: 'Your Adventure, Our Expertise',
      mainHeading: 'Explore Nepal. Beyond the peak',
      subtext: 'Authentic treks, Trusted guides. Unforgettable experiences.',
      youtubeVideoId: 'gCRNEJxDJKM',
      searchPlaceholder: 'Search by trek name',
      primaryButtonText: '▲ View Treks',
      primaryButtonLink: '/trekking',
      secondaryButtonText: 'Book Now',
      secondaryButtonLink: '/send-inquiry',
    },
  });

  // 1b. Seed Homepage Section Headers
  await prisma.homeSectionContent.create({
    data: {
      featuredTreksLabel: 'Top Rated Routes',
      featuredTreksTitle: 'Featured Trekking Packages',
      bestSellersWatermark: 'Trekking',
      bestSellersTitle: 'Best Seller Trekking',
      bestSellersSubtitle: '"Top-rated trekking journeys offering breathtaking views and authentic experiences."',
      fixedDeparturesLabel: 'Departure Dates',
      fixedDeparturesTitle: 'Join Fixed Departure Trips',
      popularToursWatermark: 'TOURS',
      popularToursTitle: 'Popular Tours',
      popularToursSubtitle: '"Premium tour packages tailored for comfort, culture, and adventure."',
      exploreBlogsWatermark: 'EXPLORE OUR BLOGS',
      exploreBlogsTitle: 'Explore Our Blogs',
      exploreBlogsSubtitle: "At Ever Peak Adventure, we believe that travel is not just about reaching a destination—it’s about creating stories.",
      whyChooseUsBadge: 'Why Choose Us',
      whyChooseUsTitle: 'Why Choose ',
      whyChooseUsTitleHighlight: 'Ever Peak Adventures',
      whyChooseUsSubtitle: 'We combine years of Himalayan expertise, personalized service, and a passion for adventure to deliver safe, authentic, and unforgettable trekking experiences throughout Nepal.',
    },
  });

  // 1c. Seed Site-Wide Settings (Navbar + Footer)
  await prisma.siteSettings.create({
    data: {
      logoImage: 'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png',
      emergencyLabel: 'Emergency SOS (24/7):',
      emergencyLandline: '+977 98000000',
      emergencyPhone: '9851093960',
      whatsapp: '9851093960',
      email: 'info@everpeakadventures.com',
      addressLine1: 'Payutar Dhara',
      addressLine2: 'Kathmandu, Nepal',
      addressMapUrl: 'https://maps.app.goo.gl/1vfJx36bEbCc7UAu9',
      footerBgImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop',
      copyrightText: 'Copyright © 2026 Everpeak Adventures | Design By Fly Up Technology',
    },
  });

  // 1d. Seed Contact Widget Settings
  await prisma.contactWidgetSettings.create({
    data: {
      enabled: true,
      whatsapp: '9851093960',
      viber: '9851093960',
      phone: '9851093960',
      email: 'info@everpeakadventures.com',
    },
  });

  // 1e. Seed Sub-Page Heroes
  await prisma.subpageHero.createMany({
    data: [
      { slug: 'trekking', title: 'TREKKING IN NEPAL', subtitle: '"Experience the world’s most iconic trekking routes through Nepal’s breathtaking Himalayan landscapes."', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'tour', title: 'TOUR PACKAGES', subtitle: "Discover carefully crafted trekking, climbing, and cultural tour packages across Nepal's most iconic and hidden destinations.", image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'faq', title: 'FREQUENTLY ASKED QUESTIONS', subtitle: 'Find clear and reliable answers to the most frequently asked questions about our trips and services.', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'contact-us', title: 'CONTACT US', subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'blog', title: 'OUR BLOGS', subtitle: 'Explore inspiring stories, travel experiences, and insights from the heart of the Himalayas.', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'our-team', title: 'OUR TEAM', subtitle: '"Passionate experts dedicated to delivering excellence and creating memorable experiences."', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'legal-document', title: 'Legal Document', subtitle: 'All essential travel documents and permits required for your Himalayan adventure.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'testimonials', title: 'Testimonials', subtitle: 'Real stories and genuine feedback from adventurers who traveled with us.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'why-ever-peak-adventures', title: 'Why Ever Peak Adventures', subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'responsible-travel', title: 'Responsible Travel', subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'terms-and-conditions', title: 'Terms and Conditions', subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { slug: 'privacy-policy', title: 'Privacy Policy', subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
    ],
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
 // Seed Treks for all regions
  await prisma.trek.deleteMany().catch(() => {});
  await prisma.trek.createMany({
    data: [
      // --- EVEREST REGION ---
      {
        title: 'Everest Base Camp Trek',
        slug: 'everest-base-camp-trek',
        description: 'Stand at the foot of the world’s highest peak on this legendary Himalayan journey.',
        overview: 'The Everest Base Camp Trek is the classic Himalayan odyssey — a chance to walk in the footsteps of legendary mountaineers toward the foot of the world’s highest mountain, Sagarmatha (Everest, 8,848m). This trek combines natural splendor, Sherpa culture, and one of the most awe-inspiring mountain views on the planet.\\n\\nThe journey begins with a scenic flight from Kathmandu to Lukla (2,860m), the gateway to the Khumbu region. From there, you trek through the vibrant Sherpa town of Namche Bazaar, the heart of the Khumbu, before ascending through picturesque villages, ancient monasteries, and glacial valleys.\\n\\nHighlights include the spectacular views from Tengboche Monastery, the high-altitude destination of Gorak Shep, and the unforgettable experience of standing at the Everest Base Camp (5,364m) itself, surrounded by towering peaks. A pre-dawn ascent of Kala Patthar (5,545m) rewards you with the best close-up panorama of Everest, Nuptse, and the mighty Khumbu Icefall.\\n\\nWell-planned The itinerary allows ample time for proper acclimatization, ensuring a safe and rewarding adventure. Whether you are an experienced trekker or a first-time high-altitude explorer, the Everest Base Camp Trek is a world-certified ultimate trekking experience that will remain with you for a lifetime.',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1549236177-020b1c3e5ccf?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=1200&auto=format&fit=crop',
        ],
        durationDays: '14 Days',
        price: 1600,
        discountedPrice: 1399,
        originalPrice: 1600,
        priceRange: 'US$ 1,399 - US$ 1,600',
        maxAltitude: '5,645 m (Kala Patthar)',
        bestSeason: 'Spring (Mar-May) & Autumn (Sep-Nov)',
        accommodation: 'Teahouse / Lodge',
        meals: 'Full Board (B.L.D)',
        groupSize: '2 - 12 Pax',
        transport: 'Private Vehicle & Flight',
        isAllInclusive: true,
        activity: 'Everest Base Camp Trekking & Hiking',
        highlights: [
          'Stand at Everest Base Camp (5,364m) at the foot of the world’s highest mountain',
          'Summit Kala Patthar (5,545m) for panoramic sunrise views of Everest, Nuptse & Lhotse',
          'Fly from Kathmandu to Lukla aboard a scenic mountain-bound flight',
          'Explore the vibrant Sherpa capital of Namche Bazaar and the Khumbu region',
          'Visit the iconic Tengboche (Dawa Chojacha) Monastery with Everest views',
          'Cross thrilling suspension bridges over the deep Dudh Kosi river gorge',
          'Witness close-up views of the awe-inspiring Khumbu Icefall and Glacier',
          'Experience authentic Sherpa culture, monasteries, and mountain hospitality',
        ],
        inclusions: [
          'All airport-hotel-airport ground transfers by private vehicle',
          'Kathmandu – Lukla – Kathmandu domestic flight tickets with airport taxes',
          'Three night accommodation in a comfortable Kathmandu hotel with breakfast',
          'Accommodation at teahouses/lodges during the trek (twin sharing)',
          'All meals (Breakfast, Lunch & Dinner) during the trekking days',
          'Licensed, English-speaking (Sherpa) trekking guide and strong porters',
          'Trekking permit (TIMS) and Sagarmatha National Park entry permit fees',
          'All applicable government taxes and office service charges',
          'Seasonal fruits as a dessert during the trek, where available',
          'Sleeping bag and down jackets issued (returnable after the trek)',
          'First-aid kit, Oxymeter check-up, and a hot shower when available',
        ],
        exclusions: [
          'International flight tickets to / from Kathmandu',
          'Personal travel, rescue, and medical insurance',
          'Extra nights in Kathmandu or on the trek than planned itinerary',
          'Meals in Kathmandu (Lunch & Dinner) aside from breakfast',
          'Personal trekking equipment and baggage, any excess baggage fees',
          'Helicopter rescue and evacuation costs',
          'Tips for trekking staff (guide, porters, driver)',
          'Any items & expenses not mentioned in the "Cost Includes" section',
        ],
        packingList: [
          'Hiking / trekking boots (broken-in',
          'Down jacket / warm jacket',
          'Multiple layers of warm clothing',
          'Waterproof shell jacket & pants',
          'Wool socks & glove liners',
          'Sun hat, neck gator & beanie',
          'UV sunglasses & sunscreen',
          'Head torch with extra batteries',
          'Water bottles (2 x 1L) & purification tabs',
          'Personal medication & first-aid kit',
          'Sleeping bag (rated -10°C)',
          'Trekking poles & camel pack',
          'Reusable water purifier & snacks',
          'Passport, permit & travel insurance docs',
        ],
itinerary: [
          { day: 1, title: 'Arrival in Kathmandu (1,400m)', elev: 1400, desc: 'Welcome at Kathmandu airport and transfer to the hotel. Kick-off, trip briefing, and gear check. Overnight at a comfortable hotel in Kathmandu.' },
          { day: 2, title: 'Fly to Lukla & Trek to Phakding (2,652m)', elev: 2652, desc: 'Take a scenic early morning flight to Lukla (2,860m). A short trek descends to Phakding, passing through hillside villages and forests. Overnight at a teahouse.' },
          { day: 3, title: 'Trek to Namche Bazaar (3,440m)', elev: 3440, desc: 'Follow the Dudh Koshi river, cross high suspension bridges, and climb steeply into Sherpa country. Enter Namche Bazaar, the bustling heart of the Khumbu. Overnight at a teahouse.' },
          { day: 4, title: 'Acclimatization Day at Namche Bazaar', elev: 3440, desc: 'Explore Namche’s markets, the Museum, and enjoy panoramic views of Everest, Ama Dablam, and Thamserku. An optional hike to the Everest View Hotel is highly recommended. Overnight at a teahouse.' },
          { day: 5, title: 'Trek to Tengboche Monastery (3,860m)', elev: 3860, desc: 'The trail rises through forest up to the famous Tengboche Monastery with stunning mountain views. Overnight at a teahouse near the monastery.' },
          { day: 6, title: 'Trek to Dingboche (4,410m)', elev: 4410, desc: 'Follow the valley toward Everest, crossing glaciers and the Imja Khola, and reach the scenic village of Dingboche surrounded by golden peaks. Acclimatization and a relaxing afternoon. Overnight at a teahouse.' },
          { day: 7, title: 'Acclimatization at Dingboche', elev: 4410, desc: 'A further acclimatization rest day. A climb to the ridge behind Dingboche (5,050m) offers eye-catching views of Lhotse, Island Peak, and Makalu. Overnight at a teahouse.' },
          { day: 8, title: 'Trek to Lobuche (4,940m)', elev: 4940, desc: 'Ascend past the Sherpa memorials and the moraines of the Khumbu glacier to the windswept settlement of Lobuche. Overnight at a teahouse.' },
          { day: 9, title: 'Trek to Gorak Shep & Everest Base Camp (5,364m)', elev: 5364, desc: 'Start early across the glacier floor, reach Gorak Shep, drop bags, and continue to Everest Base Camp. Capturing the famous Khumbu Icefall. Return to Gorak Shep for the night.' },
          { day: 10, title: 'Kala Patthar (5,545m) & Trek to Pheriche', elev: 5545, desc: 'Pre-dawn hike to Kala Patthar for once-in-a-lifetime sunrise over Everest. Then descend to Pheriche for the night.' },
          { day: 11, title: 'Trek to Namche Bazaar', elev: 3440, desc: 'Retrace the trail back through Tengboche and across the bridges, enjoying lower-altitude warmth and decreasing altitude symptoms. Overnight at a teahouse in Namche.' },
          { day: 12, title: 'Trek to Lukla (2,860m)', elev: 2860, desc: 'A final day of walking down through Dudh Kosi river valley and its many bridges, arriving back in the landing community of Lukla for the night.' },
          { day: 13, title: 'Fly to Kathmandu', elev: 1400, desc: 'An early morning flight back to Kathmandu, taking in the final mountain views from the air. Free time to explore the city and shop for souvenirs. Overnight in Kathmandu.' },
          { day: 14, title: 'Departure', elev: 1400, desc: 'Transfer to Tribhuvan International Airport for your onward flight home with unforgettable memories of the Everest region.' },
        ],
        mapUrl: 'https://maps.app.goo.gl/example-everest-base-camp',
        regions: ['Everest Region', 'All Trekking Packages'],
        region: 'everest',
        difficulty: 'Moderate',
        isBestSeller: true,
        order: 1,
      },
      {
        title: 'Gokyo Lakes Trek',
        slug: 'gokyo-lakes-trek',
        description: 'Discover pristine turquoise glacial lakes and panoramic views from Gokyo Ri.',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        durationDays: '12 Days',
        price: 1500,
        discountedPrice: 1299,
        originalPrice: 1500,
        priceRange: 'US$ 1,299 - US$ 1,500',
        isAllInclusive: true,
        activity: 'Gokyo Lakes Trekking & Hiking',
        regions: ['Everest Region', 'All Trekking Packages'],
        region: 'everest',
        difficulty: 'Moderate to Strenuous',
        isBestSeller: false,
        order: 2,
      },
      {
        title: 'Everest Three Passes Trek',
        slug: 'everest-three-passes-trek',
        description: 'The ultimate high-altitude adventure crossing Kongma La, Cho La, and Renjo La passes.',
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        durationDays: '19 Days',
        price: 2000,
        discountedPrice: 1799,
        originalPrice: 2000,
        priceRange: 'US$ 1,799 - US$ 2,000',
        isAllInclusive: true,
        activity: 'Everest Three Passes Trekking & Hiking',
        regions: ['Everest Region', 'All Trekking Packages'],
        region: 'everest',
        difficulty: 'Strenuous',
        isBestSeller: false,
        order: 3,
      },

      // --- ANNAPURNA REGION ---
      {
        title: 'Annapurna Circuit Trek',
        slug: 'annapurna-circuit-trek',
        description: 'Diverse landscapes, deep gorges, and rich cultural encounters around the Annapurna massif.',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        durationDays: '16 Days',
        price: 1450,
        discountedPrice: 1199,
        originalPrice: 1450,
        priceRange: 'US$ 1,199 - US$ 1,450',
        isAllInclusive: false,
        activity: 'Annapurna Circuit Trekking & Hiking',
        regions: ['Annapurna Region', 'All Trekking Packages'],
        region: 'annapurna',
        difficulty: 'Strenuous',
        isBestSeller: true,
        order: 4,
      },
      {
        title: 'Annapurna Base Camp Trek',
        slug: 'annapurna-base-camp-trek',
        description: 'Journey deep into a high alpine sanctuary surrounded by towering Himalayan giants.',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        durationDays: '11 Days',
        price: 1300,
        discountedPrice: 1099,
        originalPrice: 1300,
        priceRange: 'US$ 1,099 - US$ 1,300',
        isAllInclusive: true,
        activity: 'Annapurna Base Camp Trekking & Hiking',
        regions: ['Annapurna Region', 'All Trekking Packages'],
        region: 'annapurna',
        difficulty: 'Moderate',
        isBestSeller: true,
        order: 5,
      },
      {
        title: 'Poon Hill Sunrise Trek',
        slug: 'poon-hill-sunrise-trek',
        description: 'Short and scenic trek featuring breathtaking panoramic sunrise views over the Annapurna range.',
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        durationDays: '5 Days',
        price: 700,
        discountedPrice: 599,
        originalPrice: 700,
        priceRange: 'US$ 599 - US$ 700',
        isAllInclusive: false,
        activity: 'Poon Hill Sunrise Trekking & Hiking',
        regions: ['Annapurna Region', 'All Trekking Packages'],
        region: 'annapurna',
        difficulty: 'Easy',
        isBestSeller: false,
        order: 6,
      },

      // --- MANASLU REGION ---
      {
        title: 'Manaslu Circuit Trek',
        slug: 'manaslu-circuit-trek',
        description: 'A spectacular remote trek encircling Mt. Manaslu, the eighth highest peak in the world.',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        durationDays: '14 Days',
        price: 1550,
        discountedPrice: 1399,
        originalPrice: 1550,
        priceRange: 'US$ 1,399 - US$ 1,550',
        isAllInclusive: true,
        activity: 'Manaslu Circuit Trekking & Hiking',
        regions: ['Manaslu Region', 'All Trekking Packages'],
        region: 'manaslu',
        difficulty: 'Strenuous',
        isBestSeller: true,
        order: 7,
      },
      {
        title: 'Tsum Valley Trek',
        slug: 'tsum-valley-trek',
        description: 'Explore a sacred Himalayan hidden valley rich in ancient Buddhist culture and tradition.',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        durationDays: '18 Days',
        price: 1750,
        discountedPrice: 1599,
        originalPrice: 1750,
        priceRange: 'US$ 1,599 - US$ 1,750',
        isAllInclusive: true,
        activity: 'Tsum Valley Trekking & Hiking',
        regions: ['Manaslu Region', 'All Trekking Packages'],
        region: 'manaslu',
        difficulty: 'Strenuous',
        isBestSeller: false,
        order: 8,
      },

      // --- LANGTANG REGION ---
      {
        title: 'Langtang Valley Trek',
        slug: 'langtang-valley-trek',
        description: 'Explore the valley of glaciers, friendly Tamang villages, and stunning alpine scenery.',
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        durationDays: '10 Days',
        price: 1050,
        discountedPrice: 899,
        originalPrice: 1050,
        priceRange: 'US$ 899 - US$ 1,050',
        isAllInclusive: true,
        activity: 'Langtang Valley Trekking & Hiking',
        regions: ['Langtang Region', 'All Trekking Packages'],
        region: 'langtang',
        difficulty: 'Easy to Moderate',
        isBestSeller: true,
        order: 9,
      },
      {
        title: 'Gosainkunda Lake Trek',
        slug: 'gosainkunda-lake-trek',
        description: 'A spiritual pilgrimage trek to pristine alpine lakes nestled high in the Langtang region.',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        durationDays: '7 Days',
        price: 850,
        discountedPrice: 799,
        originalPrice: 850,
        priceRange: 'US$ 799 - US$ 850',
        isAllInclusive: true,
        activity: 'Gosainkunda Lake Trekking & Hiking',
        regions: ['Langtang Region', 'All Trekking Packages'],
        region: 'langtang',
        difficulty: 'Moderate',
        isBestSeller: false,
        order: 10,
      },

      // --- MUSTANG REGION ---
      {
        title: 'Upper Mustang Trek',
        slug: 'upper-mustang-trek',
        description: 'Journey into the forbidden kingdom of Lo Manthang with its dramatic desert canyons and Tibetan culture.',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        durationDays: '15 Days',
        price: 2250,
        discountedPrice: 2049,
        originalPrice: 2250,
        priceRange: 'US$ 2,049 - US$ 2,250',
        isAllInclusive: false,
        activity: 'Upper Mustang Trekking & Hiking',
        regions: ['Mustang Region', 'All Trekking Packages'],
        region: 'mustang',
        difficulty: 'Moderate',
        isBestSeller: true,
        order: 11,
      },

      // --- KANCHENJUNGA REGION ---
      {
        title: 'Kanchenjunga Base Camp Trek',
        slug: 'kanchenjunga-base-camp-trek',
        description: 'An off-the-beaten-path wilderness expedition to the base of the world’s third highest peak.',
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        durationDays: '21 Days',
        price: 2550,
        discountedPrice: 2299,
        originalPrice: 2550,
        priceRange: 'US$ 2,299 - US$ 2,550',
        isAllInclusive: true,
        activity: 'Kanchenjunga Base Camp Trekking & Hiking',
        regions: ['Kanchenjunga Region', 'All Trekking Packages'],
        region: 'kanchenjunga-region-trekking',
        difficulty: 'Strenuous',
        isBestSeller: false,
        order: 12,
      },

      // --- MAKALU REGION ---
      {
        title: 'Makalu Base Camp Trek',
        slug: 'makalu-base-camp-trek',
        description: 'A challenging and remote trek offering untouched natural beauty and grand mountain vistas.',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        durationDays: '19 Days',
        price: 2350,
        discountedPrice: 2099,
        originalPrice: 2350,
        priceRange: 'US$ 2,099 - US$ 2,350',
        isAllInclusive: true,
        activity: 'Makalu Base Camp Trekking & Hiking',
        regions: ['Makalu Region', 'All Trekking Packages'],
        region: 'makalu-region-trekking',
        difficulty: 'Strenuous',
        isBestSeller: false,
        order: 13,
      },

      // --- DOLPO REGION ---
      {
        title: 'Lower Dolpo Trek',
        slug: 'lower-dolpo-trek',
        description: 'Discover remote trans-Himalayan landscapes, ancient Bon culture, and breathtaking Phoksundo Lake.',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        durationDays: '18 Days',
        price: 2450,
        discountedPrice: 2199,
        originalPrice: 2450,
        priceRange: 'US$ 2,199 - US$ 2,450',
        isAllInclusive: true,
        activity: 'Lower Dolpo Trekking & Hiking',
        regions: ['Dolpo Region', 'All Trekking Packages'],
        region: 'dolpo',
        difficulty: 'Strenuous',
        isBestSeller: false,
        order: 14,
      },
    ],
  });

  // 3b. Seed Group Pricing + Departure Schedule repeaters per trek
  const seededTreks = await prisma.trek.findMany({ select: { id: true, slug: true, discountedPrice: true } });
  for (const t of seededTreks) {
    const base = t.discountedPrice ?? 2000;
    await prisma.trekGroupPrice.createMany({
      data: [
        { trekId: t.id, groupSize: '2 - 4', groupType: 'Small Group', price: `US$ ${base.toLocaleString()}` },
        { trekId: t.id, groupSize: '5 - 9', groupType: 'Best Value', price: `US$ ${(base - 50).toLocaleString()}` },
        { trekId: t.id, groupSize: '10+', groupType: 'Super Group', price: `US$ ${(base - 100).toLocaleString()}` },
      ],
    });
    await prisma.trekSchedule.create({
      data: {
        trekId: t.id,
        groupSize: '2 - 12 Pax',
        dateRange: '15 Sep - 28 Sep',
        status: 'Book',
      },
    });
  }

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
      buttonText: 'Know More About Us',
      buttonLink: '/about-us',
      carouselImages: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
      ],
    },
  });

  // 5b. Seed Welcome Features
  await prisma.welcomeFeature.createMany({
    data: [
      { title: 'Local Himalayan Experts', description: 'Experienced guides with deep regional knowledge', order: 1 },
      { title: 'Safety First Approach', description: 'Certified guides and proven safety standards', order: 2 },
      { title: 'Government Licensed', description: 'Authorized by Tourism Ministry, TAAN & NMA', order: 3 },
      { title: 'Authentic Experiences', description: 'Connect with local communities and traditions', order: 4 },
    ],
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
  // Seed Tours for Nepal, Bhutan, and Tibet
  await prisma.tour.deleteMany().catch(() => {});
  await prisma.tour.createMany({
    data: [
      // --- NEPAL TOURS ---
      {
        title: 'Kathmandu Valley Cultural Tour',
        slug: 'kathmandu-valley-cultural-tour',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        duration: '5 Days',
        bestTime: 'Year-round',
        destination: 'nepal',
        order: 1,
      },
      {
        title: 'Pokhara & Chitwan Wildlife Adventure',
        slug: 'pokhara-chitwan-wildlife-adventure',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        duration: '7 Days',
        bestTime: 'Sept–May',
        destination: 'nepal',
        order: 2,
      },
      {
        title: 'Lumbini & Heritage Exploration',
        slug: 'lumbini-heritage-exploration',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        duration: '6 Days',
        bestTime: 'Oct–March',
        destination: 'nepal',
        order: 3,
      },
      {
        title: 'Nagarkot Sunrise & Village Tour',
        slug: 'nagarkot-sunrise-village-tour',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop',
        duration: '4 Days',
        bestTime: 'Sept–June',
        destination: 'nepal',
        order: 4,
      },
      {
        title: 'Everest Mountain Flight Tour',
        slug: 'everest-mountain-flight-tour',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        duration: '1 Day',
        bestTime: 'Sept–May',
        destination: 'nepal',
        order: 5,
      },

      // --- BHUTAN TOURS ---
      {
        title: 'Bhutan Adventure Tour',
        slug: 'bhutan-adventure-tour',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        duration: '6 Days',
        bestTime: 'Mar–May & Sept–Nov',
        destination: 'bhutan',
        order: 6,
      },
      {
        title: 'Bhutan Honeymoon Tour',
        slug: 'bhutan-honeymoon-tour',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        duration: '7 Days',
        bestTime: 'Year-round',
        destination: 'bhutan',
        order: 7,
      },
      {
        title: 'Bhutan Spiritual & Meditation Tour',
        slug: 'bhutan-spiritual-meditation-tour',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        duration: '8 Days',
        bestTime: 'Sept–May',
        destination: 'bhutan',
        order: 8,
      },

      // --- TIBET TOURS ---
      {
        title: 'Classic Lhasa & Potala Palace Tour',
        slug: 'classic-lhasa-potala-palace-tour',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        duration: '8 Days',
        bestTime: 'Apr–Oct',
        destination: 'tibet',
        order: 9,
      },
      {
        title: 'Tibet Everest Base Camp Overland Tour',
        slug: 'tibet-everest-base-camp-overland-tour',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        duration: '10 Days',
        bestTime: 'May–Sept',
        destination: 'tibet',
        order: 10,
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
        content: '',
        excerpt: 'Discover everything you need to pack for your journey to the roof of the world, from proper layering to high-altitude gear essentials.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        category: 'Everest Region',
        date: 'Sep 15, 2026',
        order: 1,
      },
      {
        title: 'Understanding Altitude Sickness: Prevention and Tips',
        slug: 'understanding-altitude-sickness-prevention-and-tips',
        content: '',
        excerpt: 'Learn the symptoms of acute mountain sickness and how proper acclimatization can keep your Himalayan adventure safe and enjoyable.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        category: 'Safety & Health',
        date: 'Sep 10, 2026',
        order: 2,
      },
      {
        title: 'Culture and Traditions of the Sherpa People',
        slug: 'culture-and-traditions-of-the-sherpa-people',
        content: '',
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
        content: '',
        excerpt: 'Discover everything you need to pack for your journey to the roof of the world, from proper layering to high-altitude gear essentials.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        category: 'Everest Region',
        date: 'September 15, 2026',
        order: 1,
      },
      {
        title: 'Understanding Altitude Sickness: Prevention and Tips',
        slug: 'understanding-altitude-sickness-prevention-and-tips',
        content: '',
        excerpt: 'Learn the symptoms of acute mountain sickness and how proper acclimatization can keep your Himalayan adventure safe and enjoyable.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        category: 'Safety & Health',
        date: 'September 10, 2026',
        order: 2,
      },
      {
        title: 'Culture and Traditions of the Sherpa People',
        slug: 'culture-and-traditions-of-the-sherpa-people',
        content: '',
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
  // Seed Legal Documents & Registrations
  await prisma.legalDocument.deleteMany().catch(() => {});
  await prisma.legalDocument.createMany({
    data: [
      {
        title: 'Company Registration Certificate',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        documentUrl: 'https://everpeakadventures.com',
        order: 1,
      },
      {
        title: 'Department of Tourism License',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        documentUrl: 'https://everpeakadventures.com',
        order: 2,
      },
      {
        title: 'Tax Clearance Certificate (PAN)',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        documentUrl: 'https://everpeakadventures.com',
        order: 3,
      },
      {
        title: 'TAAN & NMA Membership Affiliation',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        documentUrl: 'https://everpeakadventures.com',
        order: 4,
      },
    ],
  });
  // Seed Privacy Policy Content
  await prisma.privacyPolicyContent.deleteMany().catch(() => {});
  await prisma.privacyPolicyContent.create({
    data: {
      title: 'Privacy Policy',
      subtitle: 'Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.',
      contentHtml: `
        <p class="text-gray-700 font-medium">
          <strong>Ever Peak Adventure</strong> values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you visit our website, make inquiries, or book our services.
        </p>
        <p class="text-xs text-gray-500 italic">
          By using our website and services, you agree to the practices described in this policy.
        </p>

        <div class="space-y-6 pt-4">
          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              1. Information We Collect
            </h2>
            <p class="mb-2">We may collect the following types of information:</p>
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, nationality, passport details (when required for permits), and other details you provide during inquiries or bookings.</li>
              <li><strong>Booking & Travel Information:</strong> Trip preferences, emergency contact details, and special requirements.</li>
              <li><strong>Payment Information:</strong> Limited payment-related details processed securely through trusted payment gateways (we do not store full card details).</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and website usage data through cookies.</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              2. How We Use Your Information
            </h2>
            <p class="mb-2">Your information is used to:</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>Respond to inquiries and provide requested services</li>
              <li>Process bookings, permits, and travel arrangements</li>
              <li>Communicate important updates and information</li>
              <li>Improve our website, services, and customer experience</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
            <p class="text-xs text-gray-500 mt-2">We only collect information that is necessary for providing our services.</p>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              3. Information Sharing & Disclosure
            </h2>
            <p class="font-semibold text-gray-800 mb-2">Ever Peak Adventure does not sell, rent, or trade your personal information.</p>
            <p class="mb-2">We may share your information only with:</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>Government authorities (for permits, visas, or legal requirements)</li>
              <li>Trusted partners such as guides, hotels, transport providers, or insurance companies (only when necessary for your trip)</li>
              <li>Payment processors for secure transactions</li>
            </ul>
            <p class="text-xs text-gray-500 mt-2">All third parties are required to protect your data and use it solely for service delivery.</p>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              4. Data Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to protect your personal information from unauthorized access, misuse, loss, or disclosure. While no online system is completely secure, we continuously work to maintain strong data protection standards.
            </p>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              5. Cookies & Tracking Technologies
            </h2>
            <p class="mb-2">Our website may use cookies to:</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>Enhance user experience</li>
              <li>Analyze website traffic and performance</li>
              <li>Remember user preferences</li>
            </ul>
            <p class="text-xs text-gray-500 mt-2">You can control or disable cookies through your browser settings, though this may affect some website features.</p>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              6. Your Rights
            </h2>
            <p class="mb-2">You have the right to:</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (subject to legal or operational requirements)</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
            <p class="text-xs text-gray-500 mt-2">To exercise these rights, please contact us directly.</p>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              7. External Links
            </h2>
            <p>
              Our website may contain links to third-party websites. Ever Peak Adventure is not responsible for the privacy practices or content of external sites. We encourage users to review their privacy policies separately.
            </p>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              8. Changes To This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in laws or services. Any updates will be posted on this page with immediate effect.
            </p>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
              9. Contact Us
            </h2>
            <p class="mb-4">
              If you have any questions or concerns regarding this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <div class="bg-[#f8faf9] p-5 rounded-2xl border border-gray-100 space-y-3">
              <p class="font-bold text-gray-900 oswald">Ever Peak Adventure</p>
              <p class="text-xs font-medium text-gray-700">Email: info@everpeakadventures.com</p>
              <p class="text-xs font-medium text-gray-700">Location: Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      `,
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