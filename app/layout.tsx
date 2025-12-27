import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL("https://slowmorocco.com"),
  title: {
    default: "Slow Morocco | Private Journeys Through Morocco",
    template: "%s | Slow Morocco",
  },
  description: "Thoughtful private journeys across Morocco — designed for travellers who prefer depth over speed. From the Atlas Mountains to the Sahara, crafted around what matters to you.",
  keywords: ["morocco private tours", "luxury morocco travel", "morocco journeys", "marrakech tours", "sahara desert tours", "atlas mountains", "morocco itinerary", "private guide morocco", "morocco travel agency"],
  authors: [{ name: "Slow Morocco" }],
  creator: "Slow Morocco",
  publisher: "Slow Morocco",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://slowmorocco.com",
    siteName: "Slow Morocco",
    title: "Slow Morocco | Private Journeys Through Morocco",
    description: "Thoughtful private journeys across Morocco — designed for travellers who prefer depth over speed.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Slow Morocco - Private journeys through Morocco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slow Morocco | Private Journeys Through Morocco",
    description: "Thoughtful private journeys across Morocco — designed for travellers who prefer depth over speed.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://slowmorocco.com",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CSBQECNF60"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CSBQECNF60');
          `}
        </Script>
      </head>
      <body>
        <StructuredData />
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
