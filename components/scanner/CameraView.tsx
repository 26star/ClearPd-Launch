'use client'

import { useRef, useState } from 'react'
import { useBarcode } from '@/lib/scanner/useBarcode'
import { useTesseract } from '@/lib/scanner/useTesseract'

interface CameraViewProps {
  onBarcode: (barcode: string) => void
  onText: (rawText: string) => void
  busy: boolean
}

export function CameraView({ onBarcode, onText, busy }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<'barcode' | 'text'>('barcode')

  const barcode = useBarcode({
    videoRef,
    enabled: mode === 'barcode' && !busy,
    onDetected: onBarcode,
  })

  const tesseract = useTesseract()

  const captureAndRead = async () => {
    if (!videoRef.current) return
    const video = videoRef.current

    // Capture current frame to a canvas
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)

    canvas.toBlob(
      async blob => {
        if (!blob) return
        const result = await tesseract.recognize(blob)
        if (result && result.text.trim().length > 5) {
          onText(result.text)
        }
      },
      'image/jpeg',
      0.92
    )
  }

  const status = (() => {
    if (barcode.status === 'permission') return 'Requesting camera…'
    if (barcode.status === 'error') return barcode.error || 'Camera error'
    if (mode === 'text') {
      if (tesseract.status === 'compressing') return 'Optimizing image…'
      if (tesseract.status === 'recognizing')
        return `Reading text… ${Math.round(tesseract.progress * 100)}%`
      return 'Frame the ingredient list, then capture'
    }
    return 'Point at a barcode to scan'
  })()

  return (
    <div className="px-5 space-y-3">
      <div
        className="relative aspect-[2/1] w-full overflow-hidden rounded-3xl bg-surface-container ring-1 ring-outline-variant/30"
      >
        {/* Soft empty state — visible until the video stream paints over it */}
        <div className="absolute inset-0 flex items-center justify-center text-ink-variant pointer-events-none">
          <span
            className="material-symbols-outlined opacity-50"
            style={{ fontSize: 32 }}
            aria-hidden
          >
            photo_camera
          </span>
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Scan reticle overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center px-6">
          <div
            className={[
              'w-full rounded-xl border-2 transition-all',
              mode === 'barcode' ? 'h-16 border-white/80' : 'h-24 border-white/80',
            ].join(' ')}
            style={{ borderStyle: 'dashed' }}
          />
        </div>
      </div>

      {/* Status line + mode toggle (between frame and capture) */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-ink-variant truncate">{status}</p>
        <button
          type="button"
          onClick={() => setMode(mode === 'barcode' ? 'text' : 'barcode')}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-surface-lowest px-3 py-1.5 text-[12px] font-medium text-ink ring-1 ring-outline-variant/40 shadow-card hover:bg-surface-low transition"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>
            {mode === 'barcode' ? 'text_fields' : 'qr_code_scanner'}
          </span>
          {mode === 'barcode' ? 'Read text' : 'Scan barcode'}
        </button>
      </div>

      {/* Capture button — only in text/OCR mode */}
      {mode === 'text' && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={captureAndRead}
            disabled={tesseract.status === 'recognizing' || busy}
            className="bg-surface-lowest text-ink rounded-full w-14 h-14 flex items-center justify-center disabled:opacity-50 shadow-card ring-1 ring-outline-variant/40 hover:bg-surface-low transition"
            aria-label="Capture and read ingredients"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
              radio_button_checked
            </span>
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-outline">
        {mode === 'barcode'
          ? 'Auto-detects when barcode is centered'
          : 'Hold steady — tap the button to read'}
      </p>
    </div>
  )
}
