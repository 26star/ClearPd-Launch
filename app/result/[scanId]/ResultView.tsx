import Link from 'next/link'
import { TIER_STYLES } from '@/components/verdict/tierStyles'
import { ScannerCTA } from '@/components/content/ScannerCTA'
import { findIngredientSlugByInciName } from '@/lib/content/ingredients'
import { ProductVerdict, IngredientVerdict, VerdictTier, Phase } from '@/lib/scanner/types'

// ─── Types matching the DB row shape ──────────────────────────────────

interface ScanRow {
  id: string
  method: 'barcode' | 'ocr' | 'paste'
  raw_input: string | null
  matched_product_id: string | null
  extracted_ingredient_ids: string[] | null
  unknown_ingredient_strings: string[] | null
  phase: Phase | null
  verdict_json: ProductVerdict | null
  created_at: string
}

interface ProductRow {
  id: string
  name: string
  brand: string | null
  barcode: string | null
  image_url: string | null
  source: 'curated' | 'obf' | 'user_ocr' | string
}

interface IngredientRow {
  id: string
  inci_name: string
  display_name: string | null
  function: string | null
}

// ─── Trait detection (used for the badge row) ──────────────────────────

const TRAIT_DEFS: { label: string; absentInciNames: string[] }[] = [
  { label: 'SLS-free',                absentInciNames: ['Sodium Lauryl Sulfate', 'Sodium Laureth Sulfate'] },
  { label: 'Fragrance-free',          absentInciNames: ['Parfum'] },
  { label: 'Fluoride-free',           absentInciNames: ['Sodium Fluoride'] },
  { label: 'Coconut-oil-free',        absentInciNames: ['Coconut Oil'] },
  { label: 'Cinnamic-aldehyde-free',  absentInciNames: ['Cinnamic Aldehyde'] },
  { label: 'Steroid-free',            absentInciNames: ['Hydrocortisone'] },
  { label: 'Retinoid-free',           absentInciNames: ['Retinol'] },
]

function detectTraits(ingredients: IngredientRow[]): string[] {
  const present = new Set(ingredients.map((i) => i.inci_name))
  return TRAIT_DEFS
    .filter((t) => t.absentInciNames.every((n) => !present.has(n)))
    .map((t) => t.label)
}

// ─── Method labels ────────────────────────────────────────────────────

const METHOD_LABEL: Record<ScanRow['method'], string> = {
  barcode: 'Barcode scan',
  ocr: 'Photo / label scan',
  paste: 'Pasted ingredients',
}

// ─── Verdict pill (dot + label, matches the editorial VerdictPill style) ──

function VerdictPill({ tier, inverse = false }: { tier: VerdictTier; inverse?: boolean }) {
  const s = TIER_STYLES[tier]
  const labelColor = inverse ? 'text-primary-on/85' : 'text-ink-variant'
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] ${labelColor}`}
    >
      <span className={`block w-1.5 h-1.5 rounded-full ${s.dot}`} aria-hidden />
      {s.label}
    </span>
  )
}

// ─── Per-ingredient row (for flagged / helpful / full list) ────────────

function IngredientRowDisplay({
  inci_name,
  display_name,
  tier,
  why,
  fn,
}: {
  inci_name: string
  display_name?: string | null
  tier: VerdictTier
  why?: string
  fn?: string | null
}) {
  const slug = findIngredientSlugByInciName(inci_name)
  const Title = slug ? (
    <Link
      href={`/ingredient/${slug}`}
      className="text-ink font-semibold hover:underline"
      style={{ fontSize: 15 }}
    >
      {display_name || inci_name}
    </Link>
  ) : (
    <span className="text-ink font-semibold" style={{ fontSize: 15 }}>
      {display_name || inci_name}
    </span>
  )

  return (
    <li className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        {Title}
        {fn && <div className="text-[12px] text-ink-variant mt-0.5">{fn}</div>}
        {why && <div className="text-[13px] text-ink-variant mt-1.5 leading-snug">{why}</div>}
      </div>
      <div className="shrink-0">
        <VerdictPill tier={tier} />
      </div>
    </li>
  )
}

// ─── Main component ───────────────────────────────────────────────────

export function ResultView({
  scan,
  product,
  ingredients,
  ocrConfidence,
}: {
  scan: ScanRow
  product: ProductRow | null
  ingredients: IngredientRow[]
  ocrConfidence?: number
}) {
  const verdict = scan.verdict_json
  const tier: VerdictTier = verdict?.tier ?? 'insufficient_data'
  const tierStyle = TIER_STYLES[tier]

  const flagged: IngredientVerdict[] = verdict?.flagged_ingredients ?? []
  const helpful: IngredientVerdict[] = verdict?.helpful_ingredients ?? []
  const flaggedIds = new Set(flagged.map((v) => v.ingredient_id))
  const helpfulIds = new Set(helpful.map((v) => v.ingredient_id))
  const otherIngredients = ingredients.filter(
    (i) => !flaggedIds.has(i.id) && !helpfulIds.has(i.id),
  )

  const traits = detectTraits(ingredients)
  const unknownStrings = scan.unknown_ingredient_strings ?? []
  const phaseLabel =
    scan.phase === 'active' ? 'Active flare'
      : scan.phase === 'maintenance' ? 'Maintenance'
      : 'Any phase'

  return (
    <main className="min-h-screen bg-bg pb-20">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="flex items-center justify-between px-6 py-4 safe-pt max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-semibold tracking-tight text-ink">
            ClearPD
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/scan" className="text-ink-variant hover:text-ink transition">
              Scan another
            </Link>
            <Link href="/#faq" className="text-ink-variant hover:text-ink transition">
              Safety Guide
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 pt-8">
        {/* Eyebrow */}
        <div className="text-[12px] uppercase tracking-wider text-ink-variant">
          {METHOD_LABEL[scan.method]} · {phaseLabel}
        </div>

        {/* Low OCR confidence warning — only shown when image read was poor */}
        {typeof ocrConfidence === 'number' && ocrConfidence < 70 && (
          <div
            role="note"
            className="mt-3 flex items-start gap-2 rounded-2xl bg-tertiary/10 border border-tertiary/20 px-4 py-3 text-[13px] text-tertiary"
          >
            <span
              className="material-symbols-outlined shrink-0 mt-0.5"
              style={{ fontSize: 16 }}
              aria-hidden
            >
              warning
            </span>
            <span className="leading-snug">
              <strong className="font-semibold">Low OCR confidence ({ocrConfidence}%).</strong>{' '}
              Some ingredients may be misread — double-check the list below or paste
              the text manually for an accurate verdict.
            </span>
          </div>
        )}

        {/* Verdict hero */}
        <section
          className={`mt-3 rounded-3xl p-6 sm:p-8 ${tierStyle.card} ${tierStyle.cardText}`}
        >
          <VerdictPill tier={tier} inverse={tier === 'avoid'} />
          <h1
            className="mt-4 font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: 'clamp(26px, 5vw, 36px)' }}
          >
            {product?.name ?? (scan.method === 'paste' ? 'Pasted ingredient list' : 'Scanned ingredients')}
          </h1>
          {product?.brand && (
            <div className="mt-1.5 text-[14px] opacity-80">{product.brand}</div>
          )}
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed">
            {verdict?.why ?? 'No verdict computed.'}
          </p>
          {verdict && verdict.coverage.total > 0 && (
            <p className="mt-3 text-[13px] opacity-80">
              Recognised {verdict.coverage.matched} of {verdict.coverage.total} ingredients
              {verdict.coverage.percentage < 0.5 ? ' — verdict may be incomplete' : ''}.
            </p>
          )}
        </section>

        {/* Product header card (when matched) */}
        {product && (
          <section className="mt-5 flex items-center gap-4 rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4">
            <div className="shrink-0 w-14 h-14 rounded-xl bg-surface-low flex items-center justify-center text-ink-variant">
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                {product.source === 'curated' ? 'verified' : 'inventory_2'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-ink-variant">
                {product.source === 'curated' ? 'Curated by ClearPD' : 'From Open Beauty Facts'}
                {product.barcode && ` · ${product.barcode}`}
              </div>
              <div className="mt-0.5 text-ink font-semibold truncate" style={{ fontSize: 15 }}>
                {product.name}
              </div>
            </div>
          </section>
        )}

        {/* Trait tags */}
        {traits.length > 0 && (
          <section className="mt-5">
            <div className="flex flex-wrap gap-2">
              {traits.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full bg-safe-bg/60 text-safe text-[11px] font-medium px-2.5 py-1"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }} aria-hidden>
                    check
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Flagged ingredients */}
        {flagged.length > 0 && (
          <section className="mt-10">
            <h2 className="text-ink font-bold tracking-tight" style={{ fontSize: 22 }}>
              Flagged ingredients
            </h2>
            <p className="mt-1 text-[13px] text-ink-variant">
              These are the ingredients driving the verdict. Tap any to read why.
            </p>
            <ul className="mt-4 divide-y divide-outline-variant/40 rounded-2xl bg-surface-lowest border border-outline-variant/40 px-5">
              {flagged.map((v) => (
                <IngredientRowDisplay
                  key={v.ingredient_id}
                  inci_name={v.inci_name}
                  display_name={v.display_name}
                  tier={v.tier}
                  why={v.why}
                />
              ))}
            </ul>
          </section>
        )}

        {/* Helpful ingredients */}
        {helpful.length > 0 && (
          <section className="mt-10">
            <h2 className="text-ink font-bold tracking-tight" style={{ fontSize: 22 }}>
              Helpful ingredients
            </h2>
            <p className="mt-1 text-[13px] text-ink-variant">
              Community evidence supports these for PD recovery.
            </p>
            <ul className="mt-4 divide-y divide-outline-variant/40 rounded-2xl bg-surface-lowest border border-outline-variant/40 px-5">
              {helpful.map((v) => (
                <IngredientRowDisplay
                  key={v.ingredient_id}
                  inci_name={v.inci_name}
                  display_name={v.display_name}
                  tier={v.tier}
                  why={v.why}
                />
              ))}
            </ul>
          </section>
        )}

        {/* All other recognised ingredients */}
        {otherIngredients.length > 0 && (
          <section className="mt-10">
            <h2 className="text-ink font-bold tracking-tight" style={{ fontSize: 22 }}>
              Other recognised ingredients
            </h2>
            <p className="mt-1 text-[13px] text-ink-variant">
              Matched against our database with no concerning signal.
            </p>
            <ul className="mt-4 divide-y divide-outline-variant/40 rounded-2xl bg-surface-lowest border border-outline-variant/40 px-5">
              {otherIngredients.map((i) => (
                <IngredientRowDisplay
                  key={i.id}
                  inci_name={i.inci_name}
                  display_name={i.display_name}
                  tier="safe"
                  fn={i.function}
                />
              ))}
            </ul>
          </section>
        )}

        {/* Unknown ingredients */}
        {unknownStrings.length > 0 && (
          <section className="mt-10">
            <h2 className="text-ink font-bold tracking-tight" style={{ fontSize: 18 }}>
              Not yet in our database ({unknownStrings.length})
            </h2>
            <p className="mt-1 text-[13px] text-ink-variant">
              We logged these for curation. They didn&rsquo;t match anything in our PD vocabulary.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {unknownStrings.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full bg-surface-container text-ink-variant text-[11px] px-2 py-0.5 font-mono"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Phase context + scan again */}
        <section className="mt-10 rounded-2xl bg-surface-low border border-outline-variant/40 p-5">
          <div className="text-[13px] text-ink-variant">
            Verdict computed for <span className="text-ink font-medium">{phaseLabel.toLowerCase()}</span>.
            {scan.phase === 'any' && ' Scan again with Active or Maintenance to see phase-specific results.'}
          </div>
          <Link
            href="/scan"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-on px-5 min-h-[44px] text-sm font-medium hover:opacity-90 transition"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
              photo_camera
            </span>
            Scan another product
          </Link>
        </section>

        {/* Bottom scanner CTA — full evergreen pitch */}
        <div className="mt-12">
          <ScannerCTA label="Open the checker" />
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-6 text-center text-xs text-ink-variant">
          <p>
            ClearPD provides ingredient analysis for educational purposes only.
            Not medical advice. See a dermatologist for severe or persistent symptoms.
          </p>
          <p className="mt-2">
            Scan ID: <span className="font-mono">{scan.id.slice(0, 8)}</span> ·{' '}
            {new Date(scan.created_at).toLocaleString('en-GB')}
          </p>
        </footer>
      </div>
    </main>
  )
}
