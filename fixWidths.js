const fs = require('fs');

function fixWidths(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace MAIN GRID wrapper
    // From: <section className=" mx-auto px-20 relative z-20">
    // To: <section className="max-w-[1400px] mx-auto px-5 lg:px-20 relative z-20">
    content = content.replace(
        /<section className=" mx-auto px-20 relative z-20">/g, 
        '<section className="max-w-[1400px] mx-auto px-5 lg:px-20 relative z-20">'
    );

    // Replace max-w-[1200px] wrappers
    content = content.replace(
        /<section className="max-w-\[1200px\] mx-auto px-5 (mt-\d+)">/g,
        '<section className="max-w-[1400px] mx-auto px-5 lg:px-20 $1">'
    );
    
    // Also, there might be a case where `mt-10` is missing but it's just `max-w-[1200px] mx-auto px-5`
    content = content.replace(
        /className="max-w-\[1200px\] mx-auto px-5"/g,
        'className="max-w-[1400px] mx-auto px-5 lg:px-20"'
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed widths for', file);
}

fixWidths('app/trekking/[slug]/page.tsx');
fixWidths('app/tour/[slug]/page.tsx');
