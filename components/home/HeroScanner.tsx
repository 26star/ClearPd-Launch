'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ScanResponse } from '@/lib/scanner/types'
import { VerdictCard } from '@/components/verdict/VerdictCard'
import { UnknownProductPrompt } from '@/components/flywheel/UnknownProductPrompt'

// ProductScanner uses browser-only APIs (camera, WASM, Tesseract). Never SSR.
const ProductScanner = dynamic(
  () => import('@/components/scanner/ProductScanner').then(m => m.ProductScanner),
  {
    ssr: false,
    loading: () => (
      <div className="px-5 py-12 text-center text-sm text-ink-variant">
        Loading scanner&hellip;
      </div>
    ),
  }
)

/**
 * Hero scanner — the spec'd 3-mode ProductScanner (Camera / Upload / Paste)
 * embedded into the homepage hero. Keeps the canonical phase toggle + mode
 * tabs from /scan; only difference is it lives inside the hero `text-center`
 * column and switches to a left-aligned card on result.
 */
export function HeroScanner() {
  const [result, setResult] = useState<ScanResponse | null>(null)

  if (result) {
    return (
      <div className="rounded-3xl bg-surface-lowest border border-outline-variant/40 shadow-elevated overflow-hidden text-left">
        <VerdictCard result={result} onScanAgain={() => setResult(null)} />
        <UnknownProductPrompt result={result} />
      </div>
    )
  }

  return (
    <div className="text-left">
      <ProductScanner onResult={setResult} hidePhase />
    </div>
  )
}
