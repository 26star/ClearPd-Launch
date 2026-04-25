'use client'

import { useState } from 'react'
import { Phase, ScanResponse } from '@/lib/scanner/types'
import { InputCard } from './InputCard'
import { CameraView } from './CameraView'

interface ProductScannerProps {
  onResult: (result: ScanResponse) => void
}

type Mode = 'input' | 'camera'

export function ProductScanner({ onResult }: ProductScannerProps) {
  const [mode, setMode] = useState<Mode>('input')
  const phase: Phase = 'any'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function postScan(endpoint: string, body: unknown) {
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
      onResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
    } finally {
      setBusy(false)
    }
  }

  const handleBarcode = (barcode: string) => {
    setMode('input')
    return postScan('/api/scan/barcode', { barcode, phase })
  }

  const handleText = (raw_text: string) => {
    setMode('input')
    return postScan('/api/scan/ocr', { raw_text, phase })
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
