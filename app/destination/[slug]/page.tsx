import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getDestinations, getDestinationBySlug, getPlacesByDestination } from '@/lib/sheets';
import PlaceBody from '@/components/PlaceBody';
import PlaceCard from '@/components/PlaceCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slowmorocco.com';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((dest) => ({ slug: dest.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const destination = await getDestinationBySlug(params.slug);
  if (!destination) return { title: 'Destination Not Found' };
  
  const title = `${destination.title} | Slow Morocco`;
  const description = destination.excerpt || destination.subtitle || `Discover ${destination.title} with Slow Morocco.`;
  const url = `${siteUrl}/destination/${destination.slug}`;
  
  return {
    title: destination.title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Slow Morocco',
      locale: 'en_GB',
      type: 'article',
      images: destination.heroImage ? [
        {
          url: destination.heroImage,
          width: 1200,
          height: 630,
          alt: destination.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: destination.heroImage ? [destination.heroImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const destination = await getDestinationBySlug(params.slug);
  
  if (!destination) {
    notFound();
  }

  const places = await getPlacesByDestination(params.slug);

  // Parse regions for breadcrumb (use first region)
  const regions = destination.region.split(',').map(r => r.trim().toLowerCase());
  const primaryRegion = regions[0];
  const regionTitle = primaryRegion.charAt(0).toUpperCase() + primaryRegion.slice(1);

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
        name: regionTitle,
        item: `${siteUrl}/places/${primaryRegion}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: destination.title,
        item: `${siteUrl}/destination/${destination.slug}`,
      },
    ],
  };

  // Place Schema
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: destination.title,
    description: destination.excerpt || destination.subtitle,
    image: destination.heroImage || undefined,
    url: `${siteUrl}/destination/${destination.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
      addressRegion: destination.title,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />

      {/* Hero Header */}
      {destination.heroImage ? (
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <Image
            src={destination.heroImage}
            alt={destination.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-[0.3em] font-light text-white uppercase">
              {destination.title.split('').join(' ')}
            </h1>
            {destination.subtitle && (
              <p className="text-white/80 mt-6 text-lg">
                {destination.subtitle}
              </p>
            )}
          </div>
          {destination.heroCaption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="text-white/70 text-sm max-w-4xl mx-auto">
                {destination.heroCaption}
              </p>
            </div>
          )}
        </section>
      ) : (
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-muted">
          <div className="container mx-auto px-6 lg:px-16 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-[0.3em] font-light uppercase">
              {destination.title.split('').join(' ')}
            </h1>
            {destination.subtitle && (
              <p className="text-foreground/60 mt-6 text-lg">
                {destination.subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Breadcrumb */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-6 lg:px-16">
          <nav className="text-sm text-foreground/50" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:text-olive transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/places" className="hover:text-olive transition-colors">Places</Link></li>
              <li>/</li>
              <li><Link href={`/places/${primaryRegion}`} className="hover:text-olive transition-colors">{regionTitle}</Link></li>
              <li>/</li>
              <li className="text-foreground/70">{destination.title}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Body Content */}
      {destination.body && (
        <article className="max-w-3xl mx-auto px-6 py-16">
          <PlaceBody content={destination.body} />
        </article>
      )}

      {/* Places in this Destination */}
      {places.length > 0 && (
        <section className="px-6 pt-16 pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-12 text-center">
              Places in {destination.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {places.map((place) => (
                <PlaceCard key={place.slug} place={place} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/places/${primaryRegion}`}
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-olive transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="10,3 5,8 10,13" />
            </svg>
            All {regionTitle}
          </Link>
        </div>
      </section>
    </main>
  );
}
