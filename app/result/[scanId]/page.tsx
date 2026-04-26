import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { ResultView } from './ResultView'

type Props = {
  params: Promise<{ scanId: string }>
  searchParams: Promise<{ conf?: string }>
}

// Each scan is unique. No static generation, no cache (verdict_json is
// already cached per scan in the row).
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Scan result · ClearPD',
    description:
      'Your perioral dermatitis safety verdict — flagged ingredients, helpful ingredients, and what to do next.',
    // Per-scan results may include user-pasted text — keep them out of search.
    robots: { index: false, follow: false },
  }
}

export default async function ResultPage({ params, searchParams }: Props) {
  const [{ scanId }, { conf }] = await Promise.all([params, searchParams])

  if (!UUID_RE.test(scanId)) notFound()

  // Parse the optional OCR confidence param. Anything not a sane integer
  // in [0, 100] is dropped silently — it's just a UI hint, not load-bearing.
  let ocrConfidence: number | undefined
  if (conf !== undefined) {
    const n = Number.parseInt(conf, 10)
    if (Number.isFinite(n) && n >= 0 && n <= 100) ocrConfidence = n
  }

  const supabase = createServerSupabase()

  const { data: scan } = await supabase
    .from('scan_events')
    .select(
      'id, method, raw_input, matched_product_id, extracted_ingredient_ids, unknown_ingredient_strings, phase, verdict_json, created_at',
    )
    .eq('id', scanId)
    .maybeSingle()

  if (!scan) notFound()

  const [productRes, ingredientRes] = await Promise.all([
    scan.matched_product_id
      ? supabase
          .from('products')
          .select('id, name, brand, barcode, image_url, source')
          .eq('id', scan.matched_product_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    scan.extracted_ingredient_ids && scan.extracted_ingredient_ids.length > 0
      ? supabase
          .from('ingredients')
          .select('id, inci_name, display_name, function')
          .in('id', scan.extracted_ingredient_ids)
      : Promise.resolve({ data: [] }),
  ])

  return (
    <ResultView
      scan={scan}
      product={productRes.data}
      ingredients={ingredientRes.data || []}
      ocrConfidence={ocrConfidence}
    />
  )
}
