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
    <div className="px-5 space-y-4">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-ink"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Scan reticle overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2">
            <div
              className={[
                'mx-auto rounded-2xl border-2 transition-all',
                mode === 'barcode'
                  ? 'h-32 border-white/80'
                  : 'h-56 border-white/80',
              ].join(' ')}
              style={{ borderStyle: 'dashed' }}
            />
          </div>
        </div>

        {/* Status pill (top) */}
        <div className="absolute top-4 left-4 right-4 flex justify-center">
          <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-xs font-medium">
            {status}
          </div>
        </div>

        {/* Mode toggle (bottom-left) + capture button (center) */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMode(mode === 'barcode' ? 'text' : 'barcode')}
            className="bg-black/60 backdrop-blur-md text-white rounded-full px-4 py-2 text-xs font-medium flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              {mode === 'barcode' ? 'text_fields' : 'qr_code_scanner'}
            </span>
            {mode === 'barcode' ? 'Read text instead' : 'Scan barcode'}
          </button>

          {mode === 'text' && (
            <button
              type="button"
              onClick={captureAndRead}
              disabled={tesseract.status === 'recognizing' || busy}
              className="bg-white text-ink rounded-full w-14 h-14 flex items-center justify-center disabled:opacity-50"
              aria-label="Capture and read ingredients"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                radio_button_checked
              </span>
            </button>
          )}

          {mode === 'barcode' && <div className="w-14 h-14" />}
        </div>
      </div>

      <p className="text-center text-xs text-ink-variant">
        {mode === 'barcode'
          ? 'Auto-detects when barcode is centered'
          : 'Hold steady — tap the button to read'}
      </p>
    </div>
  )
}
