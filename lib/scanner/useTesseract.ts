'use client'

import { useCallback, useState } from 'react'
import Tesseract from 'tesseract.js'
import { compressForOCR } from './compress'

type Status = 'idle' | 'compressing' | 'recognizing' | 'done' | 'error'

interface OCRResult {
  text: string
  confidence: number
}

/**
 * On-demand OCR — runs only when explicitly invoked.
 * Tesseract is too slow for continuous scan, so we expose a `recognize(file)`
 * function the UI calls when user taps "Read text".
 */
export function useTesseract() {
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recognize = useCallback(async (file: File | Blob): Promise<OCRResult | null> => {
    setStatus('compressing')
    setProgress(0)
    setError(null)

    try {
      const compressed = await compressForOCR(file)

      setStatus('recognizing')
      const { data } = await Tesseract.recognize(compressed, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(m.progress)
          }
        },
      })

      setStatus('done')
      return {
        text: data.text || '',
        confidence: data.confidence || 0,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OCR failed'
      setError(message)
      setStatus('error')
      return null
    }
  }, [])

  return { recognize, status, progress, error }
}
