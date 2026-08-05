import { prisma } from "@/lib/prisma";
import FixedDepartures from "../home/FixedDepartures";


export default async function FixedDeparturesWrapper() {
  const departures = await prisma.fixedDeparture.findMany({
    orderBy: { order: 'asc' },
  });

  const section = await prisma.homeSectionContent.findFirst();

  return (
    <FixedDepartures
      data={departures}
      label={section?.fixedDeparturesLabel}
      title={section?.fixedDeparturesTitle}
    />
  );
}