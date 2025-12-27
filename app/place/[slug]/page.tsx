import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPlaces, getPlaceBySlug, getPlaceImages, getDestinationBySlug } from '@/lib/sheets';
import PlaceBody from '@/components/PlaceBody';
import Gallery from '@/components/Gallery';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slowmorocco.com';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const places = await getPlaces();
  return places.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const place = await getPlaceBySlug(params.slug);
  if (!place) return { title: 'Place Not Found' };
  
  const title = `${place.title} | Slow Morocco`;
  const description = place.excerpt || `Visit ${place.title} in Morocco. ${place.opening_hours ? `Open ${place.opening_hours}.` : ''} ${place.fees ? `Entry: ${place.fees}.` : ''}`;
  const url = `${siteUrl}/place/${place.slug}`;
  
  return {
    title: place.title,
    description,
    keywords: place.tags ? place.tags.split(',').map(t => t.trim()) : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Slow Morocco',
      locale: 'en_GB',
      type: 'article',
      section: place.category || 'Places',
      images: place.heroImage ? [
        {
          url: place.heroImage,
          width: 1200,
          height: 630,
          alt: place.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: place.heroImage ? [place.heroImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function PlacePage({ params }: PageProps) {
  const place = await getPlaceBySlug(params.slug);
  
  if (!place) {
    notFound();
  }

  const galleryImages = await getPlaceImages(params.slug);
  
  // Get parent destination for breadcrumb
  const destination = await getDestinationBySlug(place.destination);
  const destinationTitle = destination?.title || place.destination;
  
  // Get region from destination
  const regions = destination?.region?.split(',').map(r => r.trim().toLowerCase()) || [];
  const primaryRegion = regions[0] || 'cities';
  const regionTitle = primaryRegion.charAt(0).toUpperCase() + primaryRegion.slice(1);

  // Parse sources (separated by ;;)
  const sources = place.sources
    ? place.sources.split(';;').map((s) => s.trim()).filter(Boolean)
    : [];

  // TouristAttraction Schema
  const attractionSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.title,
    description: place.excerpt,
    image: place.heroImage || undefined,
    url: `${siteUrl}/place/${place.slug}`,
    address: place.address ? {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressCountry: 'MA',
    } : undefined,
    openingHours: place.opening_hours || undefined,
    isAccessibleForFree: place.fees?.toLowerCase() === 'free' ? true : undefined,
  };

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
        name: destinationTitle,
        item: `${siteUrl}/destination/${place.destination}`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: place.title,
        item: `${siteUrl}/place/${place.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Image */}
      {place.heroImage && (
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <Image
            src={place.heroImage}
            alt={place.title}
            fill
            className="object-cover"
            priority
          />
          {place.heroCaption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="text-white/80 text-sm max-w-4xl mx-auto">
                {place.heroCaption}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Article Header */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-foreground/50 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-olive transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/places" className="hover:text-olive transition-colors">Places</Link></li>
            <li>/</li>
            <li><Link href={`/places/${primaryRegion}`} className="hover:text-olive transition-colors">{regionTitle}</Link></li>
            <li>/</li>
            <li><Link href={`/destination/${place.destination}`} className="hover:text-olive transition-colors">{destinationTitle}</Link></li>
            <li>/</li>
            <li className="text-foreground/70">{place.title}</li>
          </ol>
        </nav>

        {/* Category */}
        {place.category && (
          <span className="text-xs uppercase tracking-wide text-foreground/50 mb-4 block">
            {place.category}
          </span>
        )}

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
          {place.title}
        </h1>

        {/* Excerpt */}
        {place.excerpt && (
          <p className="text-xl text-foreground/70 italic mb-8">
            {place.excerpt}
          </p>
        )}

        {/* Practical Info */}
        {(place.address || place.opening_hours || place.fees || place.notes) && (
          <div className="bg-sand/50 p-6 mb-8 space-y-2 text-sm">
            {place.address && (
              <p><span className="font-medium">Location:</span> {place.address}</p>
            )}
            {place.opening_hours && (
              <p><span className="font-medium">Hours:</span> {place.opening_hours}</p>
            )}
            {place.fees && (
              <p><span className="font-medium">Entry:</span> {place.fees}</p>
            )}
            {place.notes && (
              <p><span className="font-medium">Note:</span> {place.notes}</p>
            )}
          </div>
        )}

        <hr className="border-foreground/10 mb-12" />

        {/* Body */}
        <PlaceBody content={place.body} />

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <>
            <hr className="border-foreground/10 my-12" />
            <Gallery images={galleryImages} />
          </>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <>
            <hr className="border-foreground/10 my-12" />
            <div className="text-sm text-foreground/60">
              <h3 className="uppercase tracking-wide text-xs font-medium mb-4">Sources</h3>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href={`/destination/${place.destination}`}
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-olive transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="10,3 5,8 10,13" />
            </svg>
            Back to {destinationTitle}
          </Link>
        </div>
      </article>
    </main>
  );
}
