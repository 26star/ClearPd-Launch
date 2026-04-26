import type { MetadataRoute } from 'next'
import { CATEGORIES } from '@/lib/content/categories'
import { INGREDIENTS } from '@/lib/content/ingredients'
import { PRODUCTS } from '@/lib/content/products'

const SITE_URL = 'https://clearpd.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/check/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...INGREDIENTS.map((i) => ({
      url: `${SITE_URL}/ingredient/${i.slug}`,
      lastModified: new Date(i.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
