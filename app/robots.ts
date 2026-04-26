import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.clearpd.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api/* are server endpoints with no useful content.
        // /result/* are per-scan pages already noindexed individually,
        //   but blocking the prefix here prevents wasted crawl budget.
        disallow: ['/api/', '/result/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
