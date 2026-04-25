'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ScanResponse } from '@/lib/scanner/types'
import { VerdictCard } from '@/components/verdict/VerdictCard'
import { UnknownProductPrompt } from '@/components/flywheel/UnknownProductPrompt'
import Link from 'next/link'

// Scanner uses browser-only APIs (camera, WASM). Never SSR it.
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

export default function ScanPage() {
  const [result, setResult] = useState<ScanResponse | null>(null)

  return (
    <main className="min-h-screen bg-bg pb-12">
      {/* TOP BAR ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-outline-variant/40">
        <div className="flex items-center justify-between px-5 py-3 safe-pt">
          <Link
            href="/"
            className="flex items-center gap-1 -ml-1 text-ink-variant"
            aria-label="Back to home"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              arrow_back
            </span>
          </Link>
          <span className="text-lg font-semibold tracking-tight text-ink">
            ClearPD
          </span>
          <div className="w-6" /> {/* spacer for symmetry */}
        </div>
      </header>

      <div className="mx-auto w-full max-w-md">
        {result ? (
          <>
            <VerdictCard result={result} onScanAgain={() => setResult(null)} />
            <UnknownProductPrompt result={result} />
          </>
        ) : (
          <>
            <div className="px-5 pt-6 pb-4">
              <h1
                className="text-ink font-semibold tracking-tighter leading-tight"
                style={{ fontSize: 30 }}
              >
                Is your product safe for perioral dermatitis?
              </h1>
              <p className="text-sm text-ink-variant mt-2 leading-relaxed">
                Paste any ingredient list — skincare, toothpaste, makeup.
                Instantly flag the 40+ ingredients known to trigger PD flares.
                Free, no signup.
              </p>
            </div>
            <ProductScanner onResult={setResult} />
          </>
        )}
      </div>
    </main>
  )
}
