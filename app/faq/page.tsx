import { prisma } from "@/lib/prisma";
import FAQClientPage from "@/app/components/pages/FAQClientPage";

export default async function Page() {
  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  const hero = await prisma.subpageHero.findFirst({ where: { slug: 'faq', published: true } });

  return <FAQClientPage faqs={faqs} heroTitle={hero?.title} heroSubtitle={hero?.subtitle ?? undefined} heroImage={hero?.image ?? undefined} />;
}