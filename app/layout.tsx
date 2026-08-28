import type { Metadata, Viewport } from "next";
import { Outfit, Manrope } from "next/font/google";
import { headers } from "next/headers";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${fontOutfit.variable} ${fontManrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden w-full">
        {isAdmin ? (
          <MotionProvider>
            {children}
            <HomeLoader />
          </MotionProvider>
        ) : (
          <SmoothScrollProvider>
            <MotionProvider>
              <Navbar />
              {children}
              <Footer />
              <ContactWidgetWrapper />
              <HomeLoader />
            </MotionProvider>
          </SmoothScrollProvider>
        )}
      </body>
    </html>
  );
}
