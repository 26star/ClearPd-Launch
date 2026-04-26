import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { INGREDIENTS, INGREDIENTS_BY_SLUG } from '@/lib/content/ingredients'
import { PRODUCTS_BY_SLUG } from '@/lib/content/products'
import { ContentLayout } from '@/components/content/ContentLayout'
import { VerdictPill } from '@/components/content/VerdictPill'

type Props = { params: Promise<{ slug: string }> }

const SITE_URL = 'https://clearpd.com'

export function generateStaticParams() {
  return INGREDIENTS.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = INGREDIENTS_BY_SLUG[slug]
  if (!entry) return { title: 'Not found — ClearPD' }
  const url = `${SITE_URL}/ingredient/${slug}`
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

export default async function IngredientPage({ params }: Props) {
  const { slug } = await params
  const entry = INGREDIENTS_BY_SLUG[slug]
  if (!entry) notFound()

  const productsContaining = entry.productSlugs
    .map((s) => PRODUCTS_BY_SLUG[s])
    .filter(Boolean)

  // JSON-LD: MedicalSubstance + FAQPage
  const ingredientSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalSubstance',
    '@id': `${SITE_URL}/ingredient/${slug}#substance`,
    name: entry.name,
    alternateName: entry.aliases,
    url: `${SITE_URL}/ingredient/${slug}`,
    description: entry.directAnswer,
    relevantSpecialty: 'Dermatology',
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
        eyebrow="Ingredient"
        h1={entry.h1}
        directAnswer={entry.directAnswer}
        pill={<VerdictPill verdict={entry.verdict} tone={entry.tone} />}
        meta={
          entry.aliases.length > 0 ? (
            <span>
              Also known as: <span className="text-ink">{entry.aliases.join(', ')}</span>
            </span>
          ) : null
        }
        sections={entry.sections}
        beforeFAQs={
          productsContaining.length > 0 ? (
            <section aria-labelledby="ing-products-heading">
              <h2 id="ing-products-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 24 }}>
                Products containing this ingredient
              </h2>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {productsContaining.map((p) => (
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
          entry.related.length > 0 ? (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 22 }}>
                Related ingredients
              </h2>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {entry.related.map((s) => {
                  const r = INGREDIENTS_BY_SLUG[s]
                  if (!r) return null
                  return (
                    <Link
                      key={s}
                      href={`/ingredient/${s}`}
                      className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-ink font-semibold tracking-tight" style={{ fontSize: 15 }}>
                          {r.name}
                        </h3>
                        <VerdictPill verdict={r.verdict} tone={r.tone} size="sm" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ) : null
        }
        references={entry.references}
        updatedAt={entry.updatedAt}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ingredientSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
