require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const treks = await prisma.trek.findMany({
    where: { published: true },
    select: { title: true, slug: true, regions: true }
  });
  const withRegions = treks.filter(t => t.regions && t.regions.length > 0);
  console.log(withRegions.length, "treks have regions assigned");
  if (withRegions.length > 0) {
    console.log("Sample region data:", withRegions[0].regions);
  }
}
run();
