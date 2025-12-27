import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPlaces, getPlaceBySlug, getPlaceImages } from '@/lib/sheets';
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
  const description = place.excerpt || place.subtitle || `Discover ${place.title} with Slow Morocco.`;
  const url = `${siteUrl}/place/${place.slug}`;
  
  return {
    title: place.title,
    description,
    keywords: place.tags ? place.tags.split(',').map(t => t.trim()) : undefined,
    authors: place.textBy ? [{ name: place.textBy }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Slow Morocco',
      locale: 'en_GB',
      type: 'article',
      authors: place.textBy ? [place.textBy] : undefined,
      section: place.category || 'Places',
      publishedTime: place.year ? `${place.year}-01-01` : undefined,
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

  // Parse sources (separated by ;;)
  const sources = place.sources
    ? place.sources.split(';;').map((s) => s.trim()).filter(Boolean)
    : [];

  // Calculate word count for schema
  const wordCount = place.body ? place.body.split(/\s+/).length : 0;
  
  // Parse read time for schema (e.g., "14 min read" -> "PT14M")
  const readTimeMatch = place.readTime?.match(/(\d+)/);
  const readTimeISO = readTimeMatch ? `PT${readTimeMatch[1]}M` : undefined;

  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: place.title,
    description: place.excerpt || place.subtitle,
    image: place.heroImage || undefined,
    author: place.textBy ? {
      '@type': 'Person',
      name: place.textBy,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Slow Morocco',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.svg`,
      },
    },
    datePublished: place.year ? `${place.year}-01-01` : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/place/${place.slug}`,
    },
    articleSection: place.category || 'Places',
    wordCount: wordCount > 0 ? wordCount : undefined,
    timeRequired: readTimeISO,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-olive transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/places" className="hover:text-olive transition-colors">Places</Link></li>
            <li>/</li>
            <li className="text-foreground/70">{place.title}</li>
          </ol>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-foreground/50 mb-6">
          {place.category && (
            <>
              <span className="uppercase tracking-wide">{place.category}</span>
              <span>·</span>
            </>
          )}
          {place.readTime && <span>{place.readTime}</span>}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
          {place.title}
        </h1>

        {/* Subtitle */}
        {place.subtitle && (
          <p className="text-xl text-foreground/70 italic mb-8">
            {place.subtitle}
          </p>
        )}

        {/* Practical Info */}
        {(place.address || place.opening_hours || place.fees || place.notes) && (
          <div className="text-sm text-foreground/70 space-y-2 mb-8">
            {place.address && (
              <p><span className="text-foreground/50">Location:</span> {place.address}</p>
            )}
            {place.opening_hours && (
              <p><span className="text-foreground/50">Hours:</span> {place.opening_hours}</p>
            )}
            {place.fees && (
              <p><span className="text-foreground/50">Entry:</span> {place.fees}</p>
            )}
            {place.notes && (
              <p><span className="text-foreground/50">Note:</span> {place.notes}</p>
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

        {/* Footer */}
        <hr className="border-foreground/10 my-12" />
        <footer className="text-sm text-foreground/50 flex flex-wrap gap-x-4 gap-y-1">
          {place.textBy && <span>Text — {place.textBy}</span>}
          {place.imagesBy && <span>Images — {place.imagesBy}</span>}
          {place.year && <span>{place.year}</span>}
        </footer>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-olive transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="10,3 5,8 10,13" />
            </svg>
            All Places
          </Link>
        </div>
      </article>
    </main>
  );
}
