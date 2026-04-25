/**
 * Mirrors the backend lib/types.ts ScanResponse shape.
 * Kept separate so the frontend can ship without importing server-only code.
 */

export type Phase = 'active' | 'maintenance' | 'any'

export type VerdictTier =
  | 'helpful'
  | 'safe'
  | 'caution'
  | 'avoid'
  | 'insufficient_data'

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'insufficient'
export type MatchMethod = 'exact' | 'alias' | 'trigram' | 'embedding' | 'unmatched'
export type ProductSource = 'curated' | 'obf' | 'user_ocr' | 'unknown'

export interface MatchedIngredient {
  raw_token: string
  ingredient_id: string | null
  inci_name: string | null
  display_name: string | null
  confidence: number
  method: MatchMethod
}

export interface IngredientVerdict {
  ingredient_id: string
  inci_name: string
  display_name: string
  tier: VerdictTier
  confidence: ConfidenceLevel
  trigger_rate: number
  helpful_rate: number
  observations_count: number
  why: string
}

export interface ProductVerdict {
  tier: VerdictTier
  confidence: ConfidenceLevel
  source: 'direct' | 'ingredient_derived' | 'mixed'
  flagged_ingredients: IngredientVerdict[]
  helpful_ingredients: IngredientVerdict[]
  coverage: { matched: number; total: number; percentage: number }
  why: string
}

export interface ScanResponse {
  product: {
    id: string | null
    name: string | null
    brand: string | null
    barcode: string | null
    image_url: string | null
    source: ProductSource
  }
  verdict: ProductVerdict
  ingredients: MatchedIngredient[]
  unknown_count: number
  scan_event_id: string
}
