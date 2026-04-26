import Link from 'next/link'
import { ReactNode } from 'react'
import { FAQ, Section } from '@/lib/content/types'
import { ScannerCTA } from './ScannerCTA'

export function ContentLayout({
  eyebrow,
  h1,
  directAnswer,
  pill,
  meta,
  sections,
  beforeFAQs,
  faqs,
  related,
  references,
  updatedAt,
}: {
  eyebrow?: string                       // e.g. "Ingredient" / "Product" / "Category"
  h1: string
  directAnswer: string
  pill?: ReactNode                       // VerdictPill or null for categories
  meta?: ReactNode                       // brand line, aliases, etc.
  sections: Section[]
  beforeFAQs?: ReactNode                 // related-grid or product-list block
  faqs: FAQ[]
  related?: ReactNode                    // related links block
  references?: { title: string; url: string }[]
  updatedAt: string
}) {
  return (
    <main className="min-h-screen bg-bg pb-20">
      {/* Top bar — same pattern as homepage */}
      <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="flex items-center justify-between px-6 py-4 safe-pt max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center min-h-[44px] text-xl font-semibold tracking-tight text-ink">
            ClearPD
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/#checker" className="inline-flex items-center min-h-[44px] text-ink-variant hover:text-ink transition">
              Scanner
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 pt-10">
        {/* Eyebrow + breadcrumb-style link back */}
        {eyebrow && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 min-h-[44px] -ml-1 px-1 text-[12px] uppercase tracking-wider text-ink-variant hover:text-ink transition"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_back
            </span>
            {eyebrow}
          </Link>
        )}

        {/* Pill above H1 (if any) */}
        {pill && <div className="mt-4">{pill}</div>}

        {/* H1 */}
        <h1
          className="mt-3 text-ink font-bold tracking-tighter leading-[1.05]"
          style={{ fontSize: 'clamp(30px, 5.5vw, 42px)' }}
        >
          {h1}
        </h1>

        {/* Meta line (brand, aliases) */}
        {meta && <div className="mt-3 text-sm text-ink-variant">{meta}</div>}

        {/* Direct-answer paragraph (the AEO snippet target) */}
        <p className="mt-6 text-[16px] sm:text-[17px] text-ink leading-relaxed font-normal">
          {directAnswer}
        </p>

        {/* Scanner CTA above the fold */}
        <div className="mt-8">
          <ScannerCTA />
        </div>

        {/* H2 sections */}
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-ink font-bold tracking-tight" style={{ fontSize: 24 }}>
                {s.heading}
              </h2>
              <p className="mt-3 text-[15px] text-ink-variant leading-relaxed">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        {/* Optional block before FAQs (related-grid for categories, ingredients list for products) */}
        {beforeFAQs && <div className="mt-12">{beforeFAQs}</div>}

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 24 }}>
            Frequently asked
          </h2>
          <div className="mt-5 divide-y divide-outline-variant/40 rounded-2xl bg-surface-lowest border border-outline-variant/40 overflow-hidden">
            {faqs.map((f, idx) => (
              <details key={idx} className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 hover:bg-surface-low transition">
                  <h3 className="font-medium text-ink text-[15px] leading-snug">{f.q}</h3>
                  <span
                    className="material-symbols-outlined text-ink-variant transition-transform group-open:rotate-180 shrink-0"
                    style={{ fontSize: 22 }}
                  >
                    expand_more
                  </span>
                </summary>
                <p className="px-5 pb-4 text-[14px] text-ink-variant leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        {related && <div className="mt-12">{related}</div>}

        {/* Second scanner CTA at the bottom */}
        <div className="mt-12">
          <ScannerCTA label="Open the checker" />
        </div>

        {/* References (ingredient pages only) */}
        {references && references.length > 0 && (
          <section className="mt-12">
            <h2 className="text-ink font-bold tracking-tight" style={{ fontSize: 20 }}>
              References
            </h2>
            <ul className="mt-3 space-y-2 text-[13px] text-ink-variant">
              {references.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink transition"
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Updated-at */}
        <p className="mt-10 text-[12px] text-ink-variant">
          Last updated {new Date(updatedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.
          ClearPD provides ingredient analysis for educational purposes only — not medical advice.
        </p>

        <footer className="mt-10 pb-6 text-center text-xs text-ink-variant">
          &copy; {new Date().getFullYear()} ClearPD
        </footer>
      </div>
    </main>
  )
}
