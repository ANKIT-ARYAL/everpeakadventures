import { prisma } from './lib/prisma';

const items = [
  // MAIN TREKKING GEAR
  { category: 'MAIN TREKKING GEAR', name: 'Backpack (40L - 60L)', order: 1 },
  { category: 'MAIN TREKKING GEAR', name: 'Sleeping Bag (Rated to -15°C)', order: 2 },
  { category: 'MAIN TREKKING GEAR', name: 'Trekking Poles', order: 3 },
  { category: 'MAIN TREKKING GEAR', name: 'Headlamp with extra batteries', order: 4 },

  // CLOTHING, HEADWEAR & FOOTWEAR (From screenshot)
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Base layer tops and bottoms', order: 1 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Fleece jacket or mid layer', order: 2 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Down jacket', order: 3 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Waterproof shell jacket and pants', order: 4 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Trekking pants and thermal innerwear', order: 5 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Quick-dry T-shirts', order: 6 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Warm hat / beanie', order: 7 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Sun hat or cap', order: 8 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Buff / neck gaiter', order: 9 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Liner gloves and insulated gloves', order: 10 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Hiking boots and camp shoes', order: 11 },
  { category: 'CLOTHING, HEADWEAR & FOOTWEAR', name: 'Wool or trekking socks', order: 12 },

  // TOILETRIES, HYGIENE & PERSONAL CARE
  { category: 'TOILETRIES, HYGIENE & PERSONAL CARE', name: 'Toothbrush and toothpaste', order: 1 },
  { category: 'TOILETRIES, HYGIENE & PERSONAL CARE', name: 'Biodegradable soap', order: 2 },
  { category: 'TOILETRIES, HYGIENE & PERSONAL CARE', name: 'Wet wipes and hand sanitizer', order: 3 },
  { category: 'TOILETRIES, HYGIENE & PERSONAL CARE', name: 'Toilet paper', order: 4 },
  { category: 'TOILETRIES, HYGIENE & PERSONAL CARE', name: 'Sunscreen (SPF 50+) and lip balm', order: 5 },

  // HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS
  { category: 'HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS', name: 'Personal first-aid kit', order: 1 },
  { category: 'HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS', name: 'Water purification tablets', order: 2 },
  { category: 'HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS', name: 'Power bank', order: 3 },
  { category: 'HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS', name: 'Universal adapter', order: 4 },

  // OPTIONAL & RECOMMENDED ITEMS
  { category: 'OPTIONAL & RECOMMENDED ITEMS', name: 'Book or Kindle', order: 1 },
  { category: 'OPTIONAL & RECOMMENDED ITEMS', name: 'Playing cards', order: 2 },
  { category: 'OPTIONAL & RECOMMENDED ITEMS', name: 'Trekking snacks', order: 3 },
];

async function main() {
  console.log('Seeding packing items...');
  for (const item of items) {
    await prisma.packingItem.create({
      data: item
    });
  }
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
