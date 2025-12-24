import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Guides",
  description: "Meet the guides who make Slow Morocco journeys unforgettable. Local experts who share Morocco's stories, not just its sights.",
  openGraph: {
    title: "Our Guides | Slow Morocco",
    description: "Local experts who share Morocco's stories, not just its sights.",
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
