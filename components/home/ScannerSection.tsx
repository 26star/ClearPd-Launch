'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ScanResponse } from '@/lib/scanner/types'
import { VerdictCard } from '@/components/verdict/VerdictCard'
import { UnknownProductPrompt } from '@/components/flywheel/UnknownProductPrompt'

// Scanner uses browser-only APIs (camera, WASM, Tesseract). Never SSR it.
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
 * Section 3 of the homepage — "THE PODSI CHECKER".
 *
 * Wraps the existing ProductScanner so we can keep the surrounding page as a
 * Server Component (for metadata + JSON-LD) while still using browser-only
 * scanner code (camera, WASM, Tesseract).
 */
export function ScannerSection() {
  const [result, setResult] = useState<ScanResponse | null>(null)

  return (
    <section
      id="podsi-checker"
      aria-labelledby="podsi-checker-heading"
      className="scroll-mt-20 mx-5 my-10 rounded-3xl bg-surface-lowest border border-outline-variant/40 shadow-card overflow-hidden"
    >
      {/* Eyebrow + heading */}
      <div className="px-5 pt-6 pb-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-secondary font-medium">
          The PODSI Checker
        </p>
        <h2
          id="podsi-checker-heading"
          className="mt-1 font-serif text-ink leading-tight tracking-editorial"
          style={{ fontSize: 28 }}
        >
          Scan, photograph, or paste a product
        </h2>
        <p className="text-sm text-ink-variant mt-2 max-w-prose">
          Get a real-time verdict in seconds. Verdicts are based on community
          evidence from thousands of perioral-dermatitis sufferers.
        </p>
      </div>

      {result ? (
        <>
          <VerdictCard result={result} onScanAgain={() => setResult(null)} />
          <UnknownProductPrompt result={result} />
        </>
      ) : (
        <ProductScanner onResult={setResult} />
      )}
    </section>
  )
}
