const fs = require('fs');

const path = 'app/components/layout/NavbarClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Top Level Nav 
const topLevelNavOld = `            {/* Top Level Nav (from mockup) */}
            <Link href="/tour-destination/nepal" className="hover:text-accent-amber transition-colors">Nepal</Link>
            <Link href="/tour-destination/tibet" className="hover:text-accent-amber transition-colors">Tibet</Link>
            <Link href="/tour-destination/bhutan" className="hover:text-accent-amber transition-colors">Bhutan</Link>

            <Link href="/blog" className="hover:text-accent-amber transition-colors">Travel Guide</Link>`;

const topLevelNavNew = `            {/* Top Level Nav (from mockup) */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => setActiveDropdown('nepal')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <Link href="/tour-destination/nepal">Nepal</Link>
                <ChevronDown className="w-4 h-4" />
              </div>
              {activeDropdown === 'nepal' && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-b-2xl shadow-xl border-t border-gray-100 py-2">
                  <Link href="/trekking" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Trekking in Nepal</Link>
                  <Link href="/tour-destination/nepal" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Tours in Nepal</Link>
                  <Link href="/activities/peak-climbing" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Peak Climbing</Link>
                  <Link href="/activities/helicopter-tour" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Helicopter Tours</Link>
                  <Link href="/activities/wildlife-safari" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Wildlife Safari</Link>
                  <Link href="/activities/rafting" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Rafting</Link>
                  <Link href="/activities/bungee-jump" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Bungee Jump</Link>
                  <Link href="/activities/mountain-flight" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Mountain Flight</Link>
                  <Link href="/activities/day-tour" className="block px-6 py-3 text-[14px] font-bold text-gray-700 hover:text-accent-amber hover:bg-gray-50 normal-case tracking-normal">Day Tours</Link>
                </div>
              )}
            </div>

            <div 
              className="relative group py-7"
              onMouseEnter={() => setActiveDropdown('tibet-bhutan')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <span>Tibet & Bhutan</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {activeDropdown === 'tibet-bhutan' && (
                <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[1100px] bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 flex overflow-hidden">
                  
                  {/* Sidebar Regions */}
                  <div className="w-72 bg-gray-50 flex flex-col py-4 border-r border-gray-100">
                    {tourMegaMenuData.filter(r => r.slug !== 'nepal').map((region, idx) => {
                      const Icon = iconMap[region.iconName] || Mountain;
                      const isActive = activeTourRegionIdx === idx;
                      return (
                        <div 
                          key={region.slug}
                          onMouseEnter={() => setActiveTourRegionIdx(idx)}
                          className={\`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors \${isActive ? 'bg-white text-[#112233] border-l-4 border-l-accent-amber font-extrabold shadow-sm relative -mr-[1px]' : 'text-gray-600 hover:text-[#112233] hover:bg-gray-100 font-semibold border-l-4 border-l-transparent'}\`}
                        >
                          <Icon className={\`w-5 h-5 \${isActive ? 'text-accent-amber' : 'text-gray-400'}\`} />
                          <span className="text-[14px] normal-case tracking-normal">{region.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-8 bg-white flex flex-col">
                    {tourMegaMenuData.filter(r => r.slug !== 'nepal')[activeTourRegionIdx] && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-accent-amber">
                            <Mountain className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#112233]/50 uppercase tracking-widest mb-1">Featured {tourMegaMenuData.filter(r => r.slug !== 'nepal')[activeTourRegionIdx].name.split(' ')[0]} Trips</div>
                            <h3 className="text-2xl font-bold text-[#112233] normal-case tracking-tight">Handpicked tours in {tourMegaMenuData.filter(r => r.slug !== 'nepal')[activeTourRegionIdx].name.split(' ')[0]}</h3>
                          </div>
                        </div>

                        {/* Treks Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                          {tourMegaMenuData.filter(r => r.slug !== 'nepal')[activeTourRegionIdx].treks.map(trek => (
                            <Link key={trek.slug} href={\`/tour/\${trek.slug}\`} className="flex items-center justify-between group p-3 rounded-xl border border-gray-100 hover:border-[#112233]/20 hover:shadow-sm transition-all bg-white">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <Footprints className="w-4 h-4 text-[#112233]/40 group-hover:text-accent-amber shrink-0" />
                                <span className="text-[14px] font-bold text-[#112233] truncate normal-case tracking-normal group-hover:text-accent-amber transition-colors">{trek.title} - {trek.durationDays}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent-amber shrink-0" />
                            </Link>
                          ))}
                        </div>

                        {/* Bottom Banner */}
                        <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center border border-gray-100 group cursor-pointer relative">
                          <div className="w-48 h-28 relative shrink-0">
                            <img src={tourMegaMenuData.filter(r => r.slug !== 'nepal')[activeTourRegionIdx].treks[0]?.heroImage || "/default-hero.jpg"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Banner" />
                          </div>
                          <div className="p-5 flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center">
                                  <Mountain className="w-5 h-5 text-accent-amber" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-[#112233] normal-case tracking-normal text-[15px]">Ready for your {tourMegaMenuData.filter(r => r.slug !== 'nepal')[activeTourRegionIdx].name.split(' ')[0]} adventure?</h4>
                                  <p className="text-[12px] text-gray-500 normal-case tracking-normal">Our local experts will help you choose the perfect itinerary.</p>
                                </div>
                              </div>
                              <Link href={tourMegaMenuData.filter(r => r.slug !== 'nepal')[activeTourRegionIdx].href} className="bg-[#112233] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] normal-case tracking-normal hover:bg-[#1a2f4c] transition-colors flex items-center gap-2">
                                Explore All Tours <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            <Link href="/blog" className="hover:text-accent-amber transition-colors">Blog</Link>`;

content = content.replace(topLevelNavOld, topLevelNavNew);

// Replace "Tour Packages" with "Tours in Nepal" and limit to Nepal
// I will just replace the "Tour Packages" label
content = content.replace(
  '<Link href="/tour">Tour Packages</Link>',
  '<Link href="/tour-destination/nepal">Tours in Nepal</Link>'
);

// We need to filter tourMegaMenuData in the "Tours in Nepal" section so it only shows Nepal.
// We can just use \`tourMegaMenuData.filter(r => r.slug === 'nepal')\` but the sidebar won't make sense if there is only one region.
// Let's replace the whole tours dropdown.
const toursMenuOldStart = `            {/* Tour Packages Mega Menu */}`;
const toursMenuOldEnd = `            <Link href="/tour-destination/nepal"`;
const toursMenuOldRegex = new RegExp(toursMenuOldStart + '[\\\\s\\\\S]*?(?=' + toursMenuOldEnd.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&') + ')');

const toursMenuNew = \`            {/* Tour Packages Mega Menu */}
            <div 
              className="relative group py-7"
              onMouseEnter={() => setActiveDropdown('tours')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-accent-amber transition-colors cursor-pointer h-full">
                <Link href="/tour-destination/nepal">Tours in Nepal</Link>
                <ChevronDown className="w-4 h-4" />
              </div>

              {activeDropdown === 'tours' && (
                <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[1100px] bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 flex overflow-hidden">
                  
                  {/* Main Content Area (No Sidebar needed if just Nepal) */}
                  <div className="flex-1 p-8 bg-white flex flex-col">
                    {tourMegaMenuData.find(r => r.slug === 'nepal') && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-accent-amber">
                            <Mountain className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#112233]/50 uppercase tracking-widest mb-1">Featured Nepal Tours</div>
                            <h3 className="text-2xl font-bold text-[#112233] normal-case tracking-tight">Handpicked tours in Nepal</h3>
                          </div>
                        </div>

                        {/* Treks Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                          {tourMegaMenuData.find(r => r.slug === 'nepal')?.treks.map((trek: any) => (
                            <Link key={trek.slug} href={\`/tour/\${trek.slug}\`} className="flex items-center justify-between group p-3 rounded-xl border border-gray-100 hover:border-[#112233]/20 hover:shadow-sm transition-all bg-white">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <Footprints className="w-4 h-4 text-[#112233]/40 group-hover:text-accent-amber shrink-0" />
                                <span className="text-[14px] font-bold text-[#112233] truncate normal-case tracking-normal group-hover:text-accent-amber transition-colors">{trek.title} - {trek.durationDays}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent-amber shrink-0" />
                            </Link>
                          ))}
                        </div>

                        {/* Bottom Banner */}
                        <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center border border-gray-100 group cursor-pointer relative">
                          <div className="w-48 h-28 relative shrink-0">
                            <img src={tourMegaMenuData.find(r => r.slug === 'nepal')?.treks[0]?.heroImage || "/default-hero.jpg"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Banner" />
                          </div>
                          <div className="p-5 flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center">
                                  <Mountain className="w-5 h-5 text-accent-amber" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-[#112233] normal-case tracking-normal text-[15px]">Ready for your Nepal adventure?</h4>
                                  <p className="text-[12px] text-gray-500 normal-case tracking-normal">Our local experts will help you choose the perfect itinerary.</p>
                                </div>
                              </div>
                              <Link href="/tour-destination/nepal" className="bg-[#112233] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] normal-case tracking-normal hover:bg-[#1a2f4c] transition-colors flex items-center gap-2">
                                Explore All Tours <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

`;

content = content.replace(toursMenuOldRegex, toursMenuNew);

// Add Home before Trekking Mega Menu
const trekkingMenuStart = \`            {/* Nepal Trekking Mega Menu */}\`;
content = content.replace(trekkingMenuStart, \`<Link href="/" className="hover:text-accent-amber transition-colors">Home</Link>\n\n\` + trekkingMenuStart);

// Handle Mobile Menu Mapping
const mobileOldStart = \`              <Link href="/tour-destination/nepal" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><Mountain className="w-5 h-5"/> Nepal</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link href="/tour-destination/tibet" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><Tent className="w-5 h-5"/> Tibet</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link href="/tour-destination/bhutan" className="flex items-center justify-between px-6 py-5 border-b border-gray-100 text-[#112233] font-bold text-[16px]">
                <div className="flex items-center gap-4"><Map className="w-5 h-5"/> Bhutan</div> <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>\`;

const mobileNewStart = \`              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileSection('nepal')} 
                  className={\`flex items-center justify-between w-full px-6 py-5 font-bold text-[16px] \${expandedMobileSection === 'nepal' ? 'text-[#1e857c]' : 'text-[#112233]'}\`}
                >
                  <div className="flex items-center gap-4"><Mountain className="w-5 h-5"/> Nepal</div>
                  {expandedMobileSection === 'nepal' 
                    ? <div className="w-7 h-7 rounded-full border border-[#1e857c] flex items-center justify-center"><ChevronUp className="w-5 h-5" /></div>
                    : <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <AnimatePresence>
                  {expandedMobileSection === 'nepal' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50">
                      <div className="px-6 py-4 flex flex-col">
                        <div className="border-l-2 border-[#1e857c] ml-2 pl-6 flex flex-col gap-4">
                          <Link href="/trekking" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Trekking in Nepal</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/tour-destination/nepal" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Tours in Nepal</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/peak-climbing" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Peak Climbing</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/helicopter-tour" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Helicopter Tours</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/wildlife-safari" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Wildlife Safari</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/rafting" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Rafting</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/bungee-jump" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Bungee Jump</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/mountain-flight" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Mountain Flight</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/activities/day-tour" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Day Tours</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>\`;

content = content.replace(mobileOldStart, mobileNewStart);

// Handle Tibet/Bhutan mobile menu
const mobileTibetBhutanStart = \`              {/* Accordion: Tour Packages */}\`;
const mobileTibetBhutanNew = \`              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileSection('tibet-bhutan')} 
                  className={\`flex items-center justify-between w-full px-6 py-5 font-bold text-[16px] \${expandedMobileSection === 'tibet-bhutan' ? 'text-[#1e857c]' : 'text-[#112233]'}\`}
                >
                  <div className="flex items-center gap-4"><Compass className="w-5 h-5"/> Tibet & Bhutan</div>
                  {expandedMobileSection === 'tibet-bhutan' 
                    ? <div className="w-7 h-7 rounded-full border border-[#1e857c] flex items-center justify-center"><ChevronUp className="w-5 h-5" /></div>
                    : <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <AnimatePresence>
                  {expandedMobileSection === 'tibet-bhutan' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50">
                      <div className="px-6 py-4 flex flex-col">
                        <div className="border-l-2 border-[#1e857c] ml-2 pl-6 flex flex-col gap-4">
                          <Link href="/tour-destination/tibet" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Tibet Tours</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link href="/tour-destination/bhutan" className="flex items-center justify-between text-[#112233] font-semibold text-[15px]">
                            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#1e857c] shrink-0" /> Bhutan Tours</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>\n\n\` + mobileTibetBhutanStart;

content = content.replace(mobileTibetBhutanStart, mobileTibetBhutanNew);

// Remove the old Tours mobile accordion
const oldToursAccordionRegex = new RegExp('              {/\\\\* Accordion: Tour Packages \\\\*/}[\\\\s\\\\S]*?(?=              <Link href="/blog")');
content = content.replace(oldToursAccordionRegex, '');


// Background logic for navbar 
// "in all slug pages and pages that do not have a hero image, the navbar should have a bg - the blue one which we have in globals.css 
// we should aslo see this blue bg in navbar when we scroll in the other pages tho"
const headerClassesOld = \`  const headerClasses = isSolid 
    ? "bg-white text-[#112233] shadow-md border-b border-gray-100 transition-all duration-300"
    : "bg-transparent text-white border-transparent shadow-none transition-all duration-300";\`;
const headerClassesNew = \`  const headerClasses = isSolid 
    ? "bg-[#112233] text-white shadow-md border-b border-gray-800 transition-all duration-300"
    : "bg-transparent text-white border-transparent shadow-none transition-all duration-300";\`;
content = content.replace(headerClassesOld, headerClassesNew);


// Fix text color in sticky nav since it's now blue bg
content = content.replace(
  'className={`flex items-center gap-6 xl:gap-8 uppercase ${navTextClasses}`}',
  'className={`flex items-center gap-6 xl:gap-8 uppercase ${navTextClasses} text-white`}'
);
content = content.replace(
  'const isSlugPage = pathname.split(\'/\').length > 2;',
  'const isSlugPage = pathname.split(\'/\').length > 2 || pathname === "/contact-us" || pathname === "/about-us" || pathname === "/blog";'
);

fs.writeFileSync(path, content, 'utf8');

