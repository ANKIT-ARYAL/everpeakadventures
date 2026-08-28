import { prisma } from './lib/prisma';

async function main() {
  const categories = [
    { name: 'Nepal Classic Tour', slug: 'nepal-classic-tour' },
    { name: 'Nepal Heritage & Wildlife Tour', slug: 'nepal-heritage-wildlife-tour' },
    { name: 'Nepal Honeymoon Tour', slug: 'nepal-honeymoon-tour' },
    { name: 'Kathmandu City Tour', slug: 'kathmandu-city-tour' },
    { name: 'Kathmandu & Lumbini Tour', slug: 'kathmandu-lumbini-tour' },
    { name: 'Pokhara & Nagarkot Tour', slug: 'pokhara-nagarkot-tour' },
    { name: 'Nagarkot Sunrise Tour', slug: 'nagarkot-sunrise-tour' }
  ];

  console.log("Seeding Tour Categories...");

  for (const cat of categories) {
    const existing = await prisma.tourCategory.findUnique({
      where: { slug: cat.slug }
    });

    if (!existing) {
      await prisma.tourCategory.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: `Category for ${cat.name}`,
          image: '',
          published: true
        }
      });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
  }

  console.log("Finished seeding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
