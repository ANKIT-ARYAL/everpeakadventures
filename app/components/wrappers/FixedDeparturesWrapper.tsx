import { prisma } from "@/lib/prisma";
import FixedDepartures from "../home/FixedDepartures";


export default async function FixedDeparturesWrapper() {
  const departures = await prisma.fixedDeparture.findMany({
    orderBy: { order: 'asc' },
  });

  return <FixedDepartures data={departures} />;
}