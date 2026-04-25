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
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-surface-container">
          <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
          {status && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-surface-lowest rounded-2xl px-5 py-3 text-sm font-medium">
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
          className="aspect-[3/4] w-full rounded-3xl border-2 border-dashed border-outline-variant bg-surface-low flex flex-col items-center justify-center gap-3 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-ink-variant" style={{ fontSize: 48 }}>
            add_photo_alternate
          </span>
          <span className="text-sm font-medium text-ink">Upload a photo</span>
          <span className="text-xs text-ink-variant max-w-[220px] text-center">
            Barcode or ingredient label — we&rsquo;ll try both
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
          className="w-full text-center text-sm text-secondary font-medium"
        >
          Choose a different photo
        </button>
      )}
    </div>
  )
}
