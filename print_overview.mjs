import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const trek = await prisma.trek.findFirst({ where: { slug: 'classic-everest-trek-jiri' } })
  console.log("TREK OVERVIEW:")
  console.log(JSON.stringify(trek.overview))
  const tour = await prisma.tour.findFirst({ where: { slug: 'everest-mountain-flight' } })
  console.log("TOUR OVERVIEW:")
  console.log(JSON.stringify(tour.overview))
}
main()
