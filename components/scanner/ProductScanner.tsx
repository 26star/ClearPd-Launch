'use client'

import { useState } from 'react'
import { Phase, ScanResponse } from '@/lib/scanner/types'
import { PhaseToggle } from './PhaseToggle'
import { ModeTabs, ScanMode } from './ModeTabs'
import { CameraView } from './CameraView'
import { UploadView } from './UploadView'
import { PasteView } from './PasteView'

interface ProductScannerProps {
  onResult: (result: ScanResponse) => void
}

export function ProductScanner({ onResult }: ProductScannerProps) {
  const [mode, setMode] = useState<ScanMode>('camera')
  const [phase, setPhase] = useState<Phase>('any')
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

  const handleBarcode = (barcode: string) =>
    postScan('/api/scan/barcode', { barcode, phase })

  const handleText = (raw_text: string) =>
    postScan('/api/scan/ocr', { raw_text, phase })

  const handlePaste = (raw_text: string) =>
    postScan('/api/scan/paste', { raw_text, phase })

  return (
    <div className="space-y-5 pb-8">
      <PhaseToggle value={phase} onChange={setPhase} />
      <ModeTabs value={mode} onChange={setMode} />

      {mode === 'camera' && (
        <CameraView onBarcode={handleBarcode} onText={handleText} busy={busy} />
      )}
      {mode === 'upload' && (
        <UploadView onBarcode={handleBarcode} onText={handleText} busy={busy} />
      )}
      {mode === 'paste' && <PasteView onText={handlePaste} busy={busy} />}

      {error && (
        <div className="mx-5 rounded-2xl bg-tertiary/10 border border-tertiary/20 px-4 py-3 text-sm text-tertiary">
          {error}
        </div>
      )}
    </div>
  )
}
