import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Private Morocco journeys from 3 to 12 days. Sahara desert, imperial cities, Atlantic coast, Atlas mountains. Each journey crafted for deep immersion.",
  openGraph: {
    title: "Journeys | Slow Morocco",
    description: "Private Morocco journeys from 3 to 12 days. Sahara desert, imperial cities, Atlantic coast, Atlas mountains.",
  },
};

export default function JourneysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
