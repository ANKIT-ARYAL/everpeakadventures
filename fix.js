const fs = require('fs');

function fix(file) {
    let content = fs.readFileSync(file, 'utf8');
    // Find extra closing tags at the very end
    const badSuffix = /<\/div>\s*\);\s*}\s*<\/div>\s*\);\s*}\s*$/;
    if (badSuffix.test(content)) {
        content = content.replace(/<\/div>\s*\);\s*}\s*$/, '');
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    } else {
        // Maybe it's just extra at the end
        const match = content.match(/(<\/div>[\s\n]*\);[\s\n]*})[\s\n]*(<\/div>[\s\n]*\);[\s\n]*})[\s\n]*$/);
        if (match) {
            content = content.substring(0, content.length - match[2].length);
            fs.writeFileSync(file, content, 'utf8');
            console.log('Fixed', file);
        } else {
            console.log('Not found in', file);
        }
    }
}

fix('app/trekking/[slug]/page.tsx');
fix('app/tour/[slug]/page.tsx');
