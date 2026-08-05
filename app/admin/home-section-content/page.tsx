import { prisma } from "@/lib/prisma";
import HomeSectionContentForm from "./HomeSectionContentForm";

export const dynamic = 'force-dynamic';

export default async function HomeSectionContentPage() {
  const content = await prisma.homeSectionContent.findFirst();
  return <HomeSectionContentForm initialData={content} />;
}
