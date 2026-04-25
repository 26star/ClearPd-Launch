import { SupabaseClient } from '@supabase/supabase-js'
import {
  IngredientVerdict,
  ProductVerdict,
  VerdictTier,
  ConfidenceLevel,
  Phase,
  MatchedIngredient,
} from './types'

/**
 * Verdict thresholds. Tune these as observation count grows.
 *
 * Tier ladder (4-tier per spec):
 *   helpful   — clear positive signal
 *   safe      — no concerning signal
 *   caution   — mixed reports, patch test recommended
 *   avoid     — strong negative consensus
 */

const MIN_OBS_FOR_VERDICT = 5
const MIN_OBS_FOR_PRODUCT_DIRECT = 3

const TRIGGER_RATE_AVOID = 0.5
const TRIGGER_RATE_CAUTION = 0.25
const HELPFUL_RATE_HELPFUL = 0.5

function confidenceLevel(obsCount: number): ConfidenceLevel {
  if (obsCount < 5) return 'insufficient'
  if (obsCount < 15) return 'low'
  if (obsCount < 50) return 'medium'
  return 'high'
}

// ──────────────────────────────────────────────────────────────────
// INGREDIENT VERDICT
// ──────────────────────────────────────────────────────────────────

export async function ingredientVerdict(
  supabase: SupabaseClient,
  ingredient_id: string,
  phase: Phase
): Promise<IngredientVerdict | null> {
  const [ingResult, consensusResult] = await Promise.all([
    supabase
      .from('ingredients')
      .select('id, inci_name, display_name')
      .eq('id', ingredient_id)
      .maybeSingle(),
    supabase
      .from('ingredient_consensus')
      .select('*')
      .eq('ingredient_id', ingredient_id)
      .eq('phase', phase)
      .maybeSingle(),
  ])

  if (!ingResult.data) return null
  const ing = ingResult.data
  const c = consensusResult.data

  if (!c || c.total_count < MIN_OBS_FOR_VERDICT) {
    return {
      ingredient_id: ing.id,
      inci_name: ing.inci_name,
      display_name: ing.display_name || ing.inci_name,
      tier: 'insufficient_data',
      confidence: 'insufficient',
      trigger_rate: 0,
      helpful_rate: 0,
      observations_count: c?.total_count ?? 0,
      why: `Only ${c?.total_count ?? 0} observation${(c?.total_count ?? 0) === 1 ? '' : 's'} recorded${
        phase !== 'any' ? ` for ${phase} phase` : ''
      }. Need ${MIN_OBS_FOR_VERDICT}+ for confident verdict.`,
    }
  }

  const trigger_rate = c.trigger_count / c.total_count
  const helpful_rate = c.helpful_count / c.total_count

  let tier: VerdictTier
  let why: string

  if (trigger_rate >= TRIGGER_RATE_AVOID && trigger_rate > helpful_rate) {
    tier = 'avoid'
    why = `${c.trigger_count} of ${c.total_count} community observations report this as a trigger.`
  } else if (trigger_rate >= TRIGGER_RATE_CAUTION) {
    tier = 'caution'
    why = `Mixed signal: ${c.trigger_count} triggered, ${c.helpful_count} found helpful. Patch test recommended.`
  } else if (helpful_rate >= HELPFUL_RATE_HELPFUL) {
    tier = 'helpful'
    why = `${c.helpful_count} of ${c.total_count} community observations report this as helpful.`
  } else {
    tier = 'safe'
    why = `${c.total_count} observation${c.total_count === 1 ? '' : 's'} recorded with no significant negative pattern.`
  }

  return {
    ingredient_id: ing.id,
    inci_name: ing.inci_name,
    display_name: ing.display_name || ing.inci_name,
    tier,
    confidence: confidenceLevel(c.total_count),
    trigger_rate,
    helpful_rate,
    observations_count: c.total_count,
    why,
  }
}

// ──────────────────────────────────────────────────────────────────
// PRODUCT VERDICT
// ──────────────────────────────────────────────────────────────────

interface ProductVerdictInput {
  product_id: string | null
  matched_ingredients: MatchedIngredient[]
  phase: Phase
}

export async function productVerdict(
  supabase: SupabaseClient,
  input: ProductVerdictInput
): Promise<ProductVerdict> {
  const { product_id, matched_ingredients, phase } = input

  const validIngredientIds = matched_ingredients
    .filter(m => m.ingredient_id !== null)
    .map(m => m.ingredient_id!) as string[]

  // Get verdicts for all matched ingredients (parallel)
  const ingredientVerdicts = (
    await Promise.all(
      validIngredientIds.map(id => ingredientVerdict(supabase, id, phase))
    )
  ).filter((v): v is IngredientVerdict => v !== null)

  const flagged = ingredientVerdicts.filter(
    v => v.tier === 'avoid' || v.tier === 'caution'
  )
  const helpful = ingredientVerdicts.filter(v => v.tier === 'helpful')

  const coverage = {
    matched: validIngredientIds.length,
    total: matched_ingredients.length,
    percentage:
      matched_ingredients.length > 0
        ? validIngredientIds.length / matched_ingredients.length
        : 0,
  }

  // ── Path A: Direct product match ────────────────────────────────
  let directVerdict: { tier: VerdictTier; confidence: ConfidenceLevel; why: string } | null = null

  if (product_id) {
    const { data: c } = await supabase
      .from('product_consensus')
      .select('*')
      .eq('product_id', product_id)
      .eq('phase', phase)
      .maybeSingle()

    if (c && c.total_count >= MIN_OBS_FOR_PRODUCT_DIRECT) {
      const negRate = c.negative_count / c.total_count
      const posRate = c.positive_count / c.total_count
      const goodRate = c.good_outcome_count / c.total_count

      let tier: VerdictTier
      let why: string

      if (negRate >= 0.5 || c.worsened_count > c.good_outcome_count) {
        tier = 'avoid'
        why = `Direct community evidence: ${c.negative_count} of ${c.total_count} reports were negative.`
      } else if (negRate >= 0.25) {
        tier = 'caution'
        why = `Mixed direct evidence: ${c.positive_count} positive, ${c.negative_count} negative reports.`
      } else if (goodRate >= 0.5 && posRate >= 0.5) {
        tier = 'helpful'
        why = `Strong direct evidence: ${c.good_outcome_count} of ${c.total_count} reported improvement or clearance.`
      } else {
        tier = 'safe'
        why = `${c.total_count} direct reports, no significant negative pattern.`
      }

      directVerdict = { tier, confidence: confidenceLevel(c.total_count), why }
    }
  }

  // ── Path B: Ingredient-derived ──────────────────────────────────
  const hasAvoid = flagged.some(
    v => v.tier === 'avoid' && v.confidence !== 'insufficient'
  )
  const cautionCount = flagged.filter(v => v.tier === 'caution').length
  const allClean =
    ingredientVerdicts.length > 0 &&
    ingredientVerdicts.every(v => v.tier === 'helpful' || v.tier === 'safe')
  const hasMultipleHelpful = helpful.length >= 2

  let derivedTier: VerdictTier
  let derivedWhy: string

  if (hasAvoid) {
    const avoids = flagged.filter(v => v.tier === 'avoid')
    derivedTier = 'avoid'
    derivedWhy = `Contains ${avoids.length} ingredient${avoids.length > 1 ? 's' : ''} flagged as PD trigger${
      avoids.length > 1 ? 's' : ''
    }: ${avoids.map(v => v.display_name).join(', ')}.`
  } else if (cautionCount >= 2) {
    derivedTier = 'caution'
    derivedWhy = `Contains ${cautionCount} ingredients with mixed PD reports.`
  } else if (cautionCount === 1) {
    derivedTier = 'caution'
    derivedWhy = `${flagged[0].display_name} has mixed PD reports — patch test recommended.`
  } else if (allClean && hasMultipleHelpful) {
    derivedTier = 'helpful'
    derivedWhy = `Contains ${helpful.length} ingredients with positive PD evidence.`
  } else if (validIngredientIds.length === 0) {
    derivedTier = 'insufficient_data'
    derivedWhy = `No ingredients matched our PD database yet.`
  } else {
    derivedTier = 'safe'
    derivedWhy = `No flagged ingredients detected.`
  }

  // ── Combine paths ───────────────────────────────────────────────
  const final: ProductVerdict = directVerdict
    ? {
        tier: directVerdict.tier,
        confidence: directVerdict.confidence,
        source: ingredientVerdicts.length > 0 ? 'mixed' : 'direct',
        flagged_ingredients: flagged,
        helpful_ingredients: helpful,
        coverage,
        why: directVerdict.why,
      }
    : {
        tier: derivedTier,
        confidence:
          ingredientVerdicts.length === 0
            ? 'insufficient'
            : confidenceLevel(
                ingredientVerdicts.reduce((s, v) => s + v.observations_count, 0)
              ),
        source: 'ingredient_derived',
        flagged_ingredients: flagged,
        helpful_ingredients: helpful,
        coverage,
        why: derivedWhy,
      }

  // Append coverage caveat when coverage is poor and we didn't already say "avoid"
  if (
    coverage.percentage < 0.5 &&
    coverage.total > 0 &&
    final.tier !== 'avoid'
  ) {
    final.why += ` Note: only ${coverage.matched} of ${coverage.total} ingredients recognized — verdict may be incomplete.`
  }

  return final
}
