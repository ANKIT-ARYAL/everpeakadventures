const fs = require('fs');

function reorder(file) {
    let content = fs.readFileSync(file, 'utf8');

    const sectionRegex = /\{\/\*\s*={50,}\s*\n\s*([^=]+?)\s*\n\s*={50,}\s*\*\/\}/g;
    
    let parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = sectionRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
        }
        
        let nextIndex = content.length;
        const nextMatch = /\{\/\*\s*={50,}\s*\n/g;
        nextMatch.lastIndex = sectionRegex.lastIndex;
        const nextResult = nextMatch.exec(content);
        if (nextResult !== null) {
            nextIndex = nextResult.index;
        }
        
        parts.push({
            type: 'section',
            name: match[1].trim(),
            content: content.substring(match.index, nextIndex)
        });
        
        lastIndex = nextIndex;
        sectionRegex.lastIndex = nextIndex;
    }
    
    if (lastIndex < content.length) {
        parts.push({ type: 'text', content: content.substring(lastIndex) });
    }

    // Now we extract specific sections
    const getSection = (name) => {
        const idx = parts.findIndex(p => p.type === 'section' && p.name === name);
        if (idx !== -1) {
            const sec = parts[idx];
            parts.splice(idx, 1);
            return sec.content;
        }
        return '';
    };

    const s_quickFacts = getSection('QUICK FACTS (Unified Card UI)');
    const s_altitudeChart = getSection('ALTITUDE CHART');
    
    const s_departures = getSection('FIXED DEPARTURES');
    const s_routeMap = getSection('ROUTE MAP & ELEVATION');
    const s_equipment = getSection('EQUIPMENT & GEARS');
    const s_video = getSection('TREK VIDEO') || getSection('VIDEO GALLERY') || getSection('TOUR VIDEO') || '';
    const s_faqs = getSection('FAQS');
    const s_related = getSection('RELATED TREKS') || getSection('RELATED TOURS') || '';

    // Reconstruct the full width sections
    const fullWidthSections = [
        s_departures,
        s_routeMap,
        s_altitudeChart ? (s_altitudeChart.includes('<section') ? s_altitudeChart : `<section className="max-w-[1200px] mx-auto px-5 mt-10">\n${s_altitudeChart}\n</section>\n`) : '',
        s_quickFacts ? `<section className="max-w-[1200px] mx-auto px-5 mt-10">\n${s_quickFacts}\n</section>\n` : '',
        s_equipment,
        s_video,
        s_faqs,
        s_related
    ].filter(Boolean).join('\n');

    // Re-insert everything
    // Find the end of the MAIN GRID. It ends right before where EQUIPMENT & GEARS was.
    // In our `parts`, we just join the remaining parts, and then append the full width sections at the end of the file before the closing `</div>`?
    // Wait, let's find the closing tags of the MAIN GRID.
    // It's in the text part that was before EQUIPMENT & GEARS.
    
    let result = '';
    for (let i = 0; i < parts.length; i++) {
        result += (parts[i].type === 'section' ? parts[i].content : parts[i].content);
    }
    
    // We need to inject the fullWidthSections right before the closing `</div>\n  );\n}`
    // Or we can just find the end of the MAIN GRID `</section>` which was the container.
    // The main grid ends with:
    //             </Stagger>
    //           </div>
    //         </div>
    //       </section>
    
    result = result.replace(/<\/section>\s*$/, `</section>\n\n${fullWidthSections}\n\n`);
    
    // Wait, replacing `</section>` at the end of string might not work if there are other `</div>` after it.
    // Let's use a more robust replacement.
    // Look for `</section>\n\n    </div>\n  );\n}`
    
    const insertionPoint = result.lastIndexOf('</div>');
    // But `</div>` is just the wrapper.
    // Let's find `</section>` that closes the main grid.
    
    // The main grid is <section className=" mx-auto px-20 relative z-20"> ... </section>
    // Since we extracted the full width sections, the remaining `result` ends with the main grid's `</section>` and then `    </div>\n  );\n}`
    const endMatch = result.match(/(<\/section>[\s\n]*<\/div>[\s\n]*\);[\s\n]*})/);
    if (endMatch) {
        result = result.replace(endMatch[1], `</section>\n\n${fullWidthSections}\n\n    </div>\n  );\n}`);
    } else {
        // Fallback
        const lastDiv = result.lastIndexOf('</div>');
        result = result.substring(0, lastDiv) + `\n${fullWidthSections}\n` + result.substring(lastDiv);
    }
    
    fs.writeFileSync(file, result, 'utf8');
    console.log('Reordered', file);
}

reorder('app/trekking/[slug]/page.tsx');
reorder('app/tour/[slug]/page.tsx');
