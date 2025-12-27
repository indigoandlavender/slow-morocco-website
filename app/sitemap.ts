import { MetadataRoute } from 'next';
import { getSheetData, getRegions, getDestinations, getPlaces } from '@/lib/sheets';

const siteUrl = 'https://slowmorocco.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/journeys`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/day-trips`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/places`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/plan-your-trip`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/whats-included`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/visa-info`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/health-safety`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/travel-insurance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/cancellation-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/intellectual-property`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic: Journeys
  let journeyPages: MetadataRoute.Sitemap = [];
  try {
    const journeys = await getSheetData('Website_Journeys');
    journeyPages = journeys
      .filter((j: any) => {
        const pub = String(j.published || j.Published || '').toLowerCase();
        return pub === 'true' || pub === 'yes' || pub === '1';
      })
      .map((journey: any) => ({
        url: `${siteUrl}/journeys/${journey.slug || journey.Slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch journeys', e);
  }

  // Dynamic: Day Trips
  let dayTripPages: MetadataRoute.Sitemap = [];
  try {
    const dayTrips = await getSheetData('Website_DayTrips');
    dayTripPages = dayTrips
      .filter((d: any) => {
        const pub = String(d.published || d.Published || '').toLowerCase();
        return pub === 'true' || pub === 'yes' || pub === '1';
      })
      .map((trip: any) => ({
        url: `${siteUrl}/day-trips/${trip.slug || trip.Slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch day trips', e);
  }

  // Dynamic: Regions
  let regionPages: MetadataRoute.Sitemap = [];
  try {
    const regions = await getRegions();
    regionPages = regions.map((region: any) => ({
      url: `${siteUrl}/places/${region.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch regions', e);
  }

  // Dynamic: Destinations
  let destinationPages: MetadataRoute.Sitemap = [];
  try {
    const destinations = await getDestinations();
    destinationPages = destinations.map((dest: any) => ({
      url: `${siteUrl}/destination/${dest.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch destinations', e);
  }

  // Dynamic: Places
  let placePages: MetadataRoute.Sitemap = [];
  try {
    const places = await getPlaces();
    placePages = places
      .filter((p: any) => {
        const pub = String(p.published || '').toLowerCase();
        return pub === 'true' || pub === 'yes' || pub === '1';
      })
      .map((place: any) => ({
        url: `${siteUrl}/place/${place.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch places', e);
  }

  return [
    ...staticPages,
    ...journeyPages,
    ...dayTripPages,
    ...regionPages,
    ...destinationPages,
    ...placePages,
  ];
}
