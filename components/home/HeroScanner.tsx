'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ScanResponse } from '@/lib/scanner/types'
import { VerdictCard } from '@/components/verdict/VerdictCard'
import { UnknownProductPrompt } from '@/components/flywheel/UnknownProductPrompt'

/**
 * Homepage scanner wrapper.
 *
 * Architecture is unchanged from the canonical scanner: this just hosts the
 * result state and lazy-loads the existing ProductScanner (which orchestrates
 * PhaseToggle, ModeTabs, CameraView, UploadView, PasteView).
 *
 * All visual polish lives inside the leaf components (PasteView, ModeTabs, …)
 * and inside the surrounding card on this file. No logic / props / control
 * flow has been changed.
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
  }
)

export function HeroScanner() {
  const [result, setResult] = useState<ScanResponse | null>(null)

  if (result) {
    return (
      <div className="rounded-[32px] bg-surface-lowest shadow-elevated overflow-hidden">
        <VerdictCard result={result} onScanAgain={() => setResult(null)} />
        <UnknownProductPrompt result={result} />
      </div>
    )
  }

  return (
    <div className="rounded-[32px] bg-surface-lowest shadow-elevated ring-1 ring-outline-variant/20 pt-6 pb-2">
      <ProductScanner onResult={setResult} />
    </div>
  )
}
