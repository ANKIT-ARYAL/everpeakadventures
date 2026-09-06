const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const content = await prisma.whyPageContent.findFirst();
  if (content && content.contentHtml.includes('<h3')) {
    // Parse the HTML
    const reasons = [];
    const html = content.contentHtml;
    
    const h3Regex = /<h3[^>]*>(.*?)<\/h3>/g;
    const pRegex = /<p[^>]*>(.*?)<\/p>/g;
    
    let h3Match, pMatch;
    while ((h3Match = h3Regex.exec(html)) !== null) {
      pMatch = pRegex.exec(html);
      if (pMatch) {
        reasons.push({
          title: h3Match[1].replace(/<[^>]+>/g, '').trim(),
          description: pMatch[1].replace(/<[^>]+>/g, '').trim(),
          image: ''
        });
      }
    }
    
    if (reasons.length > 0) {
      await prisma.whyPageContent.update({
        where: { id: content.id },
        data: { contentHtml: JSON.stringify(reasons) }
      });
      console.log("Updated WhyPageContent to JSON. Found " + reasons.length + " reasons.");
    } else {
      console.log("No reasons found.");
    }
  } else {
    console.log("No HTML content to convert or already converted.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
