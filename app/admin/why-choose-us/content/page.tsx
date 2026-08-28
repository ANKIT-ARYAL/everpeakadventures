import { prisma } from "@/lib/prisma";
import TrustedPartnerForm from "./TrustedPartnerForm";

export const dynamic = 'force-dynamic';

export default async function WhyChooseUsContentPage() {
  const content = await prisma.trustedPartnerContent.findFirst();
  return <TrustedPartnerForm initialData={content} />;
}
