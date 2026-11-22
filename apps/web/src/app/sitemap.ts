import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parshuramfitnessclub.com';

  const routes = [
    '',
    '/about',
    '/pricing',
    '/facilities',
    '/trainers',
    '/gallery',
    '/rules',
    '/programs',
    '/exercises',
    '/nutrition',
    '/ai-planner',
    '/videos',
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
