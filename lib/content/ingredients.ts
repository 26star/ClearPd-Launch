import { IngredientEntry } from './types'

export const INGREDIENTS: IngredientEntry[] = [
  {
    kind: 'ingredient',
    slug: 'sodium-lauryl-sulfate',
    name: 'Sodium Lauryl Sulfate',
    aliases: ['SLS', 'sodium lauryl sulphate', 'sodium dodecyl sulfate'],
    verdict: 'Avoid',
    tone: 'tertiary',
    metaTitle: 'Sodium Lauryl Sulfate (SLS) and Perioral Dermatitis',
    metaDescription: 'SLS is one of the most consistently reported PD triggers. Why it disrupts the skin barrier, where it hides, and what to use instead.',
    h1: 'Sodium Lauryl Sulfate (SLS) and perioral dermatitis',
    directAnswer:
      'Sodium lauryl sulfate (SLS) is a foaming surfactant that disrupts the skin barrier and is strongly linked to perioral dermatitis flares, especially when present in toothpaste and facial cleansers. Most PD sufferers see clear improvement after eliminating SLS for two weeks. It hides in toothpaste, foaming face washes, body washes, and shampoos.',
    sections: [
      {
        heading: 'What SLS does to the skin barrier',
        body: 'Sodium lauryl sulfate is an anionic detergent that strips skin lipids by binding to fatty molecules and washing them away. Studies consistently show SLS exposure increases transepidermal water loss and reduces stratum corneum integrity within minutes. On healthy skin this recovers; on PD-prone perioral skin, the barrier disruption seeds new inflammation each time the surfactant contacts it.',
      },
      {
        heading: 'Where SLS hides',
        body: 'SLS is in most mainstream toothpastes (the foam is the giveaway), in foaming facial cleansers, in body washes, and in shampoos that drip down the face during rinsing. Its sister compound sodium laureth sulfate (SLES) is gentler but still problematic for highly reactive skin. Always read the first eight ingredients of any product that foams.',
      },
      {
        heading: 'How to test if SLS is your trigger',
        body: 'Switch to an SLS-free toothpaste (Sensodyne Pronamel, Hello Naturally Whitening, Tom’s of Maine SLS-free) for fourteen days. Keep everything else the same. If the rash improves visibly by day seven and clears further by day fourteen, SLS is in your trigger profile. This is the cheapest, fastest diagnostic test you can run on yourself.',
      },
      {
        heading: 'Safer alternatives',
        body: 'For toothpaste: any SLS-free formula with cocamidopropyl betaine or glycerin-based cleansing. For face washes: non-foaming syndet bars (Cetaphil Gentle, La Roche-Posay Toleriane). For body wash: cream-based cleansers like Cetaphil Restoraderm. The shared principle: low-foam means low-surfactant means low barrier disruption.',
      },
    ],
    faqs: [
      {
        q: 'Is SLS the same as SLES?',
        a: 'No — sodium lauryl sulfate (SLS) and sodium laureth sulfate (SLES) are different. SLES is ethoxylated and gentler, but still a barrier disruptor for sensitive skin. PD sufferers who react to SLS often tolerate SLES at low concentrations, but should avoid both during an active flare.',
      },
      {
        q: 'Why does SLS in toothpaste affect my face?',
        a: 'Toothpaste foam contacts the perioral skin during brushing twice daily. The surfactant deposits on the skin, disrupts the barrier, and seeds inflammation in the most PD-vulnerable area of the face. Switching to SLS-free toothpaste for two weeks is the highest-yield single change for PD recovery.',
      },
      {
        q: 'Are there any safe uses of SLS for PD?',
        a: 'For most PD sufferers during an active flare, no. Once the rash has fully cleared and stayed clear for three months, some users tolerate brief-contact SLS in body wash. Long-contact products like toothpaste, facial cleanser, and shampoo should remain SLS-free permanently.',
      },
      {
        q: 'Is "naturally derived" SLS safer?',
        a: 'No. SLS derived from coconut or palm is chemically identical to petroleum-derived SLS. The "naturally derived" label is a marketing distinction, not a chemical or biological one. The molecule disrupts the skin barrier the same way regardless of origin.',
      },
      {
        q: 'How long until SLS-induced PD clears?',
        a: 'For SLS-only triggers, most see substantial improvement within two weeks of complete elimination. Full clearance typically takes four to eight weeks. If you stop SLS and still see no improvement after three weeks, look at additional triggers — fragrance, fluoride, occlusives.',
      },
    ],
    related: ['fragrance', 'fluoride', 'cinnamic-aldehyde'],
    productSlugs: ['colgate-total', 'cetaphil-gentle-cleanser'],
    references: [
      { title: 'Lipozencic & Wolf — Contact and irritant dermatitis (Clin Dermatol, 2011)', url: 'https://pubmed.ncbi.nlm.nih.gov/21429471/' },
      { title: 'Tempark et al — Perioral dermatitis: a review (J Dermatolog Treat, 2014)', url: 'https://pubmed.ncbi.nlm.nih.gov/24428802/' },
      { title: 'Hall & Eisen — Perioral dermatitis review (Dermatol Online J, 2013)', url: 'https://escholarship.org/uc/item/0jq2t7fb' },
    ],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'ingredient',
    slug: 'fluoride',
    name: 'Fluoride',
    aliases: ['sodium fluoride', 'stannous fluoride', 'sodium monofluorophosphate', 'MFP'],
    verdict: 'Caution',
    tone: 'caution',
    metaTitle: 'Fluoride and Perioral Dermatitis: What the Evidence Says',
    metaDescription: 'Fluoride is a documented PD trigger for a subset of patients. Whether to swap your toothpaste, and how to test it in two weeks.',
    h1: 'Fluoride and perioral dermatitis',
    directAnswer:
      'Fluoride is a documented perioral dermatitis trigger for a subset of patients, particularly stannous and sodium fluoride in toothpaste. Switching to a fluoride-free toothpaste for two weeks is a low-cost diagnostic test. If your rash clears, fluoride is in your trigger profile. If not, reintroduce it for cavity protection.',
    sections: [
      {
        heading: 'How fluoride may trigger PD',
        body: 'Fluoride is not universally a PD trigger — most people tolerate it without issue. For a subset, the mechanism appears to involve direct contact irritation of perioral skin during brushing rather than systemic effect. Stannous fluoride is more frequently implicated than sodium fluoride, and toothpaste delivery (vs water fluoridation) is the relevant exposure route.',
      },
      {
        heading: 'The two-week elimination test',
        body: 'Switch to a fluoride-free toothpaste (Tom’s of Maine Fluoride-Free, Hello Antiplaque Fluoride-Free, Schmidt’s) for fourteen days. Keep everything else the same — no other product changes. If the rash improves by day seven and clears further by day fourteen, fluoride is in your trigger profile. This is best run alongside an SLS swap if you have not already done so.',
      },
      {
        heading: 'Cavity-protection trade-off',
        body: 'Fluoride-free toothpaste does not protect teeth as well as fluoride toothpaste. If you confirm fluoride as a trigger, options include: (1) accept slightly higher cavity risk and use fluoride-free; (2) use fluoride mouthwash instead of fluoride toothpaste, reducing skin contact; (3) reintroduce a low-concentration fluoride toothpaste once PD has been clear for three months and monitor.',
      },
      {
        heading: 'Other fluoride sources to consider',
        body: 'Fluoride mouthwash, fluoride dental treatments at the dentist, and prescription-strength fluoride pastes can all contribute. Tap water fluoridation is unlikely to be relevant — concentrations are far below skin-irritation thresholds. Focus on direct topical exposure: toothpaste, mouthwash, and professional treatments.',
      },
    ],
    faqs: [
      {
        q: 'Is fluoride bad for everyone with perioral dermatitis?',
        a: 'No. Fluoride is a trigger for a subset of PD sufferers, not all. Many people with PD tolerate fluoride toothpaste fine and have other triggers (SLS, cinnamon, fragrance). Run the two-week elimination test before assuming fluoride is your specific trigger.',
      },
      {
        q: 'Should I drink fluoride-free water?',
        a: 'No — tap water fluoridation is at concentrations far below skin-irritation thresholds and is not a documented PD trigger. The relevant exposure is direct contact with concentrated fluoride in toothpaste. Do not change your drinking water based on PD.',
      },
      {
        q: 'Is stannous or sodium fluoride worse for PD?',
        a: 'Anecdotally, stannous fluoride (in Crest Pro-Health, some Sensodyne) is more frequently flagged than sodium fluoride. If your fluoride toothpaste contains stannous fluoride, swap to a sodium fluoride formula first before going fully fluoride-free.',
      },
      {
        q: 'How long until fluoride-induced PD clears?',
        a: 'For fluoride-only triggers, expect visible improvement by day seven of elimination and substantial clearing by day fourteen. If no change after three weeks, fluoride is unlikely to be your primary trigger — investigate SLS, cinnamon flavouring, or fragrance instead.',
      },
      {
        q: 'Can I use fluoride mouthwash if I’m fluoride-sensitive in toothpaste?',
        a: 'Sometimes — mouthwash has shorter contact time with perioral skin than toothpaste foam. Try a brief-contact fluoride mouthwash (rinse and spit promptly) once your PD has cleared. Stop immediately if the rash returns.',
      },
    ],
    related: ['sodium-lauryl-sulfate', 'cinnamic-aldehyde'],
    productSlugs: ['colgate-total'],
    references: [
      { title: 'Mellette et al — Fluoride in toothpaste and perioral dermatitis', url: 'https://pubmed.ncbi.nlm.nih.gov/6708492/' },
      { title: 'Tempark et al — Perioral dermatitis: a review (J Dermatolog Treat, 2014)', url: 'https://pubmed.ncbi.nlm.nih.gov/24428802/' },
    ],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'ingredient',
    slug: 'cinnamic-aldehyde',
    name: 'Cinnamic Aldehyde',
    aliases: ['cinnamal', 'cinnamaldehyde', 'cinnamic aldehyde', '3-phenyl-2-propenal'],
    verdict: 'Avoid',
    tone: 'tertiary',
    metaTitle: 'Cinnamic Aldehyde: A Top Perioral Dermatitis Trigger',
    metaDescription: 'Cinnamic aldehyde — the cinnamon flavouring in toothpaste, gum, and lip balm — is one of the strongest documented PD triggers.',
    h1: 'Cinnamic aldehyde and perioral dermatitis',
    directAnswer:
      'Cinnamic aldehyde is the cinnamon flavouring used in toothpaste, chewing gum, and some lip products. It is one of the most consistently documented contact allergens for perioral skin, and a strong perioral dermatitis trigger. Eliminate all cinnamon, spice, and "warming" oral and lip products during a flare and for three months after clearing.',
    sections: [
      {
        heading: 'Why cinnamic aldehyde is so problematic',
        body: 'Cinnamic aldehyde is the dominant flavour molecule in cinnamon. It is a well-documented type IV (delayed) contact allergen, meaning the reaction can take 24-72 hours to appear after exposure — making the link easy to miss. The perioral skin is uniquely vulnerable because oral products deposit cinnamic aldehyde on the skin twice daily for years before symptoms emerge.',
      },
      {
        heading: 'Where it hides',
        body: 'Cinnamon-flavoured toothpaste, chewing gum, breath mints, candies, mouthwash, "warming" lip plumpers, holiday-season cinnamon lattes (rim residue on lips), Big Red gum, Atomic Fireballs. It is also in some baked goods, but the topical/oral route is the relevant exposure for PD. Read every label of anything that touches your mouth.',
      },
      {
        heading: 'Cross-reactions to expect',
        body: 'Cinnamic aldehyde sensitisation often cross-reacts with cinnamic alcohol, cinnamyl alcohol, balsam of Peru (a fragrance ingredient), and benzyl cinnamate. If you confirm cinnamic aldehyde sensitivity, also avoid these. Balsam of Peru in particular hides in many "natural" fragrances and skincare claims.',
      },
      {
        heading: 'Recovery timeline',
        body: 'After complete elimination, type IV allergic reactions typically clear within two to six weeks. Cinnamic aldehyde sensitisation is permanent — once your immune system has recognised it, you remain sensitive for life. Eliminate it permanently, not just during the flare.',
      },
    ],
    faqs: [
      {
        q: 'Is cinnamon in food a problem too?',
        a: 'For most PD sufferers, no — ingested cinnamon at culinary doses is rarely the trigger. The relevant exposure is topical and oral-contact: cinnamon toothpaste, gum, mints, lip balm. Stop these completely and keep an eye on dietary cinnamon only if symptoms persist.',
      },
      {
        q: 'How do I know if cinnamic aldehyde is my trigger?',
        a: 'Eliminate all cinnamon-containing oral and lip products for two weeks. If your rash clears, you have your answer. A patch test by a dermatologist can confirm cinnamic aldehyde allergy formally if you want diagnostic certainty.',
      },
      {
        q: 'What about cinnamon supplements for blood sugar?',
        a: 'Most are powdered cinnamon, taken orally and swallowed — not topical contact with perioral skin. They are unlikely to trigger PD. If concerned, swap to an enteric-coated capsule (no oral cavity exposure) for two weeks and observe.',
      },
      {
        q: 'Are other "spice" flavours safe?',
        a: 'Mostly yes. Vanilla, peppermint, spearmint, and clove are not chemically related to cinnamic aldehyde and do not cross-react. However, some PD sufferers react to peppermint and clove independently, so test before regular use.',
      },
      {
        q: 'Will I ever tolerate cinnamon again?',
        a: 'Topically, almost never. Cinnamic aldehyde sensitisation is a lifelong type IV allergy. The good news: once you eliminate it, the PD typically clears and stays clear, as long as you avoid re-exposure.',
      },
    ],
    related: ['fragrance', 'sodium-lauryl-sulfate', 'fluoride'],
    productSlugs: [],
    references: [
      { title: 'Larsen — Allergic contact dermatitis from fragrance (Contact Dermatitis, 1985)', url: 'https://pubmed.ncbi.nlm.nih.gov/2934204/' },
      { title: 'Tempark et al — Perioral dermatitis: a review (J Dermatolog Treat, 2014)', url: 'https://pubmed.ncbi.nlm.nih.gov/24428802/' },
    ],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'ingredient',
    slug: 'fragrance',
    name: 'Fragrance / Parfum',
    aliases: ['parfum', 'perfume', 'aroma', 'parfum/fragrance'],
    verdict: 'Avoid',
    tone: 'tertiary',
    metaTitle: 'Fragrance / Parfum and Perioral Dermatitis',
    metaDescription: 'Fragrance is the #1 cosmetic allergen and a top perioral dermatitis trigger. Why it hides everywhere and how to eliminate it.',
    h1: 'Fragrance / parfum and perioral dermatitis',
    directAnswer:
      'Fragrance — listed as "parfum" or "fragrance" — is the single most common cosmetic allergen and a top perioral dermatitis trigger. A single fragrance entry can mask up to 100 chemicals, including documented allergens like cinnamic aldehyde and balsam of Peru. Eliminate fragrance from skincare, hair products, and laundry detergent during a flare.',
    sections: [
      {
        heading: 'Why one word means hundreds of chemicals',
        body: 'Under cosmetic regulations, "fragrance" or "parfum" is treated as a trade secret — manufacturers can list a single word covering up to 100 individual fragrance chemicals. This means you cannot tell from the label which specific allergen you are reacting to. The only safe response for PD-prone skin is to eliminate all fragrance, not just specific named ones.',
      },
      {
        heading: 'Where it hides',
        body: 'Beyond the obvious (perfume, scented moisturizer), fragrance hides in shampoo and conditioner (rinses down face), laundry detergent and fabric softener (deposits on pillowcases and clothing), fabric "freshening" sprays, scented candles in the bedroom, hand soap (transfers to face when you touch your face), and "natural" essential-oil-scented products. Going fragrance-free means auditing every product, not just face products.',
      },
      {
        heading: '"Unscented" vs "fragrance-free"',
        body: 'These mean different things. "Fragrance-free" means no fragrance ingredients added. "Unscented" often means a masking fragrance has been added to neutralise the smell of other ingredients — so unscented products can still contain fragrance. Always look for "fragrance-free" specifically, and check the ingredient list for "parfum" or "fragrance" entries.',
      },
      {
        heading: 'How long elimination takes',
        body: 'For fragrance-driven PD, expect visible improvement within two weeks of complete elimination, and substantial clearing in four to eight weeks. The challenge is the audit — most people miss laundry detergent, shampoo, or partner products that transfer onto their face. Be ruthless: remove every fragranced product from the bathroom and bedroom.',
      },
    ],
    faqs: [
      {
        q: 'Is "natural fragrance" safer for PD?',
        a: 'No. "Natural fragrance" typically means essential oils, which are concentrated allergens and frequently flagged as PD triggers (lavender, eucalyptus, citrus oils, peppermint). The "natural" label is marketing, not safety. Avoid natural fragrance the same as synthetic.',
      },
      {
        q: 'Can my partner’s perfume cause my PD?',
        a: 'Yes — if you share pillows, towels, or close contact, fragrance transfers onto your skin. For severe or stubborn PD, ask household members to switch to fragrance-free products in the bathroom and to avoid perfume in bed for two weeks as a test.',
      },
      {
        q: 'What about essential oils in skincare?',
        a: 'Avoid them during a PD flare. Common offenders include lavender, tea tree, eucalyptus, citrus oils, peppermint, and rosemary. The "essential oils are gentle" claim is unsupported — they are concentrated bioactive molecules and frequent contact allergens.',
      },
      {
        q: 'Should I switch laundry detergent?',
        a: 'Yes, for any stubborn case. Switch to a fragrance-free, dye-free detergent (All Free Clear, Persil Sensitive Skin, Tide Free & Gentle) and skip fabric softener entirely. Wash all bed linens, pillowcases, and face towels in the new detergent before retesting.',
      },
      {
        q: 'How do I find fragrance-free products?',
        a: 'Look for "fragrance-free" on the label and check the ingredient list for "parfum" or "fragrance" — both must be absent. The Vanicream and CeraVe (some variants) lines, Cetaphil Gentle, and La Roche-Posay Toleriane are dependable fragrance-free baselines.',
      },
    ],
    related: ['cinnamic-aldehyde', 'coconut-oil', 'sodium-lauryl-sulfate'],
    productSlugs: ['cetaphil-gentle-cleanser', 'cerave-moisturizing-cream'],
    references: [
      { title: 'Pratt et al — Fragrance allergy and contact dermatitis (J Am Acad Dermatol, 2003)', url: 'https://pubmed.ncbi.nlm.nih.gov/12859245/' },
      { title: 'Tempark et al — Perioral dermatitis: a review (J Dermatolog Treat, 2014)', url: 'https://pubmed.ncbi.nlm.nih.gov/24428802/' },
    ],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'ingredient',
    slug: 'coconut-oil',
    name: 'Coconut Oil',
    aliases: ['cocos nucifera oil', 'cocos nucifera (coconut) oil', 'virgin coconut oil'],
    verdict: 'Caution',
    tone: 'caution',
    metaTitle: 'Coconut Oil and Perioral Dermatitis: Friend or Trigger?',
    metaDescription: 'Coconut oil is heavily marketed as natural and gentle, but for many PD sufferers it triggers flares. Why, and what to use instead.',
    h1: 'Coconut oil and perioral dermatitis',
    directAnswer:
      'Coconut oil is highly comedogenic and a frequently reported perioral dermatitis trigger, despite its "natural" marketing. It traps heat and bacteria against inflamed skin and contains lauric acid, which can disrupt the skin barrier of sensitive faces. Avoid coconut oil — including in lip balm, hair masks, and food residues — until your barrier is fully restored.',
    sections: [
      {
        heading: 'The "natural" myth',
        body: 'Coconut oil is one of the most heavily marketed "natural" skincare ingredients of the last decade. The marketing is not the chemistry: coconut oil is a heavy occlusive saturated with lauric acid, capric acid, and caprylic acid. On healthy skin it can hydrate. On PD-prone, inflamed perioral skin it traps sweat, heat, and bacteria, frequently provoking flares.',
      },
      {
        heading: 'Where it hides',
        body: 'Beyond cooking, coconut oil is in many "natural" lip balms (often as the base), hair masks (drips onto face when applied), DIY skincare recipes, some sunscreens marketed as "reef-safe" or "natural," and gua-sha and oil-cleansing products. It also transfers onto perioral skin from food (coconut curries, coconut milk lattes) — wipe your mouth carefully after eating.',
      },
      {
        heading: 'Comedogenicity and PD',
        body: 'Coconut oil is rated 4 out of 5 on the comedogenicity scale — among the most pore-clogging oils tested. PD is not technically caused by clogged pores, but the same occlusive mechanism that clogs pores traps the inflammatory environment perioral dermatitis thrives in. Lighter, less comedogenic oils (squalane, argan) are safer choices for facial use.',
      },
      {
        heading: 'When (if ever) to reintroduce it',
        body: 'Once your PD has been completely clear for at least three months, you can patch-test coconut oil on the inner forearm for three days, then on one side of the jawline for another three. If both patches stay clear, coconut oil at small doses on body skin (not face) may be tolerable. Most former PD sufferers find reintroduction not worth the risk.',
      },
    ],
    faqs: [
      {
        q: 'Is coconut oil bad for everyone with PD?',
        a: 'Not universally — a minority of PD sufferers tolerate it. But the majority of community reports flag coconut oil as a flare trigger. During an active flare, eliminate it completely. After clearing, patch-test before reintroducing.',
      },
      {
        q: 'Can I eat coconut if I have PD?',
        a: 'Yes — ingested coconut at normal dietary doses is not a documented PD trigger. The issue is topical contact with perioral skin. Wipe your mouth carefully after eating coconut-containing foods to avoid residue contact.',
      },
      {
        q: 'What about MCT oil?',
        a: 'MCT oil is a refined fraction of coconut oil and is generally safer for skin than virgin coconut oil — fewer long-chain saturated fats, less occlusive. But for PD-prone skin during an active flare, avoid both. Consider squalane or jojoba as gentler facial-oil alternatives.',
      },
      {
        q: 'Why is coconut oil in so many "PD-friendly" recipes online?',
        a: 'Because it is cheap, widely available, and assumed safe due to natural-product marketing. The DIY skincare community largely predates and ignores PD-specific evidence. Trust ingredient-by-ingredient analysis, not "all-natural recipe" labels.',
      },
      {
        q: 'Is coconut-derived cocamidopropyl betaine in cleansers also a trigger?',
        a: 'Sometimes. Cocamidopropyl betaine is a coconut-derived surfactant that some PD sufferers react to. It is far gentler than SLS and tolerated by most, but worth eliminating if your PD persists after other swaps.',
      },
    ],
    related: ['petrolatum', 'fragrance'],
    productSlugs: [],
    references: [
      { title: 'DiNardo — Comedogenicity testing of cosmetic ingredients', url: 'https://pubmed.ncbi.nlm.nih.gov/15724850/' },
      { title: 'Tempark et al — Perioral dermatitis: a review (J Dermatolog Treat, 2014)', url: 'https://pubmed.ncbi.nlm.nih.gov/24428802/' },
    ],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'ingredient',
    slug: 'petrolatum',
    name: 'Petrolatum',
    aliases: ['petroleum jelly', 'white petrolatum', 'soft paraffin'],
    verdict: 'Safe',
    tone: 'safe',
    metaTitle: 'Petrolatum and Perioral Dermatitis: One of the Safest Options',
    metaDescription: 'Petrolatum (petroleum jelly) is inert, occlusive, and non-comedogenic — one of the safest barrier ingredients for active PD flares.',
    h1: 'Petrolatum and perioral dermatitis',
    directAnswer:
      'Petrolatum (petroleum jelly) is one of the safest barrier ingredients for perioral dermatitis. It is inert, occlusive, non-comedogenic, and rarely triggers reactions. Pure white petrolatum and Aquaphor Healing Ointment are widely tolerated as overnight occlusives during active flares. Despite "petroleum" sounding industrial, it is well-studied and dermatologist-trusted.',
    sections: [
      {
        heading: 'Why petrolatum is so well tolerated',
        body: 'Petrolatum is a saturated hydrocarbon mixture with no biologically active groups — no hydroxyls, no double bonds, nothing the immune system recognises. This means it cannot trigger an allergic reaction in the way fragrance, essential oils, or proteins can. It sits on top of the skin, traps moisture, and prevents transepidermal water loss without doing anything else.',
      },
      {
        heading: 'How to use it for PD',
        body: 'Apply a thin layer of pure petrolatum or Aquaphor as the last step of your evening routine. It seals in the bland moisturizer underneath and prevents overnight water loss from the inflamed skin. Avoid applying so thickly that it traps heat — a thin slick is enough. Use clean fingers, not a flannel that could harbour bacteria.',
      },
      {
        heading: 'Petrolatum vs alternatives',
        body: 'Pure petrolatum (Vaseline Original) is the cheapest and simplest option. Aquaphor Healing Ointment adds lanolin and ceresin — slightly more emollient but lanolin can trigger a small subset. CeraVe Healing Ointment uses petrolatum plus ceramides — a strong middle ground. For lip-only use, all three work; choose by price and tolerability.',
      },
      {
        heading: 'Common misconceptions',
        body: 'Petrolatum is sometimes wrongly conflated with mineral oil or with industrial petroleum. Cosmetic-grade white petrolatum is a highly purified pharmaceutical ingredient, USP standards, with a long safety record. Concerns about PAH (polycyclic aromatic hydrocarbon) contamination apply only to unrefined petroleum — not to USP white petrolatum used in cosmetics and pharmaceuticals.',
      },
    ],
    faqs: [
      {
        q: 'Is petroleum jelly the same as Vaseline?',
        a: 'Yes — Vaseline Original (the yellow tub) is pure white petrolatum, which is the same as petroleum jelly. The brand "Vaseline" is the original commercial name for petrolatum, dating to 1872. Generic store-brand petroleum jelly is chemically identical.',
      },
      {
        q: 'Will petrolatum clog my pores?',
        a: 'No. Petrolatum is rated 0 (non-comedogenic) on the comedogenicity scale despite being highly occlusive. It is one of the few occlusives that traps moisture without trapping the inflammatory triggers PD reacts to. Its molecular size is too large to enter pores.',
      },
      {
        q: 'Is petrolatum safe for daily long-term use?',
        a: 'Yes. Petrolatum has a 150-year safety record and is on the FDA OTC monograph as a Category I (safe and effective) skin protectant. Daily long-term use as part of a PD recovery routine is supported by dermatology consensus.',
      },
      {
        q: 'Can I use petrolatum on the lips?',
        a: 'Yes — petrolatum is the gold-standard PD-safe lip balm. Aquaphor and Vaseline are both excellent. Avoid flavoured or fragranced petrolatum-based lip products (Vaseline Lip Therapy with cocoa butter or rosy lips) — the additives can trigger PD even when the petrolatum base is fine.',
      },
      {
        q: 'Is "natural" alternatives like beeswax safer than petrolatum?',
        a: 'Generally no. Beeswax can contain residual propolis, which is a known contact allergen. Cocoa butter is comedogenic. Pure petrolatum is more inert than almost any plant-derived alternative. The "natural is safer" instinct is wrong here.',
      },
    ],
    related: ['coconut-oil', 'fragrance'],
    productSlugs: ['eucerin-aquaphor', 'vanicream-moisturizing-cream'],
    references: [
      { title: 'Sethi et al — Moisturizers: the slippery road (Indian J Dermatol, 2016)', url: 'https://pubmed.ncbi.nlm.nih.gov/27688438/' },
      { title: 'Rawlings & Lombard — A review on the extensive skin benefit of mineral oil (Int J Cosmet Sci, 2012)', url: 'https://pubmed.ncbi.nlm.nih.gov/22515370/' },
    ],
    updatedAt: '2026-04-26',
  },
]

export const INGREDIENTS_BY_SLUG: Record<string, IngredientEntry> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.slug, i]),
)

// Used by the result page to deep-link from a matched ingredient name to
// its evergreen content page. Returns null when we don't have a content
// page for that ingredient yet.
export function findIngredientSlugByInciName(inci: string | null | undefined): string | null {
  if (!inci) return null
  const lower = inci.toLowerCase().trim()
  for (const entry of INGREDIENTS) {
    if (entry.name.toLowerCase() === lower) return entry.slug
    if (entry.aliases.some((a) => a.toLowerCase() === lower)) return entry.slug
  }
  return null
}
