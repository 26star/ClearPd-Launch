// One-off: print distinct values for fields that need mapping decisions.
// Run: node scripts/inspect-legacy.mjs
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'E:/CLEAR PD LAUNCH SUPABASE/data'

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(SRC, name), 'utf8'))
}

function distinct(rows, field, limit = 30) {
  const counts = new Map()
  for (const r of rows) {
    const v = r[field]
    if (Array.isArray(v)) {
      for (const x of v) counts.set(String(x), (counts.get(String(x)) ?? 0) + 1)
    } else {
      const k = v === null || v === undefined ? '<null>' : String(v)
      counts.set(k, (counts.get(k) ?? 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
}

function dump(label, pairs) {
  console.log(`\n── ${label} ── (top ${pairs.length})`)
  for (const [v, n] of pairs) console.log(`  ${String(n).padStart(5)}  ${v}`)
}

const obs = load('observations.json')
const ing = load('ingredients.json')
const po = load('product_observations.json')
const io = load('ingredient_observations.json')
const prods = load('products.json')

console.log(`Loaded: observations=${obs.length}, ingredients=${ing.length}, products=${prods.length}, product_observations=${po.length}, ingredient_observations=${io.length}`)

dump('observations.healing_phase', distinct(obs, 'healing_phase'))
dump('observations.curation_status', distinct(obs, 'curation_status'))
dump('observations.curator_verified', distinct(obs, 'curator_verified'))
dump('observations.is_deleted', distinct(obs, 'is_deleted'))

dump('ingredients.pd_risk_level', distinct(ing, 'pd_risk_level'))
dump('ingredients.irritant_type (sample)', distinct(ing, 'irritant_type', 5))

dump('product_observations.sentiment', distinct(po, 'sentiment'))
dump('product_observations.outcome', distinct(po, 'outcome'))
dump('product_observations.mention_type', distinct(po, 'mention_type'))

dump('ingredient_observations.user_reaction', distinct(io, 'user_reaction'))
dump('ingredient_observations.mentioned_as', distinct(io, 'mentioned_as'))

// Ingredient overlap with current seed
const seedNames = new Set([
  'hydrocortisone','retinol','sodium fluoride','niacinamide','sodium lauryl sulfate','sodium laureth sulfate','parfum','coconut oil',
  'azelaic acid','zinc oxide','doxycycline','metronidazole','ivermectin','ketoconazole','pimecrolimus','tacrolimus','minocycline','clotrimazole','zinc pyrithione','sulfur','hypochlorous acid','tea tree oil',
  'aqua','glycerin','cetearyl alcohol','cetyl alcohol','phenoxyethanol','caprylyl glycol','tocopherol','panthenol','allantoin','squalane','hyaluronic acid','centella asiatica extract','madecassoside','bisabolol','beta-glucan','ceramide np','ceramide ap','ceramide eop','cholesterol','sodium hydroxide','citric acid','disodium edta','xanthan gum'
])
const sourceNames = ing.map(i => (i.ingredient_name || '').toLowerCase().trim()).filter(Boolean)
const overlap = sourceNames.filter(n => seedNames.has(n))
const onlyInSource = sourceNames.filter(n => !seedNames.has(n))
console.log(`\n── ingredient overlap (source name matches seed inci_name) ──`)
console.log(`  matches: ${overlap.length}/${sourceNames.length}`)
console.log(`  only in source (will need INSERT): ${onlyInSource.length}`)
console.log(`  examples only-in-source:`, onlyInSource.slice(0, 15))

// Product overlap
const seedProductNames = new Set([
  'doxycycline','metronidazole gel/cream','avene cicalfate+','elidel (pimecrolimus)','hypochlorous acid spray','soolantra (ivermectin)','protopic (tacrolimus)','azelaic acid 15% rx','de la cruz sulfur','clotrimazole cream','zinc pyrithione soap','triple paste diaper cream'
])
const sourceProductNames = prods.map(p => (p.product_name || '').toLowerCase().trim()).filter(Boolean)
const prodOverlap = sourceProductNames.filter(n => seedProductNames.has(n))
console.log(`\n── product overlap (source name matches seed name) ──`)
console.log(`  matches: ${prodOverlap.length}/${sourceProductNames.length}`)
console.log(`  examples only-in-source:`, sourceProductNames.filter(n => !seedProductNames.has(n)).slice(0, 10))

// Curation flag distribution
const verifiedTrue = obs.filter(o => o.curator_verified === true).length
const curatedDone = obs.filter(o => o.curation_status === 'completed' || o.curation_status === 'verified' || o.curation_status === 'approved').length
console.log(`\n── observations curated/verified summary ──`)
console.log(`  curator_verified === true: ${verifiedTrue}`)
console.log(`  curation_status looks done: ${curatedDone}`)
console.log(`  is_deleted === true: ${obs.filter(o => o.is_deleted === true).length}`)
