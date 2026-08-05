import { prisma } from "@/lib/prisma";
import ContactWidget from "./ContactWidget";

export default async function ContactWidgetWrapper() {
  const settings = await prisma.contactWidgetSettings.findFirst();

  return (
    <ContactWidget
      enabled={settings?.enabled ?? true}
      whatsapp={settings?.whatsapp ?? "9851093960"}
      viber={settings?.viber ?? ""}
      phone={settings?.phone ?? "9851093960"}
      email={settings?.email ?? "info@everpeakadventures.com"}
    />
  );
}
