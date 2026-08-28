import re

def reorder_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # The sections we want to extract:
    # 1. key-points
    # 2. trip-overview
    # 3. highlights
    # 4. itinerary
    # 5. departures
    # 6. altitude-chart
    # 7. include/exclude (Stagger block)
    # 8. equipment (Stagger block)
    # 9. FAQs
    
    # We will just print the grep line numbers for now.
    lines = content.split('\n')
    for i, l in enumerate(lines):
        if 'id="key-points"' in l: print("key-points:", i)
        if 'id="trip-overview"' in l: print("trip-overview:", i)
        if 'id="highlights"' in l: print("highlights:", i)
        if 'id="itinerary"' in l: print("itinerary:", i)
        if 'id="departures"' in l: print("departures:", i)
        if 'id="altitude-chart"' in l: print("altitude-chart:", i)
        if 'id="include"' in l: print("include:", i)
        if 'id="exclude"' in l: print("exclude:", i)
        if 'id="equipment"' in l: print("equipment:", i)
        if 'FAQS' in l: print("FAQS:", i)

if __name__ == "__main__":
    reorder_file("app/trekking/[slug]/page.tsx")
