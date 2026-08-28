import { prisma } from "@/lib/prisma";
import HeroContentForm from "./HeroContentForm";

export const dynamic = 'force-dynamic';

export default async function HeroContentPage() {
  const content = await prisma.heroContent.findFirst();
  return <HeroContentForm initialData={content} />;
}
