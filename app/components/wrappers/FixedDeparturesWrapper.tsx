import { prisma } from "@/lib/prisma";
import { getFrontendDepartures } from "@/lib/departures";
import FixedDepartures from "../home/FixedDepartures";

export default async function FixedDeparturesWrapper() {
  const departures = await getFrontendDepartures(true);
  const section = await prisma.homeSectionContent.findFirst();

  if (section && !section.published) return null;
  if (departures.length === 0) return null;

  return (
    <FixedDepartures
      data={departures}
      label={section?.fixedDeparturesLabel}
      title={section?.fixedDeparturesTitle}
    />
  );
}
