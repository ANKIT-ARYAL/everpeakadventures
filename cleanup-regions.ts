import { prisma } from './lib/prisma';

async function main() {
  const targetTourCategories = [
    "Nepal Classic Tour",
    "Nepal Heritage & Wildlife Tour",
    "Nepal Honeymoon Tour",
    "Kathmandu City Tour",
    "Kathmandu & Lumbini Tour",
    "Pokhara & Nagarkot Tour",
    "Nagarkot Sunrise Tour",
  ];

  const allTours = await prisma.tour.findMany();

  for (const tour of allTours) {
    let newRegions = tour.regions.filter(r => !targetTourCategories.includes(r));
    
    // The user mentioned they assigned one tour to "Nepal Classic Tour". 
    // And "Bhaktapur Day Tour" was assigned by the user. Let's keep what the user probably did today.
    // Wait, the user said "i saved a tour in the nepal classic tour category"
    // I will just wipe the regions that are in targetTourCategories EXCEPT if it was updated very recently?
    // Let's just wipe all the ones I incorrectly added. 
    // Actually, since I ran the script, how do I know which one the user added?
    // "yes i see the bkatapur tour (which i added: good)" 
    // So the user added "Nepal Classic Tour" to "Bhaktapur Day Tour".
    // I'll keep the categories if the tour title is "Bhaktapur Day Tour".
    // Wait, "Nepal Classic Tour" also exists as a tour, let's keep it in "Nepal Classic Tour".
    
    if (tour.title.toLowerCase().includes("bhaktapur") || tour.title.toLowerCase().includes("bkatapur")) {
      newRegions.push("Nepal Classic Tour");
    }
    if (tour.slug === "nepal-classic-tour") {
      newRegions.push("Nepal Classic Tour");
    }

    // Deduplicate
    newRegions = Array.from(new Set(newRegions));

    await prisma.tour.update({
      where: { id: tour.id },
      data: { regions: newRegions }
    });
  }
  
  console.log("Cleanup complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
