import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Instrument_Serif } from "next/font/google";

import "@/app/globals.css";
import { CampusShareProvider } from "@/components/providers/campusshare-provider";
import { RouteTransitionProvider } from "@/components/providers/route-transition-provider";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://campusshare.vercel.app"),
  title: {
    default: "CampusShare",
    template: "%s | CampusShare"
  },
  description:
    "CampusShare helps students find free food, supplies, and trusted campus resources in real time through a community-verified map.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "CampusShare",
    description:
      "A community-verified campus map for free food, supplies, and local resources around UNT and beyond.",
    url: "https://campusshare.vercel.app",
    siteName: "CampusShare",
    locale: "en_US",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#FEFAE0",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable} bg-cream font-sans text-bark antialiased`}
      >
        <ServiceWorkerProvider>
          <RouteTransitionProvider>
            <CampusShareProvider>{children}</CampusShareProvider>
          </RouteTransitionProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
