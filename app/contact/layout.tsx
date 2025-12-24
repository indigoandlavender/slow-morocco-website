import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Slow Morocco. Ask questions, start planning your journey, or just say hello. We respond within 24 hours.",
  openGraph: {
    title: "Contact | Slow Morocco",
    description: "Get in touch with Slow Morocco. We respond within 24 hours.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
