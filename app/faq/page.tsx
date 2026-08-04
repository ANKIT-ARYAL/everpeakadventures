import { prisma } from "@/lib/prisma";
import FAQClientPage from "@/app/components/pages/FAQClientPage";

export default async function Page() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' },
  });

  return <FAQClientPage faqs={faqs} />;
}