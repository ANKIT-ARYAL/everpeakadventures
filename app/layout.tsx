import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Footer from "./components/layout/Footer";
import NavbarWrapper from "./components/wrappers/NavbarWrapper";
import ContactWidgetWrapper from "./components/widget/ContactWidgetWrapper";
import HomeLoader from "./components/loading/HomeLoader";
import { MotionProvider } from "./components/animations/Motion";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ever Peak Adventure",
  description:
    "Ever Peak Adventure - authentic trekking, peak climbing, and cultural tours across Nepal, Bhutan, and Tibet. Expert local guides, safe itineraries, and unforgettable Himalayan experiences.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          <MotionProvider>
            {!isAdmin && <NavbarWrapper />}
            {children}
            {!isAdmin && <Footer />}
            {!isAdmin && <ContactWidgetWrapper />}
            <HomeLoader />
          </MotionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
