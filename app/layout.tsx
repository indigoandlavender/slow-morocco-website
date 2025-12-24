import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL("https://slowmauritius.com"),
  title: {
    default: "Slow Mauritius | Private Journeys Through Mauritius",
    template: "%s | Slow Mauritius",
  },
  description: "Thoughtful private journeys across Mauritius — designed for travellers who prefer ease and deep immersion. From volcanic peaks to turquoise lagoons, crafted around what matters to you.",
  keywords: ["mauritius private tours", "luxury mauritius travel", "mauritius journeys", "port louis tours", "black river gorges", "mauritius itinerary", "private guide mauritius", "mauritius travel agency"],
  authors: [{ name: "Slow Mauritius" }],
  creator: "Slow Mauritius",
  publisher: "Slow Mauritius",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://slowmauritius.com",
    siteName: "Slow Mauritius",
    title: "Slow Mauritius | Private Journeys Through Mauritius",
    description: "Thoughtful private journeys across Mauritius — designed for travellers who prefer ease and deep immersion.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Slow Mauritius - Private journeys through Mauritius",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slow Mauritius | Private Journeys Through Mauritius",
    description: "Thoughtful private journeys across Mauritius — designed for travellers who prefer ease and deep immersion.",
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
    canonical: "https://slowmauritius.com",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
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
          src="https://www.googletagmanager.com/gtag/js?id=G-ET63GLFM4N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ET63GLFM4N');
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
