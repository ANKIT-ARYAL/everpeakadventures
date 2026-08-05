import { prisma } from "@/lib/prisma";
import FAQClientPage from "@/app/components/pages/FAQClientPage";

export default async function Page() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' },
  });

  const hero = await prisma.subpageHero.findUnique({ where: { slug: 'faq' } });

  return <FAQClientPage faqs={faqs} heroTitle={hero?.title} heroSubtitle={hero?.subtitle ?? undefined} heroImage={hero?.image ?? undefined} />;
}