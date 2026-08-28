import { prisma } from "@/lib/prisma";
import ContactUsClient from "@/app/components/pages/ContactUsClient";

export default async function Page() {
  const info = await prisma.contactInfo.findFirst({
    where: { published: true },
  });

  const defaultInfo = {
    address: 'Kathmandu, Nepal',
    phone: '9851093960',
    email: 'info@everpeakadventures.com',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.246473636257!2d85.3150!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zThe Kathmandu!5e0!3m2!1sen!2snp!4v1650000000000!5m2!1sen!2snp',
  };

  const hero = await prisma.subpageHero.findFirst({ where: { slug: 'contact-us', published: true } });

  return <ContactUsClient info={info || defaultInfo} heroTitle={hero?.title} heroSubtitle={hero?.subtitle ?? undefined} heroImage={hero?.image ?? undefined} />;
}