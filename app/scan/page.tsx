'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

// Scanner uses browser-only APIs (camera, WASM). Never SSR it.
const ProductScanner = dynamic(
  () => import('@/components/scanner/ProductScanner').then((m) => m.ProductScanner),
  {
    ssr: false,
    loading: () => (
      <div className="px-5 py-12 text-center text-sm text-ink-variant">
        Loading scanner&hellip;
      </div>
    ),
  },
)

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-bg pb-12">
      <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-outline-variant/40">
        <div className="flex items-center justify-between px-5 py-3 safe-pt">
          <Link
            href="/"
            className="inline-flex items-center justify-center -ml-2 min-w-[44px] min-h-[44px] text-ink-variant"
            aria-label="Back to home"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              arrow_back
            </span>
          </Link>
          <span className="text-lg font-semibold tracking-tight text-ink">ClearPD</span>
          <div className="w-11" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-md">
        <div className="px-5 pt-6 pb-4">
          <h1
            className="text-ink font-semibold tracking-tighter leading-tight"
            style={{ fontSize: 30 }}
          >
            Is your product safe for perioral dermatitis?
          </h1>
          <p className="text-sm text-ink-variant mt-2 leading-relaxed">
            Paste any ingredient list — skincare, toothpaste, makeup. Instantly flag
            the 40+ ingredients known to trigger PD flares. Free, no signup.
          </p>
        </div>
        <ProductScanner />
      </div>
    </main>
  )
}
