'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phase, ScanResponse } from '@/lib/scanner/types'
import { InputCard } from './InputCard'
import { CameraView } from './CameraView'

type Mode = 'input' | 'camera'

export function ProductScanner() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('input')
  // Default phase. The phase-aware materialized views still exist server-side
  // so phase-specific scoring can be reintroduced later via a different UI.
  const phase: Phase = 'any'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function postScan(endpoint: string, body: unknown, ocrConfidence?: number) {
    setBusy(true)
    setError(null)
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) throw new Error(`Server returned ${r.status}`)
      const data: ScanResponse = await r.json()
      // Surface low OCR confidence to the result page so we can warn the user.
      // Skip the param when confidence is fine — keeps URLs clean for the 95% case.
      const lowConf =
        ocrConfidence !== undefined && ocrConfidence < 70
          ? `?conf=${Math.round(ocrConfidence)}`
          : ''
      // Navigate to the result page. Don't clear `busy` — the page is unmounting.
      router.push(`/result/${data.scan_event_id}${lowConf}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
      setBusy(false)
    }
  }

  const handleBarcode = (barcode: string) => {
    setMode('input')
    return postScan('/api/scan/barcode', { barcode, phase })
  }

  const handleText = (raw_text: string, ocrConfidence?: number) => {
    setMode('input')
    return postScan('/api/scan/ocr', { raw_text, phase }, ocrConfidence)
  }

  const handlePaste = (raw_text: string) =>
    postScan('/api/scan/paste', { raw_text, phase })

  return (
    <div className="space-y-3 pb-8">
      {mode === 'input' && (
        <InputCard
          onPaste={handlePaste}
          onBarcode={handleBarcode}
          onText={handleText}
          onScanCamera={() => setMode('camera')}
          busy={busy}
        />
      )}

      {mode === 'camera' && (
        <div className="space-y-3">
          <div className="px-5">
            <button
              type="button"
              onClick={() => setMode('input')}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-variant hover:text-ink transition"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
                arrow_back
              </span>
              Back
            </button>
          </div>
          <CameraView onBarcode={handleBarcode} onText={handleText} busy={busy} />
        </div>
      )}

      {error && (
        <div className="mx-5 rounded-2xl bg-tertiary/10 border border-tertiary/20 px-4 py-3 text-sm text-tertiary">
          {error}
        </div>
      )}
    </div>
  )
}
