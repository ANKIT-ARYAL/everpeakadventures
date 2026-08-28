import os

with open('app/blog/[slug]/page.tsx', 'r') as f:
    content = f.read()

# 2. Make buttons bigger (if they exist)
old_buttons = """            <div className="grid grid-cols-2 gap-3">
              <Link href="/send-inquiry" className="bg-white border border-gray-200 hover:border-[#112233] text-gray-700 font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl text-center transition-colors">
                Customize Trip
              </Link>
              <button className="bg-white border border-gray-200 hover:border-[#112233] text-gray-700 font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl text-center transition-colors flex justify-center items-center gap-2">
                Download PDF
              </button>
            </div>"""

new_buttons = """            <div className="grid grid-cols-2 gap-4 mt-2">
              <Link href="/send-inquiry" className="bg-white border border-gray-300 hover:border-[#24a0ed] hover:text-[#24a0ed] hover:shadow-md text-gray-800 font-bold text-sm uppercase tracking-wider py-4 rounded-xl text-center transition-all flex justify-center items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Customize
              </Link>
              <button className="bg-white border border-gray-300 hover:border-[#24a0ed] hover:text-[#24a0ed] hover:shadow-md text-gray-800 font-bold text-sm uppercase tracking-wider py-4 rounded-xl text-center transition-all flex justify-center items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </button>
            </div>"""

content = content.replace(old_buttons, new_buttons)

# 3. Fix You May Also Like cards
import re
related_regex = re.compile(r'<StaggerItem\s+key={item\.id}\s+className="bg-white.*?<\/button>\s*<\/div>\s*<\/Link>\s*<\/StaggerItem>', re.DOTALL)
new_related = """<StaggerItem
                  key={item.id}
                  className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-md"
                >
                  <Link href={`/blog/${item.slug ? item.slug : item.id}`} className="absolute inset-0">
                    {/* Image */}
                    <img 
                      src={relatedHeroImage} 
                      alt={item.title}
                      className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]`}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                      <h3 className="text-2xl font-display font-medium text-white mb-3 group-hover:text-accent-amber transition-colors">
                        {item.title}
                      </h3>
                      <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="text-white hover:text-accent-amber text-lg font-sans pt-3 border-t border-white/20 mt-2 flex items-center gap-2 font-semibold transition-colors">
                          Read More
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>"""

content = related_regex.sub(new_related, content)

with open('app/blog/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Updated blog slug")
