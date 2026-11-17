import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parshuramgym.placeholder';

  const routes = [
    '',
    '/about',
    '/trainers',
    '/programs',
    '/exercises',
    '/nutrition',
    '/ai-planner',
    '/videos',
    '/transformations',
    '/pricing',
    '/contact',
    '/auth/login',
    '/auth/register'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8
  }));
}
