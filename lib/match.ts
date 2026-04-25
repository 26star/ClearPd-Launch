import { SupabaseClient } from '@supabase/supabase-js'
import { MatchedIngredient } from './types'

/**
 * Five-step cascade match per token:
 *   1. Exact match on inci_name (case-insensitive) — confidence 1.0
 *   2. Exact match in aliases[] array            — confidence 0.95
 *   3. pg_trgm fuzzy similarity (>= 0.7)         — confidence = similarity
 *   4. pgvector cosine similarity (>= 0.85)      — confidence = cosine
 *   5. No match → log to unknown_ingredients     — returns null id
 *
 * Stops at the first hit. Embedding step disabled by default in v1
 * (39 ingredients are matched well by trigram + aliases alone).
 */

const TRIGRAM_THRESHOLD = 0.7
const EMBEDDING_THRESHOLD = 0.85

interface MatchOptions {
  /** Set true once you've populated embeddings for all ingredients */
  useEmbeddings?: boolean
  /** Provide if useEmbeddings: returns a 1536-dim vector for a string */
  generateEmbedding?: (text: string) => Promise<number[] | null>
}

export async function matchIngredients(
  supabase: SupabaseClient,
  tokens: string[],
  options: MatchOptions = {}
): Promise<MatchedIngredient[]> {
  const results: MatchedIngredient[] = []

  for (const token of tokens) {
    const matched = await matchSingleToken(supabase, token, options)
    results.push(matched)

    if (matched.method === 'unmatched') {
      // Fire-and-forget: don't block the verdict on this
      logUnknownIngredient(supabase, token).catch(err =>
        console.error('upsert unknown failed:', err)
      )
    }
  }

  return results
}

async function matchSingleToken(
  supabase: SupabaseClient,
  token: string,
  options: MatchOptions
): Promise<MatchedIngredient> {
  // ── Step 1: Exact INCI match (case-insensitive) ───────────────────
  {
    const { data } = await supabase
      .from('ingredients')
      .select('id, inci_name, display_name')
      .ilike('inci_name', token)
      .limit(1)
      .maybeSingle()

    if (data) {
      return {
        raw_token: token,
        ingredient_id: data.id,
        inci_name: data.inci_name,
        display_name: data.display_name || data.inci_name,
        confidence: 1.0,
        method: 'exact',
      }
    }
  }

  // ── Step 2: Alias match ───────────────────────────────────────────
  {
    const { data } = await supabase
      .from('ingredients')
      .select('id, inci_name, display_name')
      .contains('aliases', [token])
      .limit(1)
      .maybeSingle()

    if (data) {
      return {
        raw_token: token,
        ingredient_id: data.id,
        inci_name: data.inci_name,
        display_name: data.display_name || data.inci_name,
        confidence: 0.95,
        method: 'alias',
      }
    }
  }

  // ── Step 3: Trigram fuzzy match ───────────────────────────────────
  {
    const { data } = await supabase.rpc('match_ingredient_trigram', {
      query_text: token,
      threshold: TRIGRAM_THRESHOLD,
    })

    if (data && data.length > 0) {
      const top = data[0]
      return {
        raw_token: token,
        ingredient_id: top.id,
        inci_name: top.inci_name,
        display_name: top.display_name || top.inci_name,
        confidence: top.similarity,
        method: 'trigram',
      }
    }
  }

  // ── Step 4: Embedding cosine match (opt-in) ───────────────────────
  if (options.useEmbeddings && options.generateEmbedding) {
    const embedding = await options.generateEmbedding(token)
    if (embedding) {
      const { data } = await supabase.rpc('match_ingredient_embedding', {
        query_embedding: embedding,
        threshold: EMBEDDING_THRESHOLD,
      })

      if (data && data.length > 0) {
        const top = data[0]
        return {
          raw_token: token,
          ingredient_id: top.id,
          inci_name: top.inci_name,
          display_name: top.display_name || top.inci_name,
          confidence: top.similarity,
          method: 'embedding',
        }
      }
    }
  }

  // ── Step 5: Unmatched ─────────────────────────────────────────────
  return {
    raw_token: token,
    ingredient_id: null,
    inci_name: null,
    display_name: null,
    confidence: 0,
    method: 'unmatched',
  }
}

async function logUnknownIngredient(
  supabase: SupabaseClient,
  rawString: string
): Promise<void> {
  await supabase.rpc('upsert_unknown_ingredient', { p_raw_string: rawString })
}
