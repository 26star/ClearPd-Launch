// Shared types for the SEO/AEO content surfaces (category, ingredient,
// product detail pages). These pages are static, hand-curated, and have
// no Supabase dependency. The dynamic scanner is the conversion surface;
// these are the discovery surfaces that funnel to it.

export type Verdict = 'Safe' | 'Caution' | 'Avoid'
export type Tone = 'safe' | 'caution' | 'tertiary'

export type Section = { heading: string; body: string }
export type FAQ = { q: string; a: string }
export type Reference = { title: string; url: string }

interface BaseEntry {
  slug: string
  metaTitle: string         // <= 60 chars (Google truncates)
  metaDescription: string   // <= 155 chars
  h1: string
  directAnswer: string      // 40-60 words, plain English, AEO snippet target
  sections: Section[]       // 4-5 H2 blocks
  faqs: FAQ[]               // 4-6 per page, all rendered as FAQPage JSON-LD
  related: string[]         // sibling slugs in the same content type
  updatedAt: string         // ISO date — Google freshness signal
}

export interface IngredientEntry extends BaseEntry {
  kind: 'ingredient'
  name: string              // human-readable, e.g. "Sodium Lauryl Sulfate"
  aliases: string[]         // INCI synonyms, abbreviations
  verdict: Verdict
  tone: Tone
  references: Reference[]   // 2-3 PubMed / peer-reviewed
  productSlugs: string[]    // products that contain this ingredient (links)
}

export interface ProductEntry extends BaseEntry {
  kind: 'product'
  name: string
  brand: string
  category: string          // category slug
  verdict: Verdict
  tone: Tone
  keyIngredients: { name: string; verdict: Verdict; slug?: string }[]
}

export interface CategoryEntry extends BaseEntry {
  kind: 'category'
  title: string
  blurb: string
  productSlugs: string[]    // featured products in this category
  ingredientSlugs: string[] // most-relevant ingredient pages to cross-link
}

export type AnyEntry = IngredientEntry | ProductEntry | CategoryEntry
