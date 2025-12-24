import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Your Trip",
  description: "Start planning your private Morocco journey. Tell us your dates, interests, and travel style. We'll craft a journey around what matters to you.",
  openGraph: {
    title: "Plan Your Trip | Slow Morocco",
    description: "Start planning your private Morocco journey. Tell us your dates, interests, and travel style.",
  },
};

export default function PlanYourTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
