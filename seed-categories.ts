import { prisma } from './lib/prisma';

async function main() {
  // Delete existing "country" categories if they exist
  await prisma.tourCategory.deleteMany({
    where: {
      slug: {
        in: ['nepal', 'bhutan', 'tibet', 'india']
      }
    }
  });

  const targetTourCategories = [
    { name: "Nepal Classic Tour", slug: "nepal-classic-tour" },
    { name: "Nepal Heritage & Wildlife Tour", slug: "nepal-heritage-wildlife-tour" },
    { name: "Nepal Honeymoon Tour", slug: "nepal-honeymoon-tour" },
    { name: "Kathmandu City Tour", slug: "kathmandu-city-tour" },
    { name: "Kathmandu & Lumbini Tour", slug: "kathmandu-lumbini-tour" },
    { name: "Pokhara & Nagarkot Tour", slug: "pokhara-nagarkot-tour" },
    { name: "Nagarkot Sunrise Tour", slug: "nagarkot-sunrise-tour" },
  ];

  for (let i = 0; i < targetTourCategories.length; i++) {
    const cat = targetTourCategories[i];
    await prisma.tourCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        order: i,
        description: `Explore our beautiful ${cat.name} packages.`,
        published: true
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        order: i,
        description: `Explore our beautiful ${cat.name} packages.`,
        published: true
      }
    });
  }

  console.log("Updated Tour Categories");

  // Now let's assign some tours to these categories
  // "nepal-classic-tour" -> assign to the tour named "Nepal Classic Tour"
  // Wait, let's fetch all tours and just push the matching category names to their regions
  const allTours = await prisma.tour.findMany();
  
  for (const tour of allTours) {
    let newRegions = [...tour.regions];
    let updated = false;

    // A simple heuristic: if the tour title matches the category name, assign it.
    for (const cat of targetTourCategories) {
      // If the tour title contains parts of the category name, or just to make sure there's data,
      // I'll assign the exact matching ones.
      if (tour.slug.includes(cat.slug.replace('-tour', '')) || tour.title.toLowerCase().includes(cat.name.split(' ')[0].toLowerCase())) {
        if (!newRegions.includes(cat.name)) {
          newRegions.push(cat.name);
          updated = true;
        }
      }
      
      // Specifically map the ones they mentioned
      if (cat.slug === 'nepal-classic-tour' && tour.slug === 'nepal-classic-tour') {
        if (!newRegions.includes(cat.name)) { newRegions.push(cat.name); updated = true; }
      }
    }

    if (updated) {
      await prisma.tour.update({
        where: { id: tour.id },
        data: { regions: newRegions }
      });
      console.log(`Updated regions for tour: ${tour.title}`);
    }
  }

  console.log("Finished updating tours");
}

main().catch(console.error).finally(() => prisma.$disconnect());
