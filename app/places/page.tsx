import { Metadata } from 'next';
import { getPlaces } from '@/lib/sheets';
import PlaceCard from '@/components/PlaceCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slowmorocco.com';

export const metadata: Metadata = {
  title: 'Places',
  description: 'Discover the destinations we know best. From the red walls of Marrakech to the blue streets of Chefchaouen, the ancient medina of Fes to the dunes of the Sahara.',
  keywords: ['Morocco places', 'Morocco destinations', 'Marrakech', 'Fes', 'Chefchaouen', 'Sahara', 'Atlas Mountains', 'Essaouira'],
  openGraph: {
    title: 'Places | Slow Morocco',
    description: 'Discover the destinations we know best. From the red walls of Marrakech to the blue streets of Chefchaouen.',
    url: `${siteUrl}/places`,
    siteName: 'Slow Morocco',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Places | Slow Morocco',
    description: 'Discover the destinations we know best.',
  },
  alternates: {
    canonical: `${siteUrl}/places`,
  },
};

export default async function PlacesPage() {
  const places = await getPlaces();
  
  const sortedPlaces = places.sort((a, b) => {
    const orderA = parseInt(a.order) || 999;
    const orderB = parseInt(b.order) || 999;
    return orderA - orderB;
  });

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Places',
        item: `${siteUrl}/places`,
      },
    ],
  };

  // CollectionPage Schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Places | Slow Morocco',
    description: 'Discover the destinations we know best in Morocco.',
    url: `${siteUrl}/places`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sortedPlaces.length,
      itemListElement: sortedPlaces.slice(0, 20).map((place, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/place/${place.slug}`,
        name: place.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Places
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            The destinations we know best. Not a guidebook — a perspective.
          </p>
        </div>
      </section>

      {/* Places Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {sortedPlaces.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPlaces.map((place) => (
                <PlaceCard key={place.slug} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-foreground/50">Places coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
