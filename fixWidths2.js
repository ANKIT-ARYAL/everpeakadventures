const fs = require('fs');

function fixWidths(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove the max-w-[1400px] entirely from these sections
    content = content.replace(
        /className="max-w-\[1400px\] mx-auto px-5 lg:px-20/g,
        'className="mx-auto px-5 lg:px-20'
    );

    // Some sections might have been written manually with slightly different spacing
    content = content.replace(
        /className="max-w-\[1400px\] mx-auto/g,
        'className="mx-auto'
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed widths for', file);
}

fixWidths('app/trekking/[slug]/page.tsx');
fixWidths('app/tour/[slug]/page.tsx');
