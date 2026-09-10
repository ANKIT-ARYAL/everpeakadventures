import Link from 'next/link';
import { ArrowRight, Mountain, Compass, MapPinned } from 'lucide-react';

const destinations = [
  {
    name: 'Nepal',
    slug: 'nepal',
    subtitle: 'Himalayan adventures',
    blurb:
      'From Everest and Annapurna to sacred valleys and jungle escapes, Nepal is the ultimate destination for trekking, cultural discovery, and unforgettable mountain journeys.',
    image:
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
    fromPrice: 1199,
    meta: '10+ routes',
  },
  {
    name: 'Bhutan',
    slug: 'bhutan',
    subtitle: 'Kingdom of monasteries',
    blurb:
      'Bhutan offers a deeply immersive travel experience with pristine valleys, dramatic Himalayan scenery, spiritual landmarks, and a strong culture rooted in tradition.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    fromPrice: 1499,
    meta: 'Cultural tours',
  },
  {
    name: 'Tibet',
    slug: 'tibet',
    subtitle: 'High-altitude journeys',
    blurb:
      'Tibet blends spiritual heritage, striking plateau landscapes, and some of the world’s most remote and awe-inspiring mountain routes for adventurous travelers.',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    fromPrice: 1399,
    meta: 'Remote escapes',
  },
];

export default function TourDestinationPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ee] text-[#112233]">
      <section className="relative overflow-hidden bg-[#112233] text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
            alt="Tour destinations"
            className="h-full w-full object-cover opacity-35"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#112233] via-[#112233]/85 to-[#112233]/60" />

        <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:py-32 lg:px-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
              <MapPinned className="h-4 w-4" />
              Explore the world with us
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Tour Destinations</h1>
            <p className="mt-5 max-w-2xl text-base text-white/80 md:text-xl">
              Discover handcrafted journeys across Nepal, Bhutan, and Tibet — each designed for travelers seeking breathtaking scenery, authentic culture, and unforgettable adventure.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 lg:px-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#112233]/60">Choose your destination</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Where do you want to go?</h2>
          </div>
          <div className="hidden rounded-full border border-[#112233]/10 bg-white px-4 py-2 text-sm font-medium text-[#112233]/70 shadow-sm md:block">
            Himalayan adventures • Cultural escapes • Scenic journeys
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <div key={destination.slug} className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-xl">
              <Link href={`/tour-destination/${destination.slug}`} className="absolute inset-0">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="mb-3 text-2xl font-display font-medium text-white transition-colors group-hover:text-accent-amber">
                    {destination.name}
                  </h3>

                  <div className="mb-3 flex items-center gap-4 text-[15px] font-sans font-semibold text-white/70">
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-accent-amber opacity-80">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                      </svg>
                      {destination.meta}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-accent-amber opacity-80">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                      Custom trips
                    </span>
                  </div>

                  <div className="h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:h-auto group-hover:opacity-100">
                    <p className="mt-2 border-t border-white/20 pt-3 text-[14px] text-white/80 line-clamp-2 text-justify">
                      {destination.blurb}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="absolute right-4 top-4 rounded-full bg-red-500/95 px-3 py-1.5 text-[13px] font-black text-white shadow-sm">
                From ${destination.fromPrice.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
