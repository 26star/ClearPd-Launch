import Link from 'next/link'
import { HeroScanner } from '@/components/home/HeroScanner'
import { VerdictPill } from '@/components/content/VerdictPill'

// ─── Content data ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { slug: 'moisturizers', title: 'Moisturizers',
    blurb: 'Heavy occlusives like petrolatum, mineral oil, and coconut oil are documented PD triggers. Check yours against ClearPD’s database.' },
  { slug: 'cleansers', title: 'Cleansers',
    blurb: 'SLS, sulfates, and fragrance are the top PD triggers in cleansers. Find barrier-safe formulas.' },
  { slug: 'sunscreens', title: 'Sunscreens',
    blurb: 'Chemical filters like avobenzone, octocrylene, and oxybenzone trigger many PD sufferers. Mineral SPFs with zinc oxide are usually safer.' },
  { slug: 'toothpaste', title: 'Toothpaste',
    blurb: 'Toothpaste is the #1 overlooked PD trigger. Fluoride, SLS, and cinnamic aldehyde are the top three culprits — find PD-safe alternatives.' },
  { slug: 'lip-balm', title: 'Lip Balm',
    blurb: 'Lanolin, beeswax, and flavorings sit directly on the perioral skin all day. The most overlooked source of PD flares around the mouth.' },
] as const

const FEATURED_INGREDIENTS = [
  { slug: 'sodium-lauryl-sulfate', name: 'Sodium Lauryl Sulfate', verdict: 'Avoid', tone: 'tertiary',
    answer: 'The #1 reported PD trigger. A foaming surfactant that disrupts the skin barrier and is widely associated with perioral flares, especially in toothpaste and cleansers.' },
  { slug: 'fluoride', name: 'Fluoride', verdict: 'Avoid', tone: 'tertiary',
    answer: 'Sodium fluoride and stannous fluoride are documented PD triggers, especially for breakouts around the mouth and chin. Switch to a fluoride-free toothpaste for two weeks as a self-test.' },
  { slug: 'cinnamic-aldehyde', name: 'Cinnamic Aldehyde', verdict: 'Avoid', tone: 'tertiary',
    answer: 'A flavoring used in cinnamon toothpaste and chewing gum. One of the most well-documented perioral dermatitis triggers in dermatology literature.' },
  { slug: 'fragrance', name: 'Fragrance / Parfum', verdict: 'Avoid', tone: 'tertiary',
    answer: '“Fragrance” and “parfum” can mask 100+ undisclosed chemicals. Eliminate fragranced skincare, laundry detergent, and hair products during recovery.' },
  { slug: 'coconut-oil', name: 'Coconut Oil', verdict: 'Avoid', tone: 'tertiary',
    answer: 'Highly comedogenic (rating 4/5) and feeds Malassezia yeast. Widely reported by real PD sufferers as a flare trigger. Avoid until your skin barrier is fully restored.' },
  { slug: 'petrolatum', name: 'Petrolatum', verdict: 'Caution', tone: 'caution',
    answer: 'Inert and occlusive — tolerated by some PD sufferers and used in zero therapy as a barrier sealant. However, heavy occlusion can trap bacteria and worsen flares for many. Patch-test for 3 days before regular use.' },
] as const

const FEATURED_PRODUCTS = [
  { slug: 'vanicream-moisturizing-cream', name: 'Vanicream Moisturizing Cream', verdict: 'Safe', tone: 'safe',
    line: 'Free of fragrance, dyes, lanolin, parabens, and formaldehyde. The most-recommended moisturizer by real PD sufferers.' },
  { slug: 'cerave-moisturizing-cream', name: 'CeraVe Moisturizing Cream', verdict: 'Caution', tone: 'caution',
    line: 'Contains ceramides (good) but also dimethicone and behentrimonium methosulfate. Mixed reports from real PD sufferers during active flares.' },
  { slug: 'cetaphil-gentle-cleanser', name: 'Cetaphil Gentle Skin Cleanser', verdict: 'Safe', tone: 'safe',
    line: 'Recently reformulated — SLS and parabens removed, niacinamide and a gentle surfactant added. Older bottles on shelves may still carry the old formula; check the label.' },
  { slug: 'la-roche-posay-toleriane', name: 'La Roche-Posay Toleriane', verdict: 'Safe', tone: 'safe',
    line: 'Minimalist formula designed for reactive skin. Widely tolerated by real PD sufferers and a frequent dermatologist recommendation.' },
  { slug: 'eucerin-aquaphor', name: 'Aquaphor Healing Ointment', verdict: 'Caution', tone: 'caution',
    line: 'Petrolatum-based occlusive that some PD sufferers use as a barrier sealant. However, it also contains lanolin alcohol — a known PD trigger. Use with caution and patch-test first.' },
  { slug: 'colgate-total', name: 'Colgate Total', verdict: 'Avoid', tone: 'tertiary',
    line: 'Contains SLS and zinc phosphate. Strong association with perioral flares around the mouth and chin. The #1 toothpaste flagged on ClearPD scans.' },
] as const

const FAQS: { q: string; a: string }[] = [
  { q: 'What is perioral dermatitis?',
    a: 'Perioral dermatitis (PD) is a chronic inflammatory rash of small red papules and pustules around the mouth, nose, or eyes. It typically affects women aged 16–45, often triggered by topical steroids, fluoride toothpaste, heavy occlusives, or fragranced skincare. It is not contagious and usually resolves with trigger elimination.' },
  { q: 'How long does perioral dermatitis last?',
    a: 'With strict zero therapy (stopping all skincare except plain water and a bland moisturizer), PD usually clears in 4–12 weeks. With oral antibiotics (doxycycline or minocycline), most cases resolve in 6–8 weeks. Without intervention, PD can persist for months or years and recur.' },
  { q: 'Is perioral dermatitis caused by toothpaste?',
    a: 'For many people, yes. Sodium lauryl sulfate (SLS), cinnamic aldehyde flavoring, and fluoride in toothpaste are documented PD triggers. Switching to a SLS-free, fragrance-free toothpaste for two weeks is the cheapest, fastest diagnostic test you can run on yourself.' },
  { q: 'Can I use moisturizer with perioral dermatitis?',
    a: 'Yes — but only minimalist, fragrance-free, occlusive-free formulas. Vanicream and La Roche-Posay Toleriane are widely tolerated. Avoid coconut oil, shea butter, and anything with “natural” essential oils during an active flare.' },
  { q: 'Does sunscreen cause perioral dermatitis?',
    a: 'Some sunscreens do. Chemical filters like avobenzone and octocrylene, plus fragrance and certain emollients, are common triggers. Mineral (zinc oxide) sunscreens with short ingredient lists are usually safer. Always patch-test on the inner forearm for 3 days first.' },
  { q: 'Should I stop using all skincare?',
    a: 'Most dermatologists recommend zero therapy — stopping all topical products including makeup, moisturizers, and cleansers — for at least 2 weeks. Wash with lukewarm water only. This isolates the trigger and lets the skin barrier reset before reintroducing anything.' },
  { q: 'Can stress cause perioral dermatitis?',
    a: 'Stress alone doesn’t cause PD, but it can worsen flares by raising cortisol and disrupting the skin barrier. The primary causes are topical irritants and steroids. Manage stress as supportive care, not as a cure.' },
  { q: 'Is perioral dermatitis the same as rosacea?',
    a: 'No. They look similar but differ. PD presents as small papules and pustules around the mouth, often with a clear margin around the lip line. Rosacea typically affects the cheeks and nose with persistent redness and visible blood vessels. Treatments overlap but aren’t identical.' },
  { q: 'Can I wear makeup with perioral dermatitis?',
    a: 'Avoid makeup during active flares — especially foundation, concealer, and lip products. If you must, choose mineral powders without bismuth oxychloride, talc, or fragrance. Reintroduce one product at a time after the rash clears.' },
  { q: 'What’s the best treatment for perioral dermatitis?',
    a: 'First-line: stop all topical steroids and trigger products. Second-line: topical metronidazole, azelaic acid, or pimecrolimus. Third-line: oral tetracyclines (doxycycline 100mg/day for 6–8 weeks). Always work with a dermatologist for prescription care.' },
  { q: 'Can topical steroids cause perioral dermatitis?',
    a: 'Yes — topical corticosteroids are the most common cause of PD. Even mild OTC hydrocortisone, used on the face for eczema or rashes, can trigger it. Stopping steroids often causes a rebound flare before improvement.' },
  { q: 'Is fluoride bad for perioral dermatitis?',
    a: 'For a subset of patients, yes. Sodium fluoride and stannous fluoride are documented triggers. Switching to a fluoride-free toothpaste for two weeks is a low-cost test. If your rash clears, you have your answer.' },
  { q: 'Can children get perioral dermatitis?',
    a: 'Yes. Pediatric perioral dermatitis is well-documented and often linked to inhaled steroids (asthma inhalers), topical steroids on eczema, or fluoride toothpaste. Treatment mirrors adult care but uses pediatric-safe antibiotics like erythromycin.' },
  { q: 'Does diet affect perioral dermatitis?',
    a: 'Evidence is limited. Some patients report improvement after cutting cinnamon, dairy, or sugar, but this is anecdotal. Diet is unlikely to be the primary trigger — focus on topical products first, then experiment with diet if needed.' },
  { q: 'How does ClearPD decide if a product is safe?',
    a: 'ClearPD parses your product’s INCI list and matches each ingredient against a database of known PD triggers, alternatives, and safe ingredients. Each flagged ingredient is weighted by its position on the INCI list — ingredients at higher concentrations (positions 1–5) score more heavily than trace ingredients (position 20+). The result is a tiered verdict: Safe, Caution, or Avoid. The database is built from peer-reviewed dermatology literature, real PD sufferer experiences, and consensus from PD specialists. Every flagged ingredient links to its evidence and alternatives.' },
  { q: 'Is ClearPD a substitute for a dermatologist?',
    a: 'No. ClearPD helps you eliminate ingredient triggers — a key part of recovery — but is not medical advice. If your rash is severe, spreading, or persistent for more than 4 weeks, see a board-certified dermatologist.' },
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
    'ClearPD helps people with perioral dermatitis identify trigger ingredients in skincare, toothpaste, and cosmetics through position-weighted ingredient analysis.',
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
            Paste any ingredient list &mdash; skincare, toothpaste, makeup, lip balm.
            ClearPD instantly flags the 40+ ingredients known to trigger PD
            flares. Free, no signup, no tracking.
          </p>

          {/* Pill-shaped scanner — section 3 */}
          <div className="mt-10 sm:mt-12 max-w-2xl mx-auto text-left">
            <HeroScanner />
          </div>

          {/* Trust strip — five micro-claims that differentiate ClearPD */}
          <p className="mt-6 text-[12px] text-ink-variant tracking-wide max-w-2xl mx-auto">
            Free forever &middot; No signup &middot; No tracking &middot; No dark patterns
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto">

        {/* 4 + 5. EXPANDABLE Q&A ───────────────────────────────────────── */}
        <section className="px-5 mt-10 space-y-3" aria-label="About perioral dermatitis">
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
              The most common triggers are topical corticosteroids (including over-the-counter
              hydrocortisone), sodium lauryl sulfate and fluoride in toothpaste, cinnamic
              aldehyde flavorings, fragrance and parfum, heavy occlusives like coconut oil
              and lanolin, and certain chemical sunscreen filters. Hormonal shifts, inhaled
              corticosteroids (asthma inhalers), and prolonged mask-wearing can also
              contribute. The first-line community protocol is zero therapy &mdash; stopping
              all topical products for 2&ndash;4 weeks while the skin barrier resets. Most
              cases clear within 4&ndash;12 weeks once triggers are eliminated.
            </p>
          </details>
        </section>

        {/* 6. CATEGORY GRID ────────────────────────────────────────────── */}
        <section className="px-5 mt-12" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 26 }}>
            Check by category
          </h2>
          <p className="mt-1 text-sm text-ink-variant">
            The five product types most likely to trigger perioral dermatitis flares.
            Each category has its own checker, top triggers list, and vetted product
            recommendations.
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
            The six ingredients that flag most often in scanned products. Click any
            ingredient for the full PD safety profile, alternatives, and products
            containing it.
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
            Verdicts on the six most-searched PD products. Each verdict is based on
            the full ingredient breakdown &mdash; click for the complete analysis.
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

        {/* 8b. HOW CLEARPD WORKS — methodology prose ───────────────────── */}
        <section className="px-5 mt-12" aria-labelledby="how-it-works-heading">
          <h2
            id="how-it-works-heading"
            className="text-ink font-bold tracking-tight"
            style={{ fontSize: 26 }}
          >
            How ClearPD works
          </h2>
          <p className="mt-3 text-[15px] text-ink-variant leading-relaxed">
            Many common skincare and toothpaste ingredients trigger perioral dermatitis.
            Documented culprits include sodium lauryl sulfate (SLS), fluoride, fragrance,
            cinnamic aldehyde, heavy occlusives, and topical steroids. The ClearPD checker
            scans any product&rsquo;s ingredient list and returns a tiered verdict
            &mdash; Safe, Caution, or Avoid &mdash; using ClearPD&rsquo;s position-weighted
            ingredient analysis, which weights each flagged ingredient by its position on
            the INCI list. Paste a label, upload a photo, or scan a barcode to get an
            answer in seconds. Database built from peer-reviewed literature, dermatology
            consensus, and real PD sufferer evidence.
          </p>
        </section>

        {/* 9. FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-20 px-5 mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-ink font-bold tracking-tight" style={{ fontSize: 26 }}>
            Frequently asked questions
          </h2>
          <p className="mt-1 text-sm text-ink-variant">
            {FAQS.length} questions PD sufferers ask most often. Every answer is sourced
            from clinical literature, dermatology consensus, and real PD sufferer
            experiences.
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
            ClearPD is a free ingredient and product safety checker built specifically
            for people with perioral dermatitis. Paste a label, upload a photo, or scan
            a barcode &mdash; every ingredient is matched against known PD triggers.
          </p>
        </section>

        {/* 11. EMAIL CAPTURE ───────────────────────────────────────────── */}
        <section
          className="scroll-mt-20 px-5 mt-16 max-w-2xl mx-auto"
          aria-labelledby="email-heading"
        >
          <div className="h-px w-12 bg-ink/30" aria-hidden />
          <div className="mt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-variant">
            Newsletter
          </div>
          <h2
            id="email-heading"
            className="mt-3 text-ink font-semibold tracking-tight"
            style={{ fontSize: 24 }}
          >
            The PD Recovery Newsletter
          </h2>
          <p className="mt-3 text-[14px] text-ink-variant leading-relaxed max-w-md">
            Get the safe-product picks, ingredient deep-dives, and recovery protocols
            every Sunday. Written by someone with PD, for people with PD. One email,
            no spam, unsubscribe in one click.
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
        <footer className="px-5 mt-16 pb-6 text-center text-xs text-ink-variant max-w-2xl mx-auto">
          <p>
            Last updated: April 2026 &middot; &copy; {new Date().getFullYear()} ClearPD
          </p>
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
