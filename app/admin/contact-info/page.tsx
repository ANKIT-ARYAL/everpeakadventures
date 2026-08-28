import { prisma } from "@/lib/prisma";
import ContactInfoForm from "./ContactInfoForm";

export const dynamic = 'force-dynamic';

export default async function ContactInfoPage() {
  const contactInfo = await prisma.contactInfo.findFirst();
  return <ContactInfoForm contactData={contactInfo} />;
}
