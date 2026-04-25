'use client'

import { ScanResponse } from '@/lib/scanner/types'

interface UnknownProductPromptProps {
  result: ScanResponse
}

/**
 * Shown when verdict.tier === 'insufficient_data'.
 * Converts dead-end scans into community contributions.
 *
 * v1: surfaces the prompt with link to a submission form (built later).
 * The form gates submission behind auth; the prompt itself is anonymous.
 */
export function UnknownProductPrompt({ result }: UnknownProductPromptProps) {
  const { product } = result
  if (result.verdict.tier !== 'insufficient_data') return null

  return (
    <div className="mx-5">
      <div className="rounded-3xl bg-secondary-tint p-6 relative overflow-hidden">
        <span
          className="material-symbols-outlined absolute -right-3 -top-3 text-secondary/15"
          style={{ fontSize: 96 }}
          aria-hidden
        >
          forum
        </span>

        <div className="relative">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">
            Help build ClearPD
          </div>
          <h2
            className="font-serif text-ink leading-tight tracking-editorial"
            style={{ fontSize: 22 }}
          >
            We don&rsquo;t have enough data on{' '}
            <span className="italic">
              {product.name || 'this product'}
            </span>{' '}
            yet.
          </h2>
          <p className="text-sm text-ink-variant mt-3 leading-relaxed">
            ClearPD&rsquo;s verdicts come from real PD experiences. If
            you&rsquo;ve used this product, share what happened — the next
            person searching for it sees your evidence.
          </p>

          <a
            href="/contribute"
            className="inline-flex items-center gap-1.5 mt-4 bg-secondary text-secondary-on rounded-full px-4 py-2.5 text-sm font-medium"
          >
            Share your experience
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
