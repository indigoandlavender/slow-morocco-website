import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getRegions, getRegionBySlug, getDestinationsByRegion } from '@/lib/sheets';
import DestinationCard from '@/components/DestinationCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slowmorocco.com';

interface PageProps {
  params: { region: string };
}

export async function generateStaticParams() {
  const regions = await getRegions();
  return regions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const region = await getRegionBySlug(params.region);
  if (!region) return { title: 'Region Not Found' };
  
  const title = `${region.title} | Places | Slow Morocco`;
  const description = region.description || `Explore ${region.title} in Morocco.`;
  const url = `${siteUrl}/places/${region.slug}`;
  
  return {
    title: region.title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Slow Morocco',
      locale: 'en_GB',
      type: 'website',
      images: region.heroImage ? [
        {
          url: region.heroImage,
          width: 1200,
          height: 630,
          alt: region.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: region.heroImage ? [region.heroImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function RegionPage({ params }: PageProps) {
  const region = await getRegionBySlug(params.region);
  
  if (!region) {
    notFound();
  }

  const destinations = await getDestinationsByRegion(params.region);

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
      {
        '@type': 'ListItem',
        position: 3,
        name: region.title,
        item: `${siteUrl}/places/${region.slug}`,
      },
    ],
  };

  // CollectionPage Schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${region.title} | Slow Morocco`,
    description: region.description,
    url: `${siteUrl}/places/${region.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: destinations.length,
      itemListElement: destinations.map((dest, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/destination/${dest.slug}`,
        name: dest.title,
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
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-foreground/50 mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-olive transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/places" className="hover:text-olive transition-colors">Places</Link></li>
              <li>/</li>
              <li className="text-foreground/70">{region.title}</li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              {region.title}
            </h1>
            {region.description && (
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                {region.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {destinations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-foreground/50">Destinations coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Back Link */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-olive transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="10,3 5,8 10,13" />
            </svg>
            All Regions
          </Link>
        </div>
      </section>
    </main>
  );
}
