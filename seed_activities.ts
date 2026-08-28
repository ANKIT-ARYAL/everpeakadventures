import { prisma } from './lib/prisma';

async function main() {
  const activities = [
    { title: 'Peak Climbing', slug: 'peak-climbing' },
    { title: 'Helicopter Tours', slug: 'helicopter-tours' },
    { title: 'Wildlife Safari', slug: 'wildlife-safari' },
    { title: 'Rafting', slug: 'rafting' },
    { title: 'Bungee Jump', slug: 'bungee-jump' },
    { title: 'Mountain Flight', slug: 'mountain-flight' },
    { title: 'Day Tours', slug: 'day-tours' },
  ];

  for (const activity of activities) {
    const exists = await prisma.activity.findUnique({
      where: { slug: activity.slug }
    });
    
    if (!exists) {
      await prisma.activity.create({
        data: {
          title: activity.title,
          slug: activity.slug,
        }
      });
      console.log(`Created activity: ${activity.title}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
