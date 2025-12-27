import { Metadata } from 'next';
import { getRegions } from '@/lib/sheets';
import RegionCard from '@/components/RegionCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slowmorocco.com';

export const metadata: Metadata = {
  title: 'Places',
  description: 'Explore Morocco by region. From imperial cities to Atlas mountains, Atlantic coast to Sahara desert.',
  keywords: ['Morocco regions', 'Morocco travel', 'Marrakech', 'Fes', 'Atlas Mountains', 'Sahara Desert', 'Morocco coast'],
  openGraph: {
    title: 'Places | Slow Morocco',
    description: 'Explore Morocco by region. Cities, mountains, coast, and desert.',
    url: `${siteUrl}/places`,
    siteName: 'Slow Morocco',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Places | Slow Morocco',
    description: 'Explore Morocco by region.',
  },
  alternates: {
    canonical: `${siteUrl}/places`,
  },
};

export default async function PlacesPage() {
  const regions = await getRegions();

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

  return (
    <main className="min-h-screen bg-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Places
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Morocco by region. Choose your landscape.
          </p>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {regions.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {regions.map((region) => (
                <RegionCard key={region.slug} region={region} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-foreground/50">Regions coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
