'use client'

import { useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { DecodeHintType, BarcodeFormat } from '@zxing/library'
import { isOCRError, useTesseract } from '@/lib/scanner/useTesseract'

interface InputCardProps {
  onPaste: (rawText: string) => void
  onBarcode: (barcode: string) => void
  onText: (rawText: string, ocrConfidence?: number) => void
  onScanCamera: () => void
  busy: boolean
}

// Restrict upload barcode decoding to retail formats — same as the live
// camera path. Prevents QR codes printed on packaging from being falsely
// decoded as a "barcode" and sent downstream.
const UPLOAD_HINTS = new Map<DecodeHintType, BarcodeFormat[]>()
UPLOAD_HINTS.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
])

export function InputCard({ onPaste, onBarcode, onText, onScanCamera, busy }: InputCardProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'barcode' | 'ocr'>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const tesseract = useTesseract()

  const ready = text.trim().length >= 5
  const uploading = uploadPhase !== 'idle'
  const disabled = busy || uploading

  const handleFile = async (file: File) => {
    setUploadError(null)

    // File-type guard. accept="image/*" is only a browser hint; users can
    // bypass it on most OSes. Empty file.type is allowed (some browsers
    // leave it blank for HEIC etc.) — we only reject when the type is
    // present AND clearly non-image.
    if (file.type && !file.type.startsWith('image/')) {
      setUploadError('Please choose an image file (JPG, PNG, HEIC).')
      return
    }

    setUploadPhase('barcode')
    try {
      const reader = new BrowserMultiFormatReader(UPLOAD_HINTS)
      const url = URL.createObjectURL(file)
      const result = await reader.decodeFromImageUrl(url).catch(() => null)
      URL.revokeObjectURL(url)
      if (result) {
        onBarcode(result.getText())
        setUploadPhase('idle')
        return
      }
    } catch {
      // fall through to OCR
    }

    setUploadPhase('ocr')
    const ocr = await tesseract.recognize(file)
    setUploadPhase('idle')

    if (isOCRError(ocr)) {
      setUploadError(`Couldn't read this image: ${ocr.error}`)
      return
    }
    if (ocr.text.trim().length <= 5) {
      setUploadError(
        "Couldn't read text from this image — try a clearer, well-lit photo of just the ingredient list, or paste the ingredients manually.",
      )
      return
    }
    onText(ocr.text, ocr.confidence)
  }

  const uploadLabel =
    uploadPhase === 'barcode'
      ? 'Reading…'
      : uploadPhase === 'ocr'
      ? `Reading… ${Math.round(tesseract.progress * 100)}%`
      : 'Upload'

  return (
    <div className="px-5">
      <div className="rounded-3xl bg-surface-lowest ring-1 ring-outline-variant/40 shadow-card px-5 pt-5 pb-3 focus-within:ring-secondary/50 transition">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            // Reset value so picking the same file twice in a row still fires onChange
            e.target.value = ''
          }}
        />

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste ingredients or search a product"
          rows={2}
          className="w-full resize-none bg-transparent border-0 outline-none text-[16px] sm:text-[17px] tracking-[-0.01em] text-ink placeholder:text-outline-variant placeholder:font-light caret-secondary leading-relaxed"
        />

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 min-h-[44px] text-[13px] font-medium text-ink ring-1 ring-outline-variant/50 hover:bg-surface-low disabled:opacity-50 transition"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
              image
            </span>
            {uploadLabel}
          </button>

          <button
            type="button"
            onClick={onScanCamera}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 min-h-[44px] text-[13px] font-medium text-ink ring-1 ring-outline-variant/50 hover:bg-surface-low disabled:opacity-50 transition"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
              qr_code_scanner
            </span>
            Scan barcode
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => onPaste(text)}
            disabled={!ready || disabled}
            className={[
              'inline-flex items-center gap-1.5 rounded-full px-4 min-h-[44px] text-[13px] font-medium transition',
              ready && !disabled
                ? 'bg-primary text-primary-on hover:opacity-90'
                : 'bg-surface-container text-outline cursor-not-allowed',
            ].join(' ')}
          >
            {busy ? 'Analyzing…' : 'Analyze'}
            {!busy && (
              <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>
                arrow_forward
              </span>
            )}
          </button>
        </div>
      </div>

      {uploadError && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-2xl bg-tertiary/10 border border-tertiary/20 px-4 py-3 text-[13px] text-tertiary"
        >
          <span className="material-symbols-outlined shrink-0 mt-0.5" style={{ fontSize: 16 }} aria-hidden>
            error
          </span>
          <span className="leading-snug">{uploadError}</span>
        </div>
      )}
    </div>
  )
}
