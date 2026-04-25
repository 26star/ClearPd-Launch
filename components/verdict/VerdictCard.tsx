'use client'

import { ScanResponse } from '@/lib/scanner/types'
import { TIER_STYLES } from './tierStyles'
import { FlaggedIngredients } from './FlaggedIngredients'
import { IngredientList } from './IngredientList'

interface VerdictCardProps {
  result: ScanResponse
  onScanAgain: () => void
}

export function VerdictCard({ result, onScanAgain }: VerdictCardProps) {
  const { product, verdict, ingredients } = result
  const style = TIER_STYLES[verdict.tier]
  const matchedCount = verdict.coverage.matched
  const totalCount = verdict.coverage.total
  const isAvoid = verdict.tier === 'avoid'
  const isInsufficient = verdict.tier === 'insufficient_data'

  return (
    <div className="space-y-4 pb-8">
      {/* HERO VERDICT CARD ─────────────────────────────────────── */}
      <div
        className={[
          'mx-5 rounded-3xl p-6 relative overflow-hidden',
          style.card,
          isAvoid ? 'shadow-elevated' : 'shadow-card border border-outline-variant/40',
        ].join(' ')}
      >
        {/* Subtle dot pattern on dark cards */}
        {isAvoid && (
          <div
            className="absolute inset-0 dot-pattern pointer-events-none"
            aria-hidden
          />
        )}

        <div className="relative">
          {/* Tier pill */}
          <div
            className={[
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4',
              style.pill,
            ].join(' ')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {style.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {style.label}
            </span>
          </div>

          {/* Product name (or fallback) */}
          <h1
            className={[
              'font-bold leading-tight tracking-tight',
              isAvoid ? 'text-primary-on' : 'text-ink',
            ].join(' ')}
            style={{ fontSize: 28 }}
          >
            {product.name || 'Pasted ingredients'}
          </h1>
          {product.brand && (
            <div
              className={[
                'text-sm mt-1',
                isAvoid ? 'text-primary-on/70' : 'text-ink-variant',
              ].join(' ')}
            >
              {product.brand}
            </div>
          )}

          {/* Why */}
          <p
            className={[
              'mt-4 text-sm leading-relaxed',
              isAvoid ? 'text-primary-on/85' : 'text-ink-variant',
            ].join(' ')}
          >
            {verdict.why}
          </p>

          {/* Coverage line */}
          {totalCount > 0 && (
            <div
              className={[
                'mt-4 pt-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold',
                isAvoid
                  ? 'border-t border-primary-on/15 text-primary-on/60'
                  : 'border-t border-outline-variant/40 text-outline',
              ].join(' ')}
            >
              <span>
                Recognized {matchedCount} of {totalCount} ingredients
              </span>
              <span>{verdict.confidence} confidence</span>
            </div>
          )}

          {/* Source badge */}
          {product.source !== 'unknown' && product.source !== 'user_ocr' && (
            <div
              className={[
                'mt-3 text-[10px]',
                isAvoid ? 'text-primary-on/50' : 'text-outline',
              ].join(' ')}
            >
              Source:{' '}
              {product.source === 'curated'
                ? 'ClearPD curated'
                : 'Open Beauty Facts'}
            </div>
          )}
        </div>
      </div>

      {/* FLAGGED + HELPFUL ─────────────────────────────────────── */}
      {!isInsufficient && (
        <div className="px-5">
          <FlaggedIngredients
            flagged={verdict.flagged_ingredients}
            helpful={verdict.helpful_ingredients}
          />
        </div>
      )}

      {/* ALL INGREDIENTS ───────────────────────────────────────── */}
      {ingredients.length > 0 && (
        <div className="px-5">
          <IngredientList ingredients={ingredients} />
        </div>
      )}

      {/* SCAN AGAIN ────────────────────────────────────────────── */}
      <div className="px-5 pt-2">
        <button
          type="button"
          onClick={onScanAgain}
          className="w-full rounded-2xl bg-surface-lowest border border-outline-variant/50 text-ink font-medium py-4 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            refresh
          </span>
          Scan another product
        </button>
      </div>
    </div>
  )
}
