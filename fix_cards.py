import re

with open('app/components/pages/TrekkingPage.tsx', 'r') as f:
    trek_content = f.read()

with open('app/components/pages/TourPackagesPage.tsx', 'r') as f:
    tour_content = f.read()

# Make grids bigger (3 cols instead of 4)
trek_content = trek_content.replace('lg:grid-cols-4', 'lg:grid-cols-3')
tour_content = tour_content.replace('lg:grid-cols-4', 'lg:grid-cols-3')

# Standardize the Trekking Card
trek_card_regex = re.compile(r'<StaggerItem\s+key={trek\.id}.*?<\/StaggerItem>', re.DOTALL)
new_trek_card = """<StaggerItem
                  key={trek.id} 
                  className="journey-card bg-white rounded-xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-lg transition-all"
                >
                  <Link href={`/trekking/${trek.slug ? trek.slug : trek.id}`}>
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img 
                        src={trek.heroImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
                        alt={trek.title}
                        className={`w-full h-full ${!trek.heroImage ? 'object-contain p-4 bg-white' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                      />
                      {trek.price && (
                        <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-sm text-white font-sans font-black text-sm px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                          US$ {(trek.discountedPrice ?? trek.price).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-bold text-[#222222] text-xl line-clamp-2 mb-4 group-hover:text-[#24a0ed] transition-colors min-h-[56px]">
                          {trek.title}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-center mb-5 text-md">
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Duration</span>
                          <span className="font-bold text-[#222222] text-sm">{trek.durationDays}</span>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Difficulty</span>
                          <span className="font-bold text-[#222222] text-sm">{trek.difficulty || 'Moderate'}</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#112233] text-white font-bold py-3 rounded-lg text-center uppercase tracking-wider text-sm transition-colors group-hover:bg-[#24a0ed]">
                        Explore Trek
                      </div>
                    </div>
                  </Link>
                </StaggerItem>"""
trek_content = trek_card_regex.sub(new_trek_card, trek_content)


# Standardize the Tour Card
tour_card_regex = re.compile(r'<StaggerItem\s+key={pkg\.id}.*?<\/StaggerItem>', re.DOTALL)
new_tour_card = """<StaggerItem
                  key={pkg.id} 
                  className="journey-card bg-white rounded-xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-lg transition-all"
                >
                  <Link href={`/tour/${pkg.slug ? pkg.slug : pkg.id}`}>
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img 
                        src={pkg.heroImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
                        alt={pkg.title}
                        className={`w-full h-full ${!pkg.heroImage ? 'object-contain p-4 bg-white' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                      />
                      {pkg.price && (
                        <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-sm text-white font-sans font-black text-sm px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                          US$ {(pkg.discountedPrice ?? pkg.price).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-bold text-[#222222] text-xl line-clamp-2 mb-4 group-hover:text-[#24a0ed] transition-colors min-h-[56px]">
                          {pkg.title}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-center mb-5 text-md">
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Duration</span>
                          <span className="font-bold text-[#222222] text-sm">{pkg.duration}</span>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Best Time</span>
                          <span className="font-bold text-[#222222] text-sm">{pkg.bestTime || 'Anytime'}</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#112233] text-white font-bold py-3 rounded-lg text-center uppercase tracking-wider text-sm transition-colors group-hover:bg-[#24a0ed]">
                        Explore Tour
                      </div>
                    </div>
                  </Link>
                </StaggerItem>"""
tour_content = tour_card_regex.sub(new_tour_card, tour_content)

with open('app/components/pages/TrekkingPage.tsx', 'w') as f:
    f.write(trek_content)

with open('app/components/pages/TourPackagesPage.tsx', 'w') as f:
    f.write(tour_content)

