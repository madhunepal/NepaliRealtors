import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MeroGharInUSA - Connect with Nepali Real Estate Pros",
  description: "The #1 platform for finding trusted Nepali real estate agents, lenders, and inspectors in the USA. Verified professionals who speak your language.",
  openGraph: {
    title: "MeroGharInUSA - Your Nepali Real Estate Network",
    description: "Find trusted Nepali real estate experts near you.",
    url: "https://merogharinusa.com",
    siteName: "MeroGharInUSA",
    images: [
      {
        url: "/og-image.jpg", // We need to add this image later
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white dark:bg-black">
      <Hero />
      <ValueProps />
    </main>
  );
}
