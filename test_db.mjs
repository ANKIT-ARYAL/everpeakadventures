import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const trek = await prisma.trek.findFirst({ where: { slug: 'classic-everest-trek-jiri' } })
  console.log(JSON.stringify(trek.overview.substring(0, 500)))
}
main()
