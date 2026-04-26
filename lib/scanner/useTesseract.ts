'use client'

import { useCallback, useState } from 'react'
import Tesseract from 'tesseract.js'
import { compressForOCR } from './compress'

type Status = 'idle' | 'compressing' | 'recognizing' | 'done' | 'error'

export interface OCRSuccess {
  text: string
  confidence: number
}

export interface OCRError {
  error: string
}

export type OCRResult = OCRSuccess | OCRError

export function isOCRError(r: OCRResult): r is OCRError {
  return 'error' in r
}

/**
 * On-demand OCR — runs only when explicitly invoked. Returns a discriminated
 * union so callers can show the actual failure reason in the UI rather than
 * silently dropping null. Tesseract is too slow for continuous scan.
 */
export function useTesseract() {
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)

  const recognize = useCallback(async (file: File | Blob): Promise<OCRResult> => {
    setStatus('compressing')
    setProgress(0)

    try {
      const compressed = await compressForOCR(file)

      setStatus('recognizing')
      const { data } = await Tesseract.recognize(compressed, 'eng', {
        logger: (m) => {
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
      setStatus('error')
      return { error: message }
    }
  }, [])

  return { recognize, status, progress }
}
