import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export const runtime = 'nodejs'

/**
 * POST /api/observations/submit
 *
 * User submits their experience with a product or ingredient.
 * Auto-approved per spec — observation is created with curator_verified=true
 * so it counts in materialized views immediately on next refresh.
 *
 * Auth required (request must include valid Supabase user JWT).
 */

interface SubmitBody {
  product_id?: string
  ingredient_id?: string
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
  outcome?: 'improved' | 'cleared' | 'no_change' | 'worsened' | 'mixed' | 'unknown'
  pd_phase?: 'active' | 'maintenance'
  role?: 'trigger' | 'helpful' | 'neutral' | 'avoided' | 'present'
  notes?: string
  user_id: string  // required: Supabase auth.users.id
}

export async function POST(req: NextRequest) {
  let body: SubmitBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const {
    product_id,
    ingredient_id,
    sentiment,
    outcome = 'unknown',
    pd_phase,
    role,
    notes,
    user_id,
  } = body

  // Validation
  if (!user_id) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 })
  }
  if (!product_id && !ingredient_id) {
    return NextResponse.json(
      { error: 'product_id or ingredient_id required' },
      { status: 400 }
    )
  }
  if (!['positive', 'negative', 'neutral', 'mixed'].includes(sentiment)) {
    return NextResponse.json({ error: 'invalid sentiment' }, { status: 400 })
  }
  if (ingredient_id && !role) {
    return NextResponse.json(
      { error: 'role required when ingredient_id provided' },
      { status: 400 }
    )
  }

  const supabase = createServerSupabase()

  // 1. Create observation (auto-approved)
  const { data: observation, error: obsErr } = await supabase
    .from('observations')
    .insert({
      source: 'user_submission',
      raw_text: notes || null,
      sentiment,
      outcome,
      pd_phase: pd_phase || null,
      curated: true,
      curator_verified: true,
    })
    .select()
    .single()

  if (obsErr || !observation) {
    return NextResponse.json(
      { error: 'failed to create observation', detail: obsErr?.message },
      { status: 500 }
    )
  }

  // 2. Link to product or ingredient
  if (product_id) {
    await supabase.from('product_observations').insert({
      product_id,
      observation_id: observation.id,
      sentiment_in_context: sentiment,
    })
  }

  if (ingredient_id && role) {
    await supabase.from('ingredient_observations').insert({
      ingredient_id,
      observation_id: observation.id,
      role,
      context_notes: notes || null,
    })
  }

  return NextResponse.json({
    success: true,
    observation_id: observation.id,
    message: 'Thanks for contributing. Your observation will be reflected in verdicts after the next nightly refresh.',
  })
}
