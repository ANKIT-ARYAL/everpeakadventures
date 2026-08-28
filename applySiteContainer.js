const fs = require('fs');

function applySiteContainer(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace: className="mx-auto px-5 lg:px-20 relative z-20"
    // With: className="site-container relative z-20"
    content = content.replace(
        /className="mx-auto px-5 lg:px-20 relative z-20"/g,
        'className="site-container relative z-20"'
    );

    // Replace: className="mx-auto px-5 lg:px-20 mt-10"
    // With: className="site-container mt-10"
    content = content.replace(
        /className="mx-auto px-5 lg:px-20 (mt-\d+)"/g,
        'className="site-container $1"'
    );
    
    // Also catch className="mx-auto px-5 lg:px-20"
    content = content.replace(
        /className="mx-auto px-5 lg:px-20"/g,
        'className="site-container"'
    );
    
    // If there were any missed mx-auto px-20 without lg
    content = content.replace(
        /className=" mx-auto px-20 relative z-20"/g,
        'className="site-container relative z-20"'
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Applied site-container for', file);
}

applySiteContainer('app/trekking/[slug]/page.tsx');
applySiteContainer('app/tour/[slug]/page.tsx');
