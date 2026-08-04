interface BestSellersProps {
  data: any[];
}

export default function BestSellers({ data }: BestSellersProps) {
  return (
    <div className='min-h-screen bg-[#f7f7f7] oswald'>
      <section className="max-w-[1200px] mx-auto px-5 py-16">
        {/* Header Section */}
        <div className="relative text-center mb-12 flex flex-col items-center justify-center">
          {/* Background Text */}
          <h1 className="absolute -top-10 text-[7rem] font-bold text-[#e8e8e8] tracking-widest uppercase select-none z-0">
            Trekking
          </h1>

          {/* Foreground Title & Subtitle */}
          <h2 className="relative z-10 text-4xl font-bold text-[#222222] uppercase tracking-wide mb-3">
            Best Seller Trekking
          </h2>
          <p className="relative z-10 text-[#555555] text-base">
            &quot;Top-rated trekking journeys offering breathtaking views and authentic experiences.&quot;
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((trek) => (
            <div
              key={trek.id}
              className="bg-white rounded-md overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.06)] flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-[220px]">
                <img
                  src={trek.heroImage}
                  alt={trek.title || "Trek image"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Card Content */}
              {trek.title && (
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl text-[#222222] text-center mb-3 font-medium">
                    {trek.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex justify-center gap-5 text-[#888888] text-sm mb-4">
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                      </svg>
                      {trek.durationDays}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                      {trek.difficulty}
                    </span>
                  </div>

                  {/* Divider line */}
                  <div className="h-px bg-[#eaeaea] w-full mb-4"></div>

                  {/* Description */}
                  <p className="text-[#555555] text-sm leading-relaxed text-justify line-clamp-3 m-0">
                    {trek.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 flex items-center gap-3 z-50">
        <div className="bg-white px-4 py-2.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] text-[0.95rem] font-medium text-[#222222] relative">
          Contact Us
          <div className="absolute top-1/2 -right-[5px] -translate-y-1/2 border-[6px] border-transparent border-l-white"></div>
        </div>

        <button
          className="w-14 h-14 bg-[#1a73e8] rounded-full flex justify-center items-center shadow-[0_4px_12px_rgba(26,115,232,0.4)] hover:scale-105 transition-transform duration-200 cursor-pointer border-none"
          aria-label="Contact Us"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}