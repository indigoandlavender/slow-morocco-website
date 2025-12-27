import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://slowmorocco.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/client/', '/proposal/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
