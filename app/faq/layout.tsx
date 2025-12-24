import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about traveling with Slow Morocco. Booking, payments, what to expect, and everything you need to know before your journey.",
  openGraph: {
    title: "FAQ | Slow Morocco",
    description: "Everything you need to know before your Morocco journey.",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
