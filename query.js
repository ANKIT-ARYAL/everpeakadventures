/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const treks = await prisma.trek.findMany({ select: { region: true, durationDays: true, difficulty: true, price: true }, take: 5 })
  console.log(JSON.stringify(treks, null, 2))
}
main()
