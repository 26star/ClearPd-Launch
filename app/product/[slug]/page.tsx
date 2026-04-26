import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS, PRODUCTS_BY_SLUG } from '@/lib/content/products'
import { CATEGORIES_BY_SLUG } from '@/lib/content/categories'
import { ContentLayout } from '@/components/content/ContentLayout'
import { VerdictPill } from '@/components/content/VerdictPill'

type Props = { params: Promise<{ slug: string }> }

const SITE_URL = 'https://www.clearpd.com'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = PRODUCTS_BY_SLUG[slug]
  if (!entry) return { title: 'Not found — ClearPD' }
  const url = `${SITE_URL}/product/${slug}`
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

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const entry = PRODUCTS_BY_SLUG[slug]
  if (!entry) notFound()

  const sameCategory = PRODUCTS.filter(
    (p) => p.category === entry.category && p.slug !== entry.slug,
  )

  // JSON-LD: Product + Review + FAQPage
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/product/${slug}#product`,
    name: entry.name,
    brand: { '@type': 'Brand', name: entry.brand },
    description: entry.directAnswer,
    url: `${SITE_URL}/product/${slug}`,
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue:
          entry.verdict === 'Safe' ? 5 : entry.verdict === 'Caution' ? 3 : 1,
        bestRating: 5,
        worstRating: 1,
      },
      author: { '@type': 'Organization', name: 'ClearPD' },
      name: `${entry.verdict} for perioral dermatitis`,
      reviewBody: entry.directAnswer,
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

  const category = CATEGORIES_BY_SLUG[entry.category]

  return (
    <>
      <ContentLayout
        eyebrow="Product"
        h1={entry.h1}
        directAnswer={entry.directAnswer}
        pill={<VerdictPill verdict={entry.verdict} tone={entry.tone} />}
        meta={
          <span>
            By <span className="text-ink font-medium">{entry.brand}</span>
            {category && (
              <>
                {' · '}
                <Link href={`/check/${entry.category}`} className="underline hover:text-ink transition">
                  {category.title}
                </Link>
              </>
            )}
          </span>
        }
        sections={entry.sections}
        beforeFAQs={
          <section aria-labelledby="key-ingredients-heading">
            <h2 id="key-ingredients-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 24 }}>
              Key ingredients
            </h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {entry.keyIngredients.map((ing) => {
                const tone =
                  ing.verdict === 'Safe'
                    ? 'safe'
                    : ing.verdict === 'Caution'
                      ? 'caution'
                      : 'tertiary'
                const inner = (
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-ink font-semibold tracking-tight" style={{ fontSize: 15 }}>
                      {ing.name}
                    </h3>
                    <VerdictPill verdict={ing.verdict} tone={tone} size="sm" />
                  </div>
                )
                return ing.slug ? (
                  <Link
                    key={ing.name}
                    href={`/ingredient/${ing.slug}`}
                    className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div
                    key={ing.name}
                    className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4"
                  >
                    {inner}
                  </div>
                )
              })}
            </div>
          </section>
        }
        faqs={entry.faqs}
        related={
          sameCategory.length > 0 ? (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 22 }}>
                Other {category?.title.toLowerCase() ?? 'products'}
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sameCategory.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-ink font-bold tracking-tight" style={{ fontSize: 16 }}>
                        {p.name}
                      </h3>
                      <VerdictPill verdict={p.verdict} tone={p.tone} size="sm" />
                    </div>
                    <p className="mt-1 text-[12px] text-ink-variant leading-snug">{p.brand}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null
        }
        updatedAt={entry.updatedAt}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
