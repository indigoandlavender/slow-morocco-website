import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visa Information",
  description: "Morocco visa requirements for US, UK, EU, and other nationalities. Most visitors can enter visa-free for 90 days. Check what you need.",
  openGraph: {
    title: "Visa Information | Slow Morocco",
    description: "Morocco visa requirements. Most visitors can enter visa-free for 90 days.",
  },
};

export default function VisaInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
