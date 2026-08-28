import re

def reorder_tsx(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find where the main column starts and ends.
    # The main column starts at <div className="lg:col-span-2 lg:order-1 space-y-6">
    # and ends before the right sidebar or container end.
    
    # We can split the entire content by the comment blocks.
    # The regex looks for `{/* =====` and captures everything until the next `{/* =====` or end of file.
    
    parts = re.split(r'(?=\{\/\*\s*={50,}\s*\n)', content)
    
    # We will identify each part by its text content.
    sections = {}
    for p in parts:
        if 'QUICK FACTS' in p: sections['quick_facts'] = p
        elif 'TRIP OVERVIEW' in p: sections['overview'] = p
        elif 'HIGHLIGHTS' in p: sections['highlights'] = p
        elif 'ITINERARY' in p: sections['itinerary'] = p
        elif 'ALTITUDE CHART' in p: sections['altitude'] = p
        elif 'INCLUDES / EXCLUDES' in p: sections['includes'] = p
        elif 'EQUIPMENT & GEARS' in p: sections['equipment'] = p
        elif 'FIXED DEPARTURES' in p: sections['departures'] = p
        elif 'ROUTE MAP' in p: sections['route_map'] = p
        elif 'FAQS' in p: sections['faqs'] = p
        elif 'VIDEO GALLERY' in p: sections['video'] = p
        elif 'RELATED' in p: sections['related'] = p
        else:
            if 'galleryImages' in p and 'TrekGalleryGrid' in p:
                sections['gallery'] = p
            elif 'MAIN GRID' in p:
                sections['main_grid'] = p
            elif 'LEFT SIDEBAR' in p:
                sections['sidebar'] = p
            elif 'RIGHT COLUMN' in p:
                sections['right_column'] = p # This is where Gallery starts
            else:
                if 'top_part' not in sections:
                    sections['top_part'] = p
                else:
                    sections['bottom_part'] = p

    # We need to accurately reconstruct the file.
    # The original structure:
    # Top part (imports, component definition, Breadcrumbs, StickySectionNav)
    # MAIN GRID
    #   <section className=" mx-auto px-20 relative z-20">
    #     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    #       LEFT SIDEBAR (Booking widget, lg:order-2)
    #       RIGHT COLUMN (Main content, lg:col-span-2 lg:order-1)
    #          Gallery
    #          Quick Facts
    #          Overview
    #          Highlights
    #          Itinerary
    #          Altitude chart
    #          Includes/Excludes
    #       (End of Right Column)
    #     (End of grid)
    #   </section>
    # EQUIPMENT
    # DEPARTURES
    # ROUTE MAP
    # VIDEO
    # FAQS
    # RELATED
    # Bottom part
    
    # The Right Column header is actually in `parts` too.
    # Let's just do targeted string replacements to move the blocks.
    pass

if __name__ == '__main__':
    reorder_tsx('app/trekking/[slug]/page.tsx')
