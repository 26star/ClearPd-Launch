'use client'

import { useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { useTesseract } from '@/lib/scanner/useTesseract'

interface UploadViewProps {
  onBarcode: (barcode: string) => void
  onText: (rawText: string) => void
  busy: boolean
}

export function UploadView({ onBarcode, onText, busy }: UploadViewProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'barcode' | 'ocr'>('idle')
  const tesseract = useTesseract()

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file))

    // Try barcode first (fast, deterministic)
    setPhase('barcode')
    try {
      const reader = new BrowserMultiFormatReader()
      const url = URL.createObjectURL(file)
      const result = await reader.decodeFromImageUrl(url).catch(() => null)
      URL.revokeObjectURL(url)

      if (result) {
        onBarcode(result.getText())
        return
      }
    } catch {
      // No barcode — fall through to OCR
    }

    // Fall back to OCR
    setPhase('ocr')
    const ocrResult = await tesseract.recognize(file)
    if (ocrResult && ocrResult.text.trim().length > 5) {
      onText(ocrResult.text)
    }
  }

  const status = (() => {
    if (phase === 'barcode') return 'Looking for barcode…'
    if (phase === 'ocr') {
      if (tesseract.status === 'compressing') return 'Optimizing image…'
      if (tesseract.status === 'recognizing')
        return `Reading text… ${Math.round(tesseract.progress * 100)}%`
      if (tesseract.status === 'error') return tesseract.error || 'OCR failed'
    }
    return null
  })()

  return (
    <div className="px-5 space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />

      {preview ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-surface-container ring-1 ring-outline-variant/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Uploaded label preview" className="absolute inset-0 w-full h-full object-cover" />
          {status && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/40 backdrop-blur-sm">
              <div className="bg-surface-lowest rounded-full px-5 py-2.5 text-[13px] font-medium text-ink shadow-card">
                {status}
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="group aspect-[3/4] w-full rounded-3xl border border-dashed border-outline-variant bg-surface-low flex flex-col items-center justify-center gap-3 disabled:opacity-50 hover:bg-surface-container/60 hover:border-secondary/40 transition"
        >
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface-lowest ring-1 ring-outline-variant/40 text-ink-variant group-hover:text-secondary transition"
            aria-hidden
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
              add_photo_alternate
            </span>
          </span>
          <span className="text-[15px] font-medium text-ink">Upload a photo</span>
          <span className="text-[12px] text-ink-variant max-w-[240px] text-center">
            Barcode or ingredient label &mdash; we&rsquo;ll try both
          </span>
        </button>
      )}

      {preview && (
        <button
          type="button"
          onClick={() => {
            setPreview(null)
            setPhase('idle')
            if (inputRef.current) inputRef.current.value = ''
          }}
          className="w-full text-center text-[13px] text-secondary font-medium hover:underline"
        >
          Choose a different photo
        </button>
      )}
    </div>
  )
}
