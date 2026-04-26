import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CATEGORIES, CATEGORIES_BY_SLUG } from '@/lib/content/categories'
import { PRODUCTS_BY_SLUG } from '@/lib/content/products'
import { INGREDIENTS_BY_SLUG } from '@/lib/content/ingredients'
import { ContentLayout } from '@/components/content/ContentLayout'
import { VerdictPill } from '@/components/content/VerdictPill'

type Props = { params: Promise<{ slug: string }> }

const SITE_URL = 'https://clearpd.com'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = CATEGORIES_BY_SLUG[slug]
  if (!entry) return { title: 'Not found — ClearPD' }
  const url = `${SITE_URL}/check/${slug}`
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: entry.metaTitle,
      description: entry.metaDescription,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.metaTitle,
      description: entry.metaDescription,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const entry = CATEGORIES_BY_SLUG[slug]
  if (!entry) notFound()

  const products = entry.productSlugs
    .map((s) => PRODUCTS_BY_SLUG[s])
    .filter(Boolean)

  const ingredients = entry.ingredientSlugs
    .map((s) => INGREDIENTS_BY_SLUG[s])
    .filter(Boolean)

  // JSON-LD: CollectionPage + ItemList
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/check/${slug}#collection`,
    url: `${SITE_URL}/check/${slug}`,
    name: entry.h1,
    description: entry.metaDescription,
    dateModified: entry.updatedAt,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/product/${p.slug}`,
        name: p.name,
      })),
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <ContentLayout
        eyebrow="Category"
        h1={entry.h1}
        directAnswer={entry.directAnswer}
        sections={entry.sections}
        beforeFAQs={
          products.length > 0 ? (
            <section aria-labelledby="cat-products-heading">
              <h2 id="cat-products-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 24 }}>
                Vetted picks in this category
              </h2>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-ink font-bold tracking-tight" style={{ fontSize: 17 }}>
                        {p.name}
                      </h3>
                      <VerdictPill verdict={p.verdict} tone={p.tone} size="sm" />
                    </div>
                    <p className="mt-2 text-[13px] text-ink-variant leading-snug">{p.brand}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null
        }
        faqs={entry.faqs}
        related={
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 22 }}>
              Related
            </h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {entry.related.map((s) => {
                const r = CATEGORIES_BY_SLUG[s]
                if (!r) return null
                return (
                  <Link
                    key={s}
                    href={`/check/${s}`}
                    className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
                  >
                    <h3 className="text-ink font-semibold tracking-tight" style={{ fontSize: 15 }}>
                      {r.title}
                    </h3>
                    <p className="mt-1 text-[12px] text-ink-variant leading-snug">{r.blurb}</p>
                  </Link>
                )
              })}
              {ingredients.map((i) => (
                <Link
                  key={i.slug}
                  href={`/ingredient/${i.slug}`}
                  className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-ink font-semibold tracking-tight" style={{ fontSize: 15 }}>
                      {i.name}
                    </h3>
                    <VerdictPill verdict={i.verdict} tone={i.tone} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        }
        updatedAt={entry.updatedAt}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
