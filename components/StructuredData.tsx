export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Slow Mauritius",
    description: "Thoughtful private journeys across Mauritius — designed for travellers who prefer ease and deep immersion.",
    url: "https://slowmauritius.com",
    email: "hello@slowmauritius.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Port Louis",
      addressCountry: "MU",
    },
    areaServed: {
      "@type": "Country",
      name: "Mauritius",
    },
    image: "https://slowmauritius.com/og-image.jpg",
    priceRange: "€€€",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Mauritius Private Journeys",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Black River Gorges Explorer",
            description: "Discover the volcanic heart of Mauritius",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Coastal Paradise",
            description: "Turquoise lagoons and pristine beaches",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Complete Mauritius",
            description: "The full island experience",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
