// One-off ETL: import legacy ClearPD snapshot into the new Supabase schema.
//
// Run with:  node --env-file=.env.local scripts/import-legacy.mjs
// Optional:  add --dry-run to preview without writing.
//
// Source data: E:/CLEAR PD LAUNCH SUPABASE  (CSV+JSON snapshot from
// efdsiljpsbwksjykljip.supabase.co, scope = January 2025).
//
// Schema is NOT 1:1; this is a lossy ETL. See conversation log for the
// dropped-field list and mapping decisions.

import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const SRC = 'E:/CLEAR PD LAUNCH SUPABASE/data'
const DRY = process.argv.includes('--dry-run')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const sb = createClient(url, key, { auth: { persistSession: false } })

const log = (...a) => console.log(...a)
const load = name => JSON.parse(fs.readFileSync(path.join(SRC, name), 'utf8'))

// ── 1. Load source JSON ─────────────────────────────────────────────
log('Loading source JSON…')
const srcObs   = load('observations.json')
const srcIng   = load('ingredients.json')
const srcProd  = load('products.json')
const srcPO    = load('product_observations.json')
const srcIO    = load('ingredient_observations.json')
log(`  observations=${srcObs.length}, ingredients=${srcIng.length}, products=${srcProd.length}, product_observations=${srcPO.length}, ingredient_observations=${srcIO.length}`)

// ── 2. Mapping helpers ──────────────────────────────────────────────
function mapPhase(h) {
  if (!h) return 'unknown'
  if (h === 'active_flare') return 'active'
  if (h === 'maintenance') return 'maintenance'
  if (h === 'post_inflammatory_erythema') return 'maintenance'
  if (h === 'unknown') return 'unknown'
  return 'unknown'
}
function mapRole(m) {
  const v = (m || '').toLowerCase()
  if (['trigger','helpful','neutral','avoided','present'].includes(v)) return v
  return 'present'
}
const VALID_SENT = new Set(['positive','negative','neutral','mixed'])
const VALID_OUTC = new Set(['improved','cleared','no_change','worsened','mixed','unknown'])
function safeSent(s) { return VALID_SENT.has(s) ? s : null }
function safeOutc(o) { return VALID_OUTC.has(o) ? o : (o == null ? 'unknown' : 'unknown') }

// ── 3. Pull current ingredients + products from new DB for dedup ────
log('\nFetching existing rows from new DB…')
const { data: existIng, error: e1 } = await sb.from('ingredients').select('id, inci_name, aliases')
if (e1) throw e1
const { data: existProd, error: e2 } = await sb.from('products').select('id, name, brand')
if (e2) throw e2
log(`  existing: ingredients=${existIng.length}, products=${existProd.length}`)

// Build lookup: lowercase name OR alias → ingredient.id
const ingLookup = new Map()
for (const r of existIng) {
  ingLookup.set(r.inci_name.toLowerCase().trim(), r.id)
  for (const a of r.aliases || []) ingLookup.set(String(a).toLowerCase().trim(), r.id)
}
// Build product lookup: lowercase "name|brand"
const prodLookup = new Map()
for (const r of existProd) {
  const k = `${(r.name || '').toLowerCase().trim()}|${(r.brand || '').toLowerCase().trim()}`
  prodLookup.set(k, r.id)
}

// ── 4. Resolve / insert ingredients ─────────────────────────────────
log('\nResolving ingredients…')
const ingIdMap = new Map() // src_ingredient_id → new ingredient.id
const newIngs = []
let ingMatched = 0
for (const s of srcIng) {
  const name = (s.ingredient_name || s.inci_name || '').trim()
  if (!name) continue
  const lk = name.toLowerCase()
  let hit = ingLookup.get(lk)
  if (!hit && Array.isArray(s.common_names)) {
    for (const a of s.common_names) {
      hit = ingLookup.get(String(a).toLowerCase().trim())
      if (hit) break
    }
  }
  if (hit) {
    ingIdMap.set(s.ingredient_id, hit)
    ingMatched++
  } else {
    newIngs.push({
      inci_name: name,
      display_name: name,
      aliases: Array.isArray(s.common_names) ? s.common_names : [],
      function: s.irritant_type || null,
      curator_verified: !!s.curator_verified,
      _src_id: s.ingredient_id,
    })
  }
}
log(`  matched to existing: ${ingMatched}`)
log(`  to insert: ${newIngs.length}`)

if (newIngs.length && !DRY) {
  const payload = newIngs.map(({ _src_id, ...rest }) => rest)
  const { data, error } = await sb.from('ingredients').insert(payload).select('id, inci_name')
  if (error) throw error
  const byName = new Map(data.map(r => [r.inci_name.toLowerCase().trim(), r.id]))
  for (const ni of newIngs) {
    const id = byName.get(ni.inci_name.toLowerCase().trim())
    if (id) ingIdMap.set(ni._src_id, id)
  }
  log(`  inserted ${data.length} ingredients`)
} else if (newIngs.length && DRY) {
  for (const ni of newIngs) ingIdMap.set(ni._src_id, '00000000-0000-0000-0000-000000000000')
  log(`  (dry-run) would insert ${newIngs.length} ingredients`)
}

// ── 5. Resolve / insert products ────────────────────────────────────
log('\nResolving products…')
const prodIdMap = new Map() // src product_id → new product.id
const newProds = []
let prodMatched = 0
for (const s of srcProd) {
  const name = (s.product_name || '').trim()
  if (!name) continue
  const brand = (s.brand || '').trim()
  const k = `${name.toLowerCase()}|${brand.toLowerCase()}`
  const hit = prodLookup.get(k)
  if (hit) {
    prodIdMap.set(s.product_id, hit)
    prodMatched++
  } else {
    newProds.push({
      name,
      brand: brand || null,
      ingredients_text: s.ingredients_list || null,
      source: 'curated',
      image_url: s.image_url || null,
      curated_notes: s.curator_notes || null,
      _src_id: s.product_id,
    })
  }
}
log(`  matched to existing: ${prodMatched}`)
log(`  to insert: ${newProds.length}`)

if (newProds.length && !DRY) {
  for (let i = 0; i < newProds.length; i += 100) {
    const chunk = newProds.slice(i, i + 100).map(({ _src_id, ...rest }) => rest)
    const { data, error } = await sb.from('products').insert(chunk).select('id, name, brand')
    if (error) throw error
    const byKey = new Map(data.map(r =>
      [`${(r.name || '').toLowerCase().trim()}|${(r.brand || '').toLowerCase().trim()}`, r.id]))
    for (const np of newProds.slice(i, i + 100)) {
      const k = `${np.name.toLowerCase()}|${(np.brand || '').toLowerCase()}`
      const id = byKey.get(k)
      if (id) prodIdMap.set(np._src_id, id)
    }
  }
  log(`  inserted ${newProds.length} products`)
} else if (newProds.length && DRY) {
  for (const np of newProds) prodIdMap.set(np._src_id, '00000000-0000-0000-0000-000000000000')
  log(`  (dry-run) would insert ${newProds.length} products`)
}

// ── 6. Aggregate sentiment/outcome from product_observations per obs ─
log('\nAggregating sentiment/outcome from product_observations…')
const sentByObs = new Map() // obs_id → { sentiment, outcome }
{
  const buckets = new Map()
  for (const r of srcPO) {
    if (!r.observation_id) continue
    if (!buckets.has(r.observation_id)) buckets.set(r.observation_id, [])
    buckets.get(r.observation_id).push({ s: safeSent(r.sentiment), o: safeOutc(r.outcome) })
  }
  for (const [obsId, arr] of buckets) {
    const sCounts = new Map(), oCounts = new Map()
    for (const x of arr) {
      if (x.s) sCounts.set(x.s, (sCounts.get(x.s) ?? 0) + 1)
      if (x.o) oCounts.set(x.o, (oCounts.get(x.o) ?? 0) + 1)
    }
    const top = m => [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    sentByObs.set(obsId, { sentiment: top(sCounts), outcome: top(oCounts) ?? 'unknown' })
  }
  log(`  built sentiment for ${sentByObs.size} observations`)
}

// ── 7. Filter and prepare observations (curated only) ───────────────
log('\nPreparing observations (curated only)…')
const curatedObs = srcObs.filter(o => o.curation_status === 'curated' && o.is_deleted !== true)
log(`  ${curatedObs.length} of ${srcObs.length} pass filter`)

const obsRows = curatedObs.map(o => {
  const agg = sentByObs.get(o.observation_id) || { sentiment: null, outcome: 'unknown' }
  return {
    id: o.observation_id, // preserve UUID
    source: 'reddit',
    source_url: o.permalink || null,
    source_post_date: o.post_date ? o.post_date.slice(0, 10) : null,
    raw_text: o.full_comment_text || '(empty)',
    sentiment: agg.sentiment,
    outcome: agg.outcome,
    pd_phase: mapPhase(o.healing_phase),
    curated: true,
    curator_verified: !!o.curator_verified,
    created_at: o.created_at || null,
  }
})

// ── 8. Insert observations in chunks ────────────────────────────────
if (!DRY) {
  log('\nInserting observations…')
  const chunkSize = 200
  for (let i = 0; i < obsRows.length; i += chunkSize) {
    const chunk = obsRows.slice(i, i + chunkSize)
    const { error } = await sb.from('observations').insert(chunk)
    if (error) {
      console.error(`  chunk ${i}: ${error.message}`)
      throw error
    }
    process.stdout.write(`\r  inserted ${Math.min(i + chunkSize, obsRows.length)}/${obsRows.length}`)
  }
  log('')
}

// ── 9. Build curated obs-id set, then prepare links ─────────────────
const curatedObsIds = new Set(obsRows.map(r => r.id))

log('\nPreparing product_observations links…')
const poRows = []
const poSeen = new Set()
let poDropped = 0
for (const r of srcPO) {
  if (!curatedObsIds.has(r.observation_id)) { poDropped++; continue }
  const newProdId = prodIdMap.get(r.product_id)
  if (!newProdId) { poDropped++; continue }
  const k = `${newProdId}|${r.observation_id}`
  if (poSeen.has(k)) continue
  poSeen.add(k)
  poRows.push({
    product_id: newProdId,
    observation_id: r.observation_id,
    sentiment_in_context: r.sentiment || null,
  })
}
log(`  ${poRows.length} links prepared (${poDropped} dropped: not curated or no product mapping)`)

log('\nPreparing ingredient_observations links…')
const ioRows = []
const ioSeen = new Set()
let ioDropped = 0
for (const r of srcIO) {
  if (!curatedObsIds.has(r.observation_id)) { ioDropped++; continue }
  const newIngId = ingIdMap.get(r.ingredient_id)
  if (!newIngId) { ioDropped++; continue }
  const k = `${newIngId}|${r.observation_id}`
  if (ioSeen.has(k)) continue
  ioSeen.add(k)
  ioRows.push({
    ingredient_id: newIngId,
    observation_id: r.observation_id,
    role: mapRole(r.mentioned_as),
    context_notes: r.quote_about_ingredient || r.user_reaction || null,
  })
}
log(`  ${ioRows.length} links prepared (${ioDropped} dropped: not curated or no ingredient mapping)`)

if (!DRY) {
  log('\nInserting product_observations…')
  for (let i = 0; i < poRows.length; i += 200) {
    const { error } = await sb.from('product_observations').insert(poRows.slice(i, i + 200))
    if (error) throw error
  }
  log('\nInserting ingredient_observations…')
  for (let i = 0; i < ioRows.length; i += 200) {
    const { error } = await sb.from('ingredient_observations').insert(ioRows.slice(i, i + 200))
    if (error) throw error
  }
}

// ── 10. Refresh materialized views ──────────────────────────────────
if (!DRY) {
  log('\nRefreshing materialized views…')
  const { error } = await sb.rpc('refresh_consensus_views')
  if (error) throw error
}

// ── 11. Final counts ────────────────────────────────────────────────
log('\nFinal counts:')
for (const t of ['ingredients','products','observations','product_observations','ingredient_observations']) {
  const { count, error } = await sb.from(t).select('*', { count: 'exact', head: true })
  if (error) throw error
  log(`  ${t}: ${count}`)
}

log(DRY ? '\nDRY RUN — no writes performed.' : '\nDone.')
