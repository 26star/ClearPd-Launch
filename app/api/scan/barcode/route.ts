import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabase } from '@/lib/supabase-server'
import { parseIngredientText } from '@/lib/parse'
import { matchIngredients } from '@/lib/match'
import { productVerdict } from '@/lib/verdict'
import { fetchOBFProduct } from '@/lib/obf'
import { hashInput } from '@/lib/hash'
import { Phase, ScanResponse } from '@/lib/types'

export const runtime = 'nodejs'

interface BarcodeBody {
  barcode: string
  phase?: Phase
  user_id?: string | null
}

export async function POST(req: NextRequest) {
  let body: BarcodeBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { barcode, phase = 'any', user_id = null } = body

  if (!barcode || typeof barcode !== 'string' || barcode.length < 6) {
    return NextResponse.json({ error: 'valid barcode required' }, { status: 400 })
  }

  const supabase = createServerSupabase()

  // ─── 1. Check our products table first ───────────────────────────
  let { data: productData } = await supabase
    .from('products')
    .select('id, name, brand, barcode, ingredients_text, image_url, source')
    .eq('barcode', barcode)
    .maybeSingle()

  // ─── 2. Fall back to Open Beauty Facts ───────────────────────────
  if (!productData) {
    const obf = await fetchOBFProduct(barcode)
    if (obf && obf.ingredients_text) {
      const insert = await supabase
        .from('products')
        .insert({
          barcode,
          name: obf.name,
          brand: obf.brand,
          ingredients_text: obf.ingredients_text,
          image_url: obf.image_url,
          source: 'obf',
          obf_synced_at: new Date().toISOString(),
        })
        .select('id, name, brand, barcode, ingredients_text, image_url, source')
        .single()

      productData = insert.data
    }
  }

  // ─── 3. Still nothing → unknown product response ─────────────────
  if (!productData) {
    const scan_event_id = crypto.randomUUID()
    await supabase.from('scan_events').insert({
      id: scan_event_id,
      user_id,
      method: 'barcode',
      input_hash: hashInput(barcode),
      raw_input: barcode,
      phase,
    })

    const response: ScanResponse = {
      product: {
        id: null,
        name: null,
        brand: null,
        barcode,
        image_url: null,
        source: 'unknown',
      },
      verdict: {
        tier: 'insufficient_data',
        confidence: 'insufficient',
        source: 'ingredient_derived',
        flagged_ingredients: [],
        helpful_ingredients: [],
        coverage: { matched: 0, total: 0, percentage: 0 },
        why: 'Product not found.',
      },
      ingredients: [],
      unknown_count: 0,
      scan_event_id,
    }
    return NextResponse.json(response)
  }

  // ─── 4. Parse + match ingredients ────────────────────────────────
  const tokens = parseIngredientText(productData.ingredients_text || '')
  const matched = await matchIngredients(supabase, tokens)

  // ─── 5. Compute verdict ──────────────────────────────────────────
  const verdict = await productVerdict(supabase, {
    product_id: productData.id,
    matched_ingredients: matched,
    phase,
  })

  // ─── 6. Log scan event ───────────────────────────────────────────
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
    method: 'barcode',
    input_hash: hashInput(barcode),
    raw_input: barcode,
    matched_product_id: productData.id,
    extracted_ingredient_ids: matchedIds,
    unknown_ingredient_strings: unknownStrings,
    match_confidence_avg: avgConfidence,
    phase,
    verdict_json: verdict,
  })

  const response: ScanResponse = {
    product: {
      id: productData.id,
      name: productData.name,
      brand: productData.brand,
      barcode: productData.barcode,
      image_url: productData.image_url,
      source: productData.source as ScanResponse['product']['source'],
    },
    verdict,
    ingredients: matched,
    unknown_count: unknownStrings.length,
    scan_event_id,
  }

  return NextResponse.json(response)
}
