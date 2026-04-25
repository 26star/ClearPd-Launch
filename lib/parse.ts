/**
 * Parse raw OCR or pasted text into clean ingredient tokens.
 * Handles multilingual labels (English, French INCI conventions).
 *
 * Inputs we expect:
 *   "INGREDIENTS: Aqua, Glycerin, Niacinamide, Parfum."
 *   "Ingrédients: Aqua/Water, Glycérine, Sodium Laureth Sulfate (SLES)*"
 *   "aqua • glycerin • cetearyl alcohol • phenoxyethanol"
 *
 * Output:
 *   ["aqua", "glycerin", "niacinamide", "parfum"]
 */

const LEADING_LABEL_PATTERN = /^[^:]*?(ingr[eé]dients?|composition|contains?)\s*:?\s*/i

const NOISE_PATTERNS: RegExp[] = [
  /^ingr[eé]dients?:?$/i,
  /^composition:?$/i,
  /^contains?:?$/i,
  /^may contain:?$/i,
  /^[+\d\s\-]+$/,        // numeric noise
  /^\W+$/,               // pure punctuation
]

const STRIP_PATTERNS: RegExp[] = [
  /\([^)]*\)/g,          // remove parentheticals
  /\[[^\]]*\]/g,          // remove brackets
  /\*+/g,                 // organic/treated markers
  /\+\/-/g,               // optional ingredient marker
  /\bci\s*\d{5}\b/gi,    // colour index codes (CI 77891 etc.)
]

const SEPARATOR = /[,;.•·\n\r\u2022]+/

export function parseIngredientText(rawText: string | null | undefined): string[] {
  if (!rawText || rawText.trim().length === 0) return []

  let text = rawText

  // Strip leading "Ingredients:" prefix
  text = text.replace(LEADING_LABEL_PATTERN, '')

  // Remove parentheticals and noise markers
  for (const pattern of STRIP_PATTERNS) {
    text = text.replace(pattern, ' ')
  }

  // Split on separators, normalize each token
  const tokens = text
    .split(SEPARATOR)
    .map(normalizeToken)
    .filter(t => t.length > 1)
    .filter(t => !NOISE_PATTERNS.some(p => p.test(t)))

  // Dedupe preserving order
  const seen = new Set<string>()
  const result: string[] = []
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t)
      result.push(t)
    }
  }

  return result
}

function normalizeToken(token: string): string {
  return token
    .trim()
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-')   // unicode dashes → hyphen
    .replace(/\//g, ' ')                // "aqua/water" → two tokens later
    .replace(/\s+/g, ' ')               // collapse whitespace
    .replace(/[^\w\s\-]/g, '')          // strip non-alphanumeric except hyphen
    .trim()
}
