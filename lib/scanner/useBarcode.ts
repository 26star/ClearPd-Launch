'use client'

import { useEffect, useRef, useState } from 'react'
import {
  BrowserMultiFormatReader,
  IScannerControls,
} from '@zxing/browser'
import { DecodeHintType, BarcodeFormat } from '@zxing/library'

type Status = 'idle' | 'permission' | 'scanning' | 'found' | 'error'

interface UseBarcodeOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>
  enabled: boolean
  onDetected: (barcode: string) => void
}

/**
 * Continuously scans the video stream for retail barcodes.
 * Stops on first successful decode and calls onDetected.
 */
export function useBarcode({ videoRef, enabled, onDetected }: UseBarcodeOptions) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const detectedRef = useRef(false)

  useEffect(() => {
    if (!enabled || !videoRef.current) return

    detectedRef.current = false
    setStatus('permission')

    // Restrict to retail formats — faster + fewer false positives
    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
    ])

    const reader = new BrowserMultiFormatReader(hints)
    let cancelled = false

    reader
      .decodeFromVideoDevice(undefined, videoRef.current, (result, _err, controls) => {
        if (cancelled) {
          controls.stop()
          return
        }
        controlsRef.current = controls
        setStatus('scanning')

        if (result && !detectedRef.current) {
          detectedRef.current = true
          const text = result.getText()
          controls.stop()
          setStatus('found')
          onDetected(text)
        }
      })
      .catch(err => {
        if (cancelled) return
        const message =
          err?.name === 'NotAllowedError'
            ? 'Camera permission denied'
            : err?.name === 'NotFoundError'
            ? 'No camera available'
            : err?.message || 'Camera error'
        setError(message)
        setStatus('error')
      })

    return () => {
      cancelled = true
      controlsRef.current?.stop()
      controlsRef.current = null
    }
  }, [enabled, videoRef, onDetected])

  return { status, error }
}
