import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Slow Morocco was born from a simple belief: the best journeys happen when someone who knows a place deeply shares it with someone who wants to understand it.",
  openGraph: {
    title: "About | Slow Morocco",
    description: "The best journeys happen when someone who knows a place deeply shares it with someone who wants to understand it.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
