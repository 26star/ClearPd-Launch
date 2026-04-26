import Link from 'next/link'
import { HeroScanner } from '@/components/home/HeroScanner'
import { VerdictPill } from '@/components/content/VerdictPill'

// ─── Content data ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { slug: 'moisturizers', title: 'Moisturizers',  blurb: 'Barrier-safe creams without the usual triggers.' },
  { slug: 'cleansers',    title: 'Cleansers',     blurb: 'Gentle washes that won\u2019t strip the skin.' },
  { slug: 'sunscreens',   title: 'Sunscreens',    blurb: 'Mineral and chemical SPFs, vetted ingredient-by-ingredient.' },
  { slug: 'toothpaste',   title: 'Toothpaste',    blurb: 'Fluoride-free and SLS-free options that don\u2019t flare PD.' },
  { slug: 'lip-balm',     title: 'Lip Balm',      blurb: 'No occlusives or flavorings linked to perioral flares.' },
] as const

const FEATURED_INGREDIENTS = [
  { slug: 'sodium-lauryl-sulfate', name: 'Sodium Lauryl Sulfate', verdict: 'Avoid', tone: 'tertiary',
    answer: 'A foaming surfactant that disrupts the skin barrier. Strongly linked to perioral flares, especially in toothpaste.' },
  { slug: 'fluoride', name: 'Fluoride', verdict: 'Caution', tone: 'caution',
    answer: 'Some sufferers report flares from stannous and sodium fluoride. Try a fluoride-free paste for two weeks to test.' },
  { slug: 'cinnamic-aldehyde', name: 'Cinnamic Aldehyde', verdict: 'Avoid', tone: 'tertiary',
    answer: 'A flavoring used in cinnamon toothpaste and gum. A common, well-documented perioral-dermatitis trigger.' },
  { slug: 'fragrance', name: 'Fragrance / Parfum', verdict: 'Avoid', tone: 'tertiary',
    answer: '\u201CFragrance\u201D can mask 100+ chemicals. Eliminate from skincare and laundry while healing.' },
  { slug: 'coconut-oil', name: 'Coconut Oil', verdict: 'Caution', tone: 'caution',
    answer: 'Highly comedogenic and reported to worsen PD in many cases. Avoid until barrier is restored.' },
  { slug: 'petrolatum', name: 'Petrolatum', verdict: 'Safe', tone: 'safe',
    answer: 'Inert, occlusive, and non-comedogenic. One of the safest barrier ingredients during a PD flare.' },
] as const

const FEATURED_PRODUCTS = [
  { slug: 'vanicream-moisturizing-cream', name: 'Vanicream Moisturizing Cream', verdict: 'Safe',    tone: 'safe',
    line: 'Free of fragrance, dyes, lanolin, parabens, and formaldehyde \u2014 a community staple.' },
  { slug: 'cerave-moisturizing-cream',    name: 'CeraVe Moisturizing Cream',     verdict: 'Caution', tone: 'caution',
    line: 'Ceramides help, but contains fragrance and dimethicone \u2014 mixed reports during active flares.' },
  { slug: 'cetaphil-gentle-cleanser',     name: 'Cetaphil Gentle Skin Cleanser', verdict: 'Caution', tone: 'caution',
    line: 'Low-foam, but contains parabens and stearyl alcohol \u2014 patch-test before daily use.' },
  { slug: 'la-roche-posay-toleriane',     name: 'La Roche-Posay Toleriane',      verdict: 'Safe',    tone: 'safe',
    line: 'Minimalist formula designed for reactive skin \u2014 widely tolerated by PD sufferers.' },
  { slug: 'eucerin-aquaphor',             name: 'Aquaphor Healing Ointment',     verdict: 'Safe',    tone: 'safe',
    line: 'Petrolatum-based occlusive \u2014 ideal as a barrier sealant overnight.' },
  { slug: 'colgate-total',                name: 'Colgate Total',                 verdict: 'Avoid',   tone: 'tertiary',
    line: 'Contains SLS and triclosan analogues \u2014 strong association with perioral flares.' },
] as const

const FAQS: { q: string; a: string }[] = [
  { q: 'What is perioral dermatitis?',
    a: 'Perioral dermatitis (PD) is a chronic inflammatory rash of small red papules and pustules around the mouth, nose, or eyes. It typically affects women aged 16\u201345, often triggered by topical steroids, fluoride toothpaste, heavy occlusives, or fragranced skincare. It is not contagious and usually resolves with trigger elimination.' },
  { q: 'How long does perioral dermatitis last?',
    a: 'With strict zero-therapy (stopping all skincare except plain water and a bland moisturizer), PD usually clears in 4\u201312 weeks. With oral antibiotics (doxycycline or minocycline), most cases resolve in 6\u20138 weeks. Without intervention, PD can persist for months or years and recur.' },
  { q: 'Is perioral dermatitis caused by toothpaste?',
    a: 'For many people, yes. Sodium lauryl sulfate (SLS), cinnamic aldehyde flavoring, and fluoride in toothpaste are documented PD triggers. Switching to a SLS-free, fragrance-free toothpaste for two weeks is the cheapest, fastest diagnostic test you can run on yourself.' },
  { q: 'Can I use moisturizer with perioral dermatitis?',
    a: 'Yes \u2014 but only minimalist, fragrance-free, occlusive-free formulas. Vanicream and La Roche-Posay Toleriane are widely tolerated. Avoid coconut oil, shea butter, and anything with \u201Cnatural\u201D essential oils during an active flare.' },
  { q: 'Does sunscreen cause perioral dermatitis?',
    a: 'Some sunscreens do. Chemical filters like avobenzone and octocrylene, plus fragrance and certain emollients, are common triggers. Mineral (zinc oxide) sunscreens with short ingredient lists are usually safer. Always patch-test on the inner forearm for 3 days first.' },
  { q: 'Should I stop using all skincare?',
    a: 'Most dermatologists recommend \u201Czero therapy\u201D \u2014 stopping all topical products including makeup, moisturizers, and cleansers \u2014 for at least 2 weeks. Wash with lukewarm water only. This isolates the trigger and lets the skin barrier reset before reintroducing anything.' },
  { q: 'Can stress cause perioral dermatitis?',
    a: 'Stress alone doesn\u2019t cause PD, but it can worsen flares by raising cortisol and disrupting the skin barrier. The primary causes are topical irritants and steroids. Manage stress as supportive care, not as a cure.' },
  { q: 'Is perioral dermatitis the same as rosacea?',
    a: 'No. They look similar but differ. PD presents as small papules and pustules around the mouth, often with a clear margin around the lip line. Rosacea typically affects the cheeks and nose with persistent redness and visible blood vessels. Treatments overlap but aren\u2019t identical.' },
  { q: 'Can I wear makeup with perioral dermatitis?',
    a: 'Avoid makeup during active flares \u2014 especially foundation, concealer, and lip products. If you must, choose mineral powders without bismuth oxychloride, talc, or fragrance. Reintroduce one product at a time after the rash clears.' },
  { q: 'What\u2019s the best treatment for perioral dermatitis?',
    a: 'First-line: stop all topical steroids and trigger products. Second-line: topical metronidazole, azelaic acid, or pimecrolimus. Third-line: oral tetracyclines (doxycycline 100mg/day for 6\u20138 weeks). Always work with a dermatologist for prescription care.' },
  { q: 'Can topical steroids cause perioral dermatitis?',
    a: 'Yes \u2014 topical corticosteroids are the most common cause of PD. Even mild OTC hydrocortisone, used on the face for eczema or rashes, can trigger it. Stopping steroids often causes a rebound flare before improvement.' },
  { q: 'Is fluoride bad for perioral dermatitis?',
    a: 'For a subset of patients, yes. Sodium fluoride and stannous fluoride are documented triggers. Switching to a fluoride-free toothpaste for two weeks is a low-cost test. If your rash clears, you have your answer.' },
  { q: 'Can children get perioral dermatitis?',
    a: 'Yes. Pediatric perioral dermatitis is well-documented and often linked to inhaled steroids (asthma inhalers), topical steroids on eczema, or fluoride toothpaste. Treatment mirrors adult care but uses pediatric-safe antibiotics like erythromycin.' },
  { q: 'Does diet affect perioral dermatitis?',
    a: 'Evidence is limited. Some patients report improvement after cutting cinnamon, dairy, or sugar, but this is anecdotal. Diet is unlikely to be the primary trigger \u2014 focus on topical products first, then experiment with diet if needed.' },
  { q: 'How does ClearPD decide if a product is safe?',
    a: 'ClearPD parses the ingredient list, matches each ingredient against our trigger database, and returns a tiered verdict (Safe / Caution / Avoid). The database is built from peer-reviewed literature plus thousands of self-reported community observations. Every flagged ingredient links to its evidence.' },
  { q: 'Is ClearPD a substitute for a dermatologist?',
    a: 'No. ClearPD helps you eliminate ingredient triggers \u2014 a key part of recovery \u2014 but is not medical advice. If your rash is severe, spreading, or persistent for more than 4 weeks, see a board-certified dermatologist.' },
]

// ─── JSON-LD structured data ────────────────────────────────────────────────

const SITE_URL = 'https://clearpd.com'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}#organization`,
  name: 'ClearPD',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'ClearPD helps people with perioral dermatitis identify trigger ingredients in skincare, toothpaste, and cosmetics through community-evidenced ingredient analysis.',
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  url: SITE_URL,
  name: 'ClearPD',
  publisher: { '@id': `${SITE_URL}#organization` },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg pb-20">
      {/* TOP BAR ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="flex items-center justify-between px-6 py-4 safe-pt max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center min-h-[44px] text-xl font-semibold tracking-tight text-ink">
            ClearPD
          </Link>
        </div>
      </header>

      {/* 1 + 2 + 3. HERO + DIRECT ANSWER + CHECKER ─────────────────────── */}
      <section
        id="checker"
        className="hero-wash scroll-mt-20"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-3xl mx-auto px-5 pt-16 sm:pt-24 pb-16 sm:pb-24 text-center">
          <h1
            id="hero-heading"
            className="text-ink font-semibold tracking-tighter leading-[1.04]"
            style={{ fontSize: 'clamp(40px, 7vw, 56px)' }}
          >
            Is your product safe for perioral dermatitis?
          </h1>

          <p className="mt-5 text-[15px] sm:text-base text-ink-variant leading-relaxed max-w-xl mx-auto">
            Paste any ingredient list &mdash; skincare, toothpaste, makeup.
            Instantly flag the 40+ ingredients known to trigger PD flares.
            Free, no signup.
          </p>

          {/* Pill-shaped scanner — section 3 */}
          <div className="mt-10 sm:mt-12 max-w-2xl mx-auto text-left">
            <HeroScanner />
          </div>

          {/* AEO 60-word direct-answer paragraph (kept for SEO/AEO) */}
          <p className="mt-10 text-[14px] text-ink-variant leading-relaxed max-w-2xl mx-auto">
            <strong className="font-semibold text-ink">Is your skincare safe for perioral dermatitis?</strong>{' '}
            Often, no. PD is triggered by common ingredients&mdash;fluoride, SLS,
            fragrance, cinnamates, heavy occlusives, and topical steroids. The
            checker above scans any product&rsquo;s ingredient list and
            returns a tiered verdict&mdash;Safe, Caution, or Avoid&mdash;based on
            community evidence from thousands of PD sufferers. Paste a label,
            upload a photo, or scan a barcode to get an answer in seconds.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto">

        {/* 4 + 5. EXPANDABLE Q&A ───────────────────────────────────────── */}
        <section className="px-5 mt-10 space-y-3" aria-label="About perioral dermatitis">
          <details className="group rounded-2xl bg-surface-lowest border border-outline-variant/40 px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h2 className="text-ink font-bold tracking-tight" style={{ fontSize: 22 }}>
                What is perioral dermatitis?
              </h2>
              <span className="material-symbols-outlined text-ink-variant transition-transform group-open:rotate-180" style={{ fontSize: 24 }}>
                expand_more
              </span>
            </summary>
            <p className="mt-3 text-[15px] text-ink-variant leading-relaxed">
              Perioral dermatitis is a chronic inflammatory rash of small red
              papules and pustules around the mouth, nose, or eyes. It typically
              affects women aged 16&ndash;45, with a clear margin around the lip
              line. Causes include topical steroids, fluoride toothpaste, heavy
              occlusives, and fragranced skincare. It is not contagious and
              usually resolves with trigger elimination.
            </p>
          </details>

          <details className="group rounded-2xl bg-surface-lowest border border-outline-variant/40 px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h2 className="text-ink font-bold tracking-tight" style={{ fontSize: 22 }}>
                What triggers perioral dermatitis?
              </h2>
              <span className="material-symbols-outlined text-ink-variant transition-transform group-open:rotate-180" style={{ fontSize: 24 }}>
                expand_more
              </span>
            </summary>
            <p className="mt-3 text-[15px] text-ink-variant leading-relaxed">
              The most common triggers are topical corticosteroids (including OTC
              hydrocortisone), fluoride and SLS in toothpaste, cinnamic-aldehyde
              flavorings, fragrance, heavy occlusives like coconut oil, and
              certain sunscreen filters. Hormonal shifts and inhaled steroids
              can also contribute. Most cases improve when all topical products
              are stopped for two weeks&mdash;the so-called &ldquo;zero therapy.&rdquo;
            </p>
          </details>
        </section>

        {/* 6. CATEGORY GRID ────────────────────────────────────────────── */}
        <section className="px-5 mt-12" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 26 }}>
            Check by category
          </h2>
          <p className="mt-1 text-sm text-ink-variant">
            Browse our vetted picks across the five product types most often implicated in PD flares.
          </p>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/check/${c.slug}`}
                className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
              >
                <h3 className="text-ink font-bold tracking-tight" style={{ fontSize: 18 }}>
                  {c.title}
                </h3>
                <p className="mt-2 text-[13px] text-ink-variant leading-snug">{c.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. FEATURED INGREDIENTS ─────────────────────────────────────── */}
        <section className="px-5 mt-12" aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 26 }}>
            Featured ingredients
          </h2>
          <p className="mt-1 text-sm text-ink-variant">
            Six ingredients that come up over and over in flagged products.
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURED_INGREDIENTS.map((i) => (
              <Link
                key={i.slug}
                href={`/ingredient/${i.slug}`}
                className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-ink font-bold tracking-tight" style={{ fontSize: 17 }}>
                    {i.name}
                  </h3>
                  <VerdictPill tone={i.tone} verdict={i.verdict} />
                </div>
                <p className="mt-2 text-[13px] text-ink-variant leading-snug">{i.answer}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 8. FEATURED PRODUCTS ────────────────────────────────────────── */}
        <section className="px-5 mt-12" aria-labelledby="products-heading">
          <h2 id="products-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 26 }}>
            Featured products
          </h2>
          <p className="mt-1 text-sm text-ink-variant">
            One-line verdicts on six products people ask about constantly.
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURED_PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/product/${p.slug}`}
                className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 hover:border-secondary/50 hover:shadow-card transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-ink font-bold tracking-tight" style={{ fontSize: 17 }}>
                    {p.name}
                  </h3>
                  <VerdictPill tone={p.tone} verdict={p.verdict} />
                </div>
                <p className="mt-2 text-[13px] text-ink-variant leading-snug">{p.line}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 9. FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-20 px-5 mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 26 }}>
            Frequently asked
          </h2>
          <p className="mt-1 text-sm text-ink-variant">
            {FAQS.length} answers, all marked up as FAQPage schema for AI search.
          </p>
          <div className="mt-5 divide-y divide-outline-variant/40 rounded-2xl bg-surface-lowest border border-outline-variant/40 overflow-hidden">
            {FAQS.map((f, idx) => (
              <details key={idx} className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 hover:bg-surface-low transition">
                  <h3 className="font-medium text-ink text-[15px] leading-snug">{f.q}</h3>
                  <span className="material-symbols-outlined text-ink-variant transition-transform group-open:rotate-180 shrink-0" style={{ fontSize: 22 }}>
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

        {/* 10. ABOUT ───────────────────────────────────────────────────── */}
        <section
          id="about"
          className="scroll-mt-20 px-5 mt-16 max-w-2xl mx-auto"
          aria-labelledby="about-heading"
        >
          <div className="h-px w-12 bg-ink/30" aria-hidden />
          <h2
            id="about-heading"
            className="mt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-variant"
          >
            About ClearPD
          </h2>
          <p className="mt-6 text-[17px] leading-[1.7] text-ink">
            ClearPD is an ingredient and product safety checker for people with
            perioral dermatitis. Paste a label, upload a photo, or scan a
            barcode &mdash; every ingredient is matched against a database of
            known PD triggers, and the product gets a tiered verdict: Safe,
            Caution, or Avoid.
          </p>
          <p className="mt-8 text-[12px] text-outline leading-relaxed max-w-md">
            Built on community evidence from thousands of PD sufferers. Not a
            substitute for a dermatologist.
          </p>
        </section>

        {/* 11. EMAIL CAPTURE ───────────────────────────────────────────── */}
        <section
          className="scroll-mt-20 px-5 mt-16 max-w-2xl mx-auto"
          aria-labelledby="email-heading"
        >
          <div className="h-px w-12 bg-ink/30" aria-hidden />
          <div className="mt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-variant">
            Weekly digest
          </div>
          <h2
            id="email-heading"
            className="mt-3 text-ink font-semibold tracking-tight"
            style={{ fontSize: 24 }}
          >
            Get safe-product picks weekly
          </h2>
          <p className="mt-3 text-[14px] text-ink-variant leading-relaxed max-w-md">
            One short email, every Sunday. New verdicts, ingredient deep-dives,
            and recovery protocols. Unsubscribe in one click.
          </p>
          <form
            className="mt-5 flex flex-col sm:flex-row gap-2 max-w-md"
            action="/api/subscribe"
            method="post"
          >
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-full bg-surface-lowest border border-outline-variant/50 px-4 min-h-[44px] text-sm text-ink placeholder:text-outline focus:outline-none focus:border-secondary"
            />
            <button
              type="submit"
              className="rounded-full bg-primary text-primary-on px-5 min-h-[44px] text-sm font-medium hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="px-5 mt-16 pb-6 text-center text-xs text-ink-variant">
          <p>
            ClearPD provides ingredient analysis for educational purposes only.
            Not medical advice. See a dermatologist for severe or persistent
            symptoms.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} ClearPD</p>
        </footer>
      </div>

      {/* JSON-LD ──────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  )
}
