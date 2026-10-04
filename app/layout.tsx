import type { Metadata, Viewport } from "next";
import { Outfit, Manrope } from "next/font/google";

import "./globals.css";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ContactWidgetWrapper from "./components/widget/ContactWidgetWrapper";
import HomeLoader from "./components/loading/HomeLoader";
import { MotionProvider } from "./components/animations/Motion";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

const fontOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fontManrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ever Peak Adventure",
  description:
    "Ever Peak Adventure - authentic trekking, peak climbing, and cultural tours across Nepal, Bhutan, and Tibet. Expert local guides, safe itineraries, and unforgettable Himalayan experiences.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 10,
  userScalable: true,
  viewportFit: "cover",
};

import RootClientWrapper from "./components/layout/RootClientWrapper";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontOutfit.variable} ${fontManrope.variable} h-full antialiased bg-[var(--background)]`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden w-full max-w-[1920px] mx-auto relative shadow-[0_0_60px_rgba(0,0,0,0.05)]">
        <RootClientWrapper
          navbar={<Navbar />}
          footer={<Footer />}
          contactWidget={<ContactWidgetWrapper />}
          homeLoader={<HomeLoader />}
        >
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}
