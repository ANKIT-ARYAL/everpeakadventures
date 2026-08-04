"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactForm(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const contactMethod = formData.get("contactMethod") as string;
    const bestTime = formData.get("bestTime") as string;
    const message = formData.get("message") as string;

    await prisma.contactSubmission.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        contactMethod,
        bestTime,
        message,
      },
    });

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, message: "Failed to send message. Please try again." };
  }
}