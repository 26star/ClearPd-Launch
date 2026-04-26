'use client'

import dynamic from 'next/dynamic'

/**
 * Homepage scanner wrapper. Lazy-loads ProductScanner with PhaseToggle
 * suppressed for the low-friction first-touch surface. Result rendering
 * happens on /result/[scanId] — this component owns no result state.
 */
const ProductScanner = dynamic(
  () =>
    import('@/components/scanner/ProductScanner').then((m) => m.ProductScanner),
  {
    ssr: false,
    loading: () => (
      <div className="px-5 py-12 text-center text-sm text-ink-variant">
        Loading scanner&hellip;
      </div>
    ),
  },
)

export function HeroScanner() {
  return (
    <div className="rounded-[32px] bg-surface-lowest shadow-elevated pt-6 pb-2">
      <ProductScanner showPhase={false} />
    </div>
  )
}
