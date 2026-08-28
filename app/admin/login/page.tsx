import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session) {
    redirect("/admin");
  }

  const siteSettings = await prisma.siteSettings.findFirst().catch(() => null);
  const heroImage = siteSettings?.loginHeroImage || siteSettings?.logoImage || "https://i.ibb.co/dJxBbFks/brandasset.png";

  return <LoginForm heroImage={heroImage} />;
}
