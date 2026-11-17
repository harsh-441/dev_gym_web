import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parshuramgym.placeholder';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/']
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
