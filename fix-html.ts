import { prisma } from './lib/prisma';
async function main() { 
  const posts = await prisma.blogPost.findMany();
  for (const post of posts) {
    if (post.content.includes('image-collage-2') && post.content.includes('data-images="[&quot;')) {
      let content = post.content;
      // Extract the data-images attribute value correctly
      const match = content.match(/data-images="([^"]+)"/);
      if (match) {
        const rawJson = match[1].replace(/&quot;/g, '"');
        try {
          const images = JSON.parse(rawJson);
          const count = images.length;
          let gridHtml = `<div class="image-collage-grid image-collage-${count}">`;
          for (const src of images) {
            gridHtml += `<div class="image-collage-item"><img src="${src}" alt="Collage image"></div>`;
          }
          gridHtml += `</div>`;
          
          content = content.replace(/<div class="image-collage-grid image-collage-2"><\/div>/, gridHtml);
          
          await prisma.blogPost.update({
            where: { id: post.id },
            data: { content }
          });
          console.log(`Updated post: ${post.title}`);
        } catch (e) {
          console.error("Failed to parse JSON for post", post.title);
        }
      }
    }
  }
}
main().finally(() => prisma.$disconnect());
