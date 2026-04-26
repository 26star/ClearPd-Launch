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

// English stopwords that frequently appear in prose but never inside an
// INCI ingredient name. Used to reject prose-shaped tokens produced when
// users OCR a marketing screenshot or paste the wrong block of text.
const PROSE_STOPWORDS = new Set([
  // Articles, prepositions, conjunctions
  'the', 'a', 'an', 'and', 'or', 'but', 'so', 'as', 'if', 'in', 'on', 'at',
  'by', 'of', 'to', 'for', 'with', 'from', 'about', 'after', 'before',
  'because', 'while', 'until', 'unless', 'than', 'then', 'though', 'just',
  // Pronouns
  'we', 'i', 'you', 'they', 'them', 'us', 'our', 'your', 'their', 'his',
  'her', 'its', 'this', 'that', 'these', 'those', 'who', 'what', 'which',
  'when', 'where', 'why', 'how',
  // Common verbs (any tense)
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing',
  'go', 'goes', 'going', 'went', 'come', 'comes', 'came',
  'make', 'makes', 'made', 'making', 'take', 'takes', 'took', 'taken',
  'would', 'could', 'should', 'might', 'must', 'can', 'will', 'shall',
  'built', 'started', 'tried', 'trying', 'figuring', 'flagged',
  // Negations and informal contractions (apostrophes are stripped in normalize)
  'not', 'no', 'wasnt', 'isnt', 'didnt', 'doesnt', 'cant', 'wont', 'havent',
  'wouldnt', 'shouldnt', 'couldnt', 'aint',
  // Discourse / quantifiers / intensifiers
  'every', 'some', 'any', 'all', 'still', 'yet', 'also', 'too', 'very',
  'really', 'quite', 'much', 'many', 'most', 'few', 'only', 'each',
])

function isLikelyIngredient(token: string): boolean {
  // Length sanity — real INCI names are short.
  if (token.length < 2 || token.length > 60) return false

  const words = token.split(/\s+/)

  // Real INCI tokens are 1-5 words. Longer = almost certainly prose.
  if (words.length > 5) return false

  // Reject if any word is a clear English stopword — INCI vocabulary
  // doesn't contain "the", "and", "for", etc. Their presence signals prose.
  for (const w of words) {
    if (PROSE_STOPWORDS.has(w)) return false
  }

  return true
}

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
    .filter(isLikelyIngredient)

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
