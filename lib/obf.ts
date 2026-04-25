/**
 * Open Beauty Facts client.
 * Free, no auth, CC-BY-SA. We cache responses in our products table
 * (with source='obf') so we never call OBF twice for the same barcode.
 */

const OBF_USER_AGENT = 'ClearPD/1.0 - https://clearpd.com - hello@clearpd.com'
const OBF_BASE = 'https://world.openbeautyfacts.org/api/v2/product'

export interface OBFProduct {
  name: string | null
  brand: string | null
  ingredients_text: string | null
  image_url: string | null
}

export async function fetchOBFProduct(barcode: string): Promise<OBFProduct | null> {
  try {
    const r = await fetch(`${OBF_BASE}/${encodeURIComponent(barcode)}.json`, {
      headers: { 'User-Agent': OBF_USER_AGENT },
      // Edge cache for 24h; we also persist in DB
      next: { revalidate: 86400 },
    })

    if (!r.ok) return null
    const data = await r.json()
    if (data.status !== 1 || !data.product) return null

    const p = data.product

    // OBF often has ingredients_text in multiple language variants;
    // prefer English, fall back to whatever is present.
    const ingredients_text =
      p.ingredients_text_en ||
      p.ingredients_text ||
      p.ingredients_text_fr ||
      null

    if (!ingredients_text) return null

    return {
      name: p.product_name_en || p.product_name || null,
      brand: p.brands || null,
      ingredients_text,
      image_url: p.image_front_url || null,
    }
  } catch (error) {
    console.error('OBF fetch failed:', error)
    return null
  }
}
