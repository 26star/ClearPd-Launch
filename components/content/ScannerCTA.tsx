import Link from 'next/link'

export function ScannerCTA({ label }: { label?: string }) {
  return (
    <div className="border-t border-outline-variant/40 pt-8">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-variant">
        Ingredient Checker
      </div>
      <h2
        className="mt-3 text-ink font-semibold tracking-tight"
        style={{ fontSize: 22 }}
      >
        Scan your own product in seconds
      </h2>
      <p className="mt-3 text-[14px] text-ink-variant leading-relaxed max-w-md">
        Paste any ingredient list, upload a photo of a label, or scan a
        barcode. Free, no signup. Instantly flag the 40+ ingredients known to
        trigger PD flares.
      </p>
      <Link
        href="/#checker"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-on px-5 min-h-[44px] text-sm font-medium hover:opacity-90 transition"
      >
        {label ?? 'Open the checker'}
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18 }}
          aria-hidden
        >
          arrow_forward
        </span>
      </Link>
    </div>
  )
}
