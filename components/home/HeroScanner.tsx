'use client'

import { useRef, useState } from 'react'
import { Phase, ScanResponse } from '@/lib/scanner/types'
import { useTesseract } from '@/lib/scanner/useTesseract'
import { VerdictCard } from '@/components/verdict/VerdictCard'
import { UnknownProductPrompt } from '@/components/flywheel/UnknownProductPrompt'

type Mode = 'analyze' | 'scan'

/**
 * Hero-section search/scan card.
 *
 * Mirrors the existing ProductScanner endpoints (/api/scan/paste, /api/scan/ocr)
 * but in a single editorial pill-card UI: text input + circular send button on
 * top, two mode pills (Scan Image / Analyze Safety) below.
 *
 * Phase defaults to 'any' — phase toggling lives on the dedicated /scan page.
 */
export function HeroScanner() {
  const [mode, setMode] = useState<Mode>('analyze')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResponse | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { recognize, status: ocrStatus, progress: ocrProgress } = useTesseract()
  const phase: Phase = 'any'

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
      setResult(await r.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setBusy(false)
    }
  }

  function submitText() {
    const trimmed = text.trim()
    if (trimmed.length < 5 || busy) return
    void postScan('/api/scan/paste', { raw_text: trimmed, phase })
  }

  async function handleFile(file: File) {
    setMode('scan')
    setError(null)
    const ocr = await recognize(file)
    if (!ocr || !ocr.text.trim()) {
      setError('Couldn\u2019t read text from that image. Try a clearer photo.')
      return
    }
    void postScan('/api/scan/ocr', { raw_text: ocr.text, phase })
  }

  // ── Result state ────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="rounded-3xl bg-surface-lowest border border-outline-variant/40 shadow-card overflow-hidden">
        <VerdictCard
          result={result}
          onScanAgain={() => {
            setResult(null)
            setText('')
            setMode('analyze')
          }}
        />
        <UnknownProductPrompt result={result} />
      </div>
    )
  }

  // ── Idle / busy state ──────────────────────────────────────────────────
  const ready = text.trim().length >= 5
  const ocrLabel =
    ocrStatus === 'compressing'
      ? 'Compressing image\u2026'
      : ocrStatus === 'recognizing'
      ? `Reading text\u2026 ${Math.round(ocrProgress * 100)}%`
      : null

  return (
    <div className="rounded-[28px] bg-surface-lowest border border-outline-variant/40 shadow-elevated p-3 sm:p-4">
      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitText()
          }}
          placeholder="Paste ingredients or search for a product…"
          className="flex-1 bg-transparent border-0 outline-none px-4 py-3 text-[15px] text-ink placeholder:text-outline"
          disabled={busy}
          aria-label="Ingredients or product"
        />
        <button
          type="button"
          onClick={submitText}
          disabled={!ready || busy}
          aria-label="Analyze"
          className="shrink-0 w-11 h-11 rounded-full bg-primary text-primary-on flex items-center justify-center disabled:opacity-30 enabled:hover:opacity-90 transition"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 20 }}
            aria-hidden
          >
            arrow_forward
          </span>
        </button>
      </div>

      {/* Mode pills */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
          className={`rounded-2xl py-3 text-[11px] uppercase tracking-[0.18em] font-medium border transition flex items-center justify-center gap-2 disabled:opacity-50 ${
            mode === 'scan'
              ? 'bg-secondary-tint border-secondary/30 text-secondary'
              : 'bg-surface-lowest border-outline-variant/60 text-ink-variant hover:border-secondary/40'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18 }}
            aria-hidden
          >
            photo_camera
          </span>
          Scan Image
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void handleFile(f)
            e.target.value = ''
          }}
        />

        <button
          type="button"
          onClick={() => setMode('analyze')}
          disabled={busy}
          className={`rounded-2xl py-3 text-[11px] uppercase tracking-[0.18em] font-medium border transition flex items-center justify-center gap-2 disabled:opacity-50 ${
            mode === 'analyze'
              ? 'bg-secondary-tint border-secondary/30 text-secondary'
              : 'bg-surface-lowest border-outline-variant/60 text-ink-variant hover:border-secondary/40'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18 }}
            aria-hidden
          >
            verified_user
          </span>
          Analyze Safety
        </button>
      </div>

      {/* Status row */}
      {(busy || ocrLabel || error) && (
        <div className="mt-3 px-2 text-center text-[13px] min-h-[20px]">
          {error ? (
            <span className="text-tertiary">{error}</span>
          ) : ocrLabel ? (
            <span className="text-ink-variant">{ocrLabel}</span>
          ) : busy ? (
            <span className="text-ink-variant">Analyzing&hellip;</span>
          ) : null}
        </div>
      )}
    </div>
  )
}
