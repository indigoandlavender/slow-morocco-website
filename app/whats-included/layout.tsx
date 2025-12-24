import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What's Included",
  description: "Everything included in your Slow Morocco journey: private driver, handpicked accommodations, guided experiences, and 24/7 support throughout your trip.",
  openGraph: {
    title: "What's Included | Slow Morocco",
    description: "Private driver, handpicked accommodations, guided experiences, and 24/7 support.",
  },
};

export default function WhatsIncludedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
