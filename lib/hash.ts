import crypto from 'crypto'

/**
 * Stable hash for scan inputs (barcode strings, OCR text, paste text).
 * Used to dedupe scan_events analytics and enable future result caching.
 */
export function hashInput(input: string): string {
  return crypto
    .createHash('sha256')
    .update(input.trim().toLowerCase())
    .digest('hex')
    .slice(0, 32)
}
