import { prisma } from './lib/prisma';
async function main() {
  const count = await prisma.subpageHero.count({ where: { slug: "booking-form" } });
  if (count === 0) {
    await prisma.subpageHero.create({
      data: {
        slug: "booking-form",
        title: "Book Your Adventure",
        subtitle: "Ready for the Himalayas? Fill out the form below to request a booking or customize your trip.",
        image: "https://images.unsplash.com/photo-1522199710521-72d69614c71c?q=80&w=2000&auto=format&fit=crop",
        published: true
      }
    });
    console.log("Seeded booking-form subpageHero");
  } else {
    console.log("Already seeded.");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
