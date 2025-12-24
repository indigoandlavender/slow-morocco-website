import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Day Tours from Marrakech | Slow Morocco",
  description:
    "Private day trips from Marrakech. Essaouira, Atlas Mountains, Ouzoud Falls, and more. English-speaking driver, flexible itinerary, book online.",
  openGraph: {
    title: "Day Tours from Marrakech | Slow Morocco",
    description:
      "Private day trips from Marrakech. Essaouira, Atlas Mountains, Ouzoud Falls, and more.",
    type: "website",
  },
};

export default function DayTripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
