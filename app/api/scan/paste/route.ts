import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabase } from '@/lib/supabase-server'
import { parseIngredientText } from '@/lib/parse'
import { matchIngredients } from '@/lib/match'
import { productVerdict } from '@/lib/verdict'
import { hashInput } from '@/lib/hash'
import { Phase, ScanResponse } from '@/lib/types'

export const runtime = 'nodejs'

/**
 * /api/scan/paste differs from /api/scan/ocr only in `method` field
 * stored in scan_events (for analytics — paste-quality text vs OCR-quality text).
 * Logic is otherwise identical.
 */

interface PasteBody {
  raw_text: string
  phase?: Phase
  user_id?: string | null
}

export async function POST(req: NextRequest) {
  let body: PasteBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { raw_text, phase = 'any', user_id = null } = body

  if (!raw_text || typeof raw_text !== 'string' || raw_text.trim().length < 5) {
    return NextResponse.json({ error: 'raw_text required (min 5 chars)' }, { status: 400 })
  }

  const supabase = createServerSupabase()

  const tokens = parseIngredientText(raw_text)
  const matched = await matchIngredients(supabase, tokens)

  const verdict = await productVerdict(supabase, {
    product_id: null,
    matched_ingredients: matched,
    phase,
  })

  const scan_event_id = crypto.randomUUID()
  const matchedIds = matched
    .filter(m => m.ingredient_id)
    .map(m => m.ingredient_id!) as string[]
  const unknownStrings = matched
    .filter(m => !m.ingredient_id)
    .map(m => m.raw_token)
  const avgConfidence =
    matched.length > 0
      ? matched.reduce((s, m) => s + m.confidence, 0) / matched.length
      : 0

  await supabase.from('scan_events').insert({
    id: scan_event_id,
    user_id,
    method: 'paste',
    input_hash: hashInput(raw_text),
    raw_input: raw_text,
    extracted_ingredient_ids: matchedIds,
    unknown_ingredient_strings: unknownStrings,
    match_confidence_avg: avgConfidence,
    phase,
    verdict_json: verdict,
  })

  const response: ScanResponse = {
    product: {
      id: null,
      name: null,
      brand: null,
      barcode: null,
      image_url: null,
      source: 'user_ocr',
    },
    verdict,
    ingredients: matched,
    unknown_count: unknownStrings.length,
    scan_event_id,
  }

  return NextResponse.json(response)
}
