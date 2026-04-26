import { ProductEntry } from './types'

export const PRODUCTS: ProductEntry[] = [
  {
    kind: 'product',
    slug: 'vanicream-moisturizing-cream',
    name: 'Vanicream Moisturizing Cream',
    brand: 'Vanicream',
    category: 'moisturizers',
    verdict: 'Safe',
    tone: 'safe',
    metaTitle: 'Is Vanicream Moisturizing Cream Safe for Perioral Dermatitis?',
    metaDescription: 'Vanicream Moisturizing Cream is a community staple for PD — fragrance-free, dye-free, and free of common triggers. Full ingredient breakdown.',
    h1: 'Vanicream Moisturizing Cream and perioral dermatitis',
    directAnswer:
      'Vanicream Moisturizing Cream is one of the most widely tolerated moisturizers for perioral dermatitis. It is free of fragrance, dyes, lanolin, parabens, and formaldehyde — the most common PD triggers in mainstream moisturizers. The minimal ingredient list and petrolatum-based formula make it the community baseline for active flares.',
    sections: [
      {
        heading: 'Why Vanicream is the PD community baseline',
        body: 'Vanicream was developed at the Mayo Clinic specifically for patients with sensitive and reactive skin. The formula deliberately omits the five most common contact allergens flagged by the North American Contact Dermatitis Group: fragrance, dyes, lanolin, parabens, and formaldehyde-releasers. For PD-prone skin, this means there is very little in the tub that can trigger a reaction.',
      },
      {
        heading: 'Key ingredients',
        body: 'The base is petrolatum (a PD-safe occlusive) plus glycerin (a hydrating humectant) and dimethicone (a smoothing emollient). Sorbitol provides additional hydration. The preservatives are mild — propylene glycol and glyceryl monostearate — and tolerated by the vast majority of PD sufferers. No fragrance, no essential oils, no botanical extracts.',
      },
      {
        heading: 'How to use it during a flare',
        body: 'Apply twice daily on damp skin — within 60 seconds of washing — in thin layers. Use clean fingers, not a flannel. During an active flare, this can be your only moisturizer. After the rash clears, you can layer Vanicream under a fragrance-free SPF in the morning and a thin slick of Aquaphor in the evening.',
      },
      {
        heading: 'Trade-offs to know',
        body: 'Vanicream is a richer, slightly heavier cream than gel-textured competitors. Some find it leaves a slight tacky finish for 5-10 minutes after application. There is no scent at all (intentional). It is not the cheapest option, but is widely available in pharmacies and online. The Lite version exists for oilier or summer use.',
      },
    ],
    keyIngredients: [
      { name: 'Petrolatum', verdict: 'Safe', slug: 'petrolatum' },
      { name: 'Glycerin', verdict: 'Safe' },
      { name: 'Dimethicone', verdict: 'Safe' },
      { name: 'Sorbitol', verdict: 'Safe' },
    ],
    faqs: [
      {
        q: 'Is Vanicream really fragrance-free?',
        a: 'Yes — the ingredient list contains no fragrance, parfum, essential oils, or masking fragrances. Vanicream is one of very few moisturizers that meets the strictest "fragrance-free" definition. Hold a sample to your nose and you will smell nothing.',
      },
      {
        q: 'Can I use Vanicream during the worst part of a flare?',
        a: 'Yes — Vanicream is mild enough for active flares. If you are in zero-therapy mode (no topicals at all), wait until you reintroduce moisturizer, and make Vanicream your first reintroduction. Patch-test for three days first as standard practice.',
      },
      {
        q: 'How does Vanicream compare to CeraVe Moisturizing Cream?',
        a: 'Vanicream is fragrance-free; CeraVe Moisturizing Cream contains fragrance and dimethicone in a different ratio. CeraVe has ceramides (a benefit), but the fragrance and other additives are why CeraVe gets mixed PD reports while Vanicream gets consistent green lights.',
      },
      {
        q: 'Where can I buy Vanicream?',
        a: 'Available at most major US pharmacies (CVS, Walgreens), Amazon, and the Vanicream website. In the UK and EU it is harder to find — some search via Amazon import or use La Roche-Posay Toleriane as a comparable substitute.',
      },
      {
        q: 'Is the Vanicream Lite version also PD-safe?',
        a: 'Yes — the Lite version uses the same fragrance-free, dye-free formula with a lighter texture. It is appropriate for oilier skin or summer use. Both versions get the same Safe verdict for PD.',
      },
    ],
    related: ['cerave-moisturizing-cream', 'la-roche-posay-toleriane', 'eucerin-aquaphor'],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'product',
    slug: 'cerave-moisturizing-cream',
    name: 'CeraVe Moisturizing Cream',
    brand: 'CeraVe',
    category: 'moisturizers',
    verdict: 'Caution',
    tone: 'caution',
    metaTitle: 'Is CeraVe Moisturizing Cream Safe for Perioral Dermatitis?',
    metaDescription: 'CeraVe Moisturizing Cream gets mixed PD reports — ceramides help, but fragrance and dimethicone trigger some. Patch-test before using.',
    h1: 'CeraVe Moisturizing Cream and perioral dermatitis',
    directAnswer:
      'CeraVe Moisturizing Cream gets mixed reports from PD sufferers. The ceramides and hyaluronic acid genuinely help support the skin barrier, but the formula contains fragrance and dimethicone — both of which trigger flares for a subset of users. Patch-test for three days on the inner forearm before face application, and consider Vanicream as a safer first choice.',
    sections: [
      {
        heading: 'The good: ceramides and barrier repair',
        body: 'CeraVe’s defining feature is its ceramide content — three ceramides (1, 3, and 6-II) plus cholesterol and fatty acids that mimic the skin’s natural lipid matrix. For barrier-compromised PD skin, this lipid-replenishing approach has real biological rationale. The MVE (multi-vesicular emulsion) delivery system extends release over hours.',
      },
      {
        heading: 'The caveat: fragrance and additives',
        body: 'The CeraVe Moisturizing Cream ingredient list includes "fragrance" and a relatively long list of preservatives, emulsifiers, and humectants. For most healthy skin this is unproblematic. For PD-prone skin in active flare, fragrance is a documented trigger and dimethicone (while inert) creates an occlusive layer that can trap heat and bacteria.',
      },
      {
        heading: 'Who tolerates it, who doesn’t',
        body: 'CeraVe Moisturizing Cream tends to be tolerated by people in PD maintenance phase (rash mostly clear, occasional minor flares), and not tolerated during active flares. If you want CeraVe’s ceramide benefit during recovery, switch to CeraVe Healing Ointment (no fragrance, petrolatum-based, also has ceramides) — that earns a Safe verdict.',
      },
      {
        heading: 'How to test it on yourself',
        body: 'Patch-test on the inner forearm twice daily for three days. If clear, move to one side of the jawline for another three days. Only after six clean days is it safe for full-face use. If at any point you see new redness, papules, or itching, abort and switch to Vanicream or La Roche-Posay Toleriane.',
      },
    ],
    keyIngredients: [
      { name: 'Ceramides 1, 3, 6-II', verdict: 'Safe' },
      { name: 'Hyaluronic Acid', verdict: 'Safe' },
      { name: 'Dimethicone', verdict: 'Caution' },
      { name: 'Fragrance / Parfum', verdict: 'Avoid', slug: 'fragrance' },
    ],
    faqs: [
      {
        q: 'Why does CeraVe contain fragrance?',
        a: 'It is a formulation choice — fragrance masks the underlying smell of the lipids and emulsifiers. CeraVe’s "Fragrance Free" is a separate product line; check the label carefully. The fragrance-free CeraVe variants (e.g. CeraVe Healing Ointment) are PD-safer than the Moisturizing Cream.',
      },
      {
        q: 'Are ceramides actually helpful for PD?',
        a: 'Yes — ceramides support the skin lipid barrier, which is impaired in PD. The benefit is real but separable from the rest of the CeraVe Moisturizing Cream formula. You can get ceramides without fragrance via CeraVe Healing Ointment or some prescription barrier creams.',
      },
      {
        q: 'Is CeraVe Healing Ointment safer than the cream?',
        a: 'Yes. CeraVe Healing Ointment is petrolatum-based, fragrance-free, and contains ceramides — combining the safety of Aquaphor with the benefit of ceramides. For PD recovery, it is a stronger choice than the standard Moisturizing Cream.',
      },
      {
        q: 'How does CeraVe compare to Vanicream?',
        a: 'Vanicream is fragrance-free with no botanical or active additives — safer baseline. CeraVe has ceramides (real benefit) but adds fragrance and a longer ingredient list (more risk). For active PD flares, Vanicream wins. For maintenance with intact skin, CeraVe is a reasonable choice if patch-tested.',
      },
      {
        q: 'Does the CeraVe lotion or cream version matter?',
        a: 'Both CeraVe Moisturizing Cream and Moisturizing Lotion contain fragrance and similar additives. The cream is heavier (better for dry winter skin); the lotion absorbs faster. Same Caution verdict for both during PD flares.',
      },
    ],
    related: ['vanicream-moisturizing-cream', 'la-roche-posay-toleriane', 'eucerin-aquaphor'],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'product',
    slug: 'cetaphil-gentle-cleanser',
    name: 'Cetaphil Gentle Skin Cleanser',
    brand: 'Cetaphil',
    category: 'cleansers',
    verdict: 'Safe',
    tone: 'safe',
    metaTitle: 'Is Cetaphil Gentle Skin Cleanser Safe for Perioral Dermatitis?',
    metaDescription: 'Cetaphil Gentle was reformulated — no more parabens or SLS, now with niacinamide and a gentler surfactant. Widely tolerated by PD sufferers.',
    h1: 'Cetaphil Gentle Skin Cleanser and perioral dermatitis',
    directAnswer:
      'Cetaphil Gentle Skin Cleanser is one of the safest cleansers for perioral dermatitis after its recent reformulation. Sodium lauryl sulfate and parabens are gone; the new formula uses sodium cocoyl isethionate (a gentle surfactant), niacinamide, and glycerin. Older bottles still circulating may carry the previous formula, so always check the ingredient list before buying.',
    sections: [
      {
        heading: 'The reformulation changed the safety story',
        body: 'Cetaphil Gentle Skin Cleanser was reformulated in recent years. The old formula contained sodium lauryl sulfate, parabens (methyl-, propyl-, butylparaben), and stearyl alcohol — minor triggers for a subset of PD sufferers. The new formula drops all of those and adds niacinamide, panthenol, and a milder surfactant. The brand name is the same; the ingredient profile is materially different.',
      },
      {
        heading: 'What’s in the new formula',
        body: 'The current ingredient list is short: water, glycerin, cetearyl alcohol, panthenol, niacinamide, pantolactone, xanthan gum, sodium cocoyl isethionate, sodium benzoate, citric acid. Sodium cocoyl isethionate is a coconut-derived surfactant much gentler than SLS — it cleans without stripping the skin barrier. Sodium benzoate replaces parabens as the preservative. Both are well tolerated by PD-prone skin.',
      },
      {
        heading: 'How to use it during a flare',
        body: 'Once daily at night. Apply with fingertips, massage gently for under 30 seconds, rinse thoroughly with lukewarm water. Pat dry — never rub — with a clean soft towel. In the morning, water-only is sufficient on a PD-prone face. Over-cleansing is a more common contributor to chronic PD than under-cleansing.',
      },
      {
        heading: 'Older bottles on shelves',
        body: 'Retailers and pharmacies often keep older stock for months. Before buying, check the back-of-pack ingredient list. If you see sodium lauryl sulfate, methylparaben, propylparaben, or butylparaben, the bottle is the old formula — still tolerated by most, but reach for a fresher box if you are mid-flare. The new formula will read like the list above (water → glycerin → cetearyl alcohol → niacinamide).',
      },
    ],
    keyIngredients: [
      { name: 'Sodium Cocoyl Isethionate', verdict: 'Safe' },
      { name: 'Niacinamide', verdict: 'Safe' },
      { name: 'Glycerin', verdict: 'Safe' },
      { name: 'Panthenol (Pro-Vitamin B5)', verdict: 'Safe' },
    ],
    faqs: [
      {
        q: 'Why did Cetaphil reformulate?',
        a: 'Industry pressure on parabens and SLS in sensitive-skin products built over years. Cetaphil quietly updated the Gentle Skin Cleanser to drop both and add modern barrier ingredients (niacinamide, panthenol). The brand name and packaging stayed similar, so the change is easy to miss.',
      },
      {
        q: 'Does the new Cetaphil contain SLS or parabens?',
        a: 'No. The current formula is sodium-lauryl-sulfate-free and paraben-free. The cleansing surfactant is sodium cocoyl isethionate (coconut-derived, gentler) and the preservative is sodium benzoate. Always confirm by reading the ingredient list — older bottles in stock may still carry the previous formula.',
      },
      {
        q: 'How do I tell if I have the new formula?',
        a: 'Read the back of the bottle. The new formula starts with water, glycerin, cetearyl alcohol, panthenol, niacinamide. The old formula listed sodium lauryl sulfate and methylparaben/propylparaben/butylparaben. If you see those, you have an older bottle.',
      },
      {
        q: 'Cetaphil vs CeraVe vs La Roche-Posay for PD today?',
        a: 'For cleansers, all three are PD-friendly post-reformulation. New-formula Cetaphil and La Roche-Posay Toleriane Hydrating Cleanser are the lightest options. CeraVe Hydrating Cleanser adds ceramides but is slightly heavier. Choose by texture preference — they’re all safe.',
      },
      {
        q: 'Is the niacinamide in the new formula a problem?',
        a: 'No — niacinamide is widely tolerated and is a recognised barrier-supporting ingredient at the concentrations used in cleansers (where contact time is brief). A small subset of PD sufferers report sensitivity to high-concentration leave-on niacinamide serums, but in a wash-off cleanser it is fine.',
      },
    ],
    related: ['vanicream-moisturizing-cream', 'la-roche-posay-toleriane'],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'product',
    slug: 'la-roche-posay-toleriane',
    name: 'La Roche-Posay Toleriane',
    brand: 'La Roche-Posay',
    category: 'moisturizers',
    verdict: 'Safe',
    tone: 'safe',
    metaTitle: 'Is La Roche-Posay Toleriane Safe for Perioral Dermatitis?',
    metaDescription: 'La Roche-Posay Toleriane is dermatologist-trusted for reactive skin — minimalist, ceramide-rich, fragrance-free. Widely tolerated by PD sufferers.',
    h1: 'La Roche-Posay Toleriane and perioral dermatitis',
    directAnswer:
      'La Roche-Posay Toleriane Double Repair is one of the most reliably PD-safe moisturizers on the market. The minimalist formula is fragrance-free, contains ceramides and niacinamide for barrier support, and was specifically engineered for reactive skin. Widely tolerated by PD sufferers across community reports, with the European dermatology pedigree to back it up.',
    sections: [
      {
        heading: 'The dermatologist-grade option',
        body: 'La Roche-Posay is owned by L\'Oréal and developed in partnership with French dermatologists for sensitive and reactive skin types. The Toleriane line is the most stripped-back of all their products — fewer ingredients, fewer preservatives, no fragrance, no essential oils. For PD-prone skin, this minimalist philosophy is exactly what reduces flare risk.',
      },
      {
        heading: 'Key ingredients that earn the verdict',
        body: 'The active barrier-repair ingredients are ceramide-3 (lipid-replenishing), niacinamide (anti-inflammatory), and glycerin (humectant). The base is light, water-in-silicone, with a short emollient profile. La Roche-Posay\'s thermal spring water adds selenium, which has supportive anti-inflammatory data, though the clinical relevance for PD is modest.',
      },
      {
        heading: 'How it compares to Vanicream',
        body: 'Vanicream is more occlusive (better for very dry winter skin), Toleriane is lighter and absorbs faster (better under sunscreen, summer use, oilier PD). Both are fragrance-free and PD-safe. Vanicream is cheaper; Toleriane has the ceramide benefit. Many PD sufferers rotate between them seasonally.',
      },
      {
        heading: 'How to use it',
        body: 'Twice daily on damp skin. Layer under fragrance-free SPF in the morning and under a thin slick of Aquaphor at night during a flare. Once your PD has cleared, Toleriane alone is usually enough. Patch-test on the inner forearm for three days before face use as standard practice.',
      },
    ],
    keyIngredients: [
      { name: 'Ceramide-3', verdict: 'Safe' },
      { name: 'Niacinamide', verdict: 'Safe' },
      { name: 'Glycerin', verdict: 'Safe' },
      { name: 'La Roche-Posay Thermal Spring Water', verdict: 'Safe' },
    ],
    faqs: [
      {
        q: 'Which Toleriane variant is best for PD?',
        a: 'Toleriane Double Repair Face Moisturizer is the community favourite — ceramides, niacinamide, no fragrance. Toleriane Sensitive Fluide is also excellent and lighter for oily PD skin. Avoid the Toleriane Ultra Eye variant for face use; it is formulated specifically for periocular skin.',
      },
      {
        q: 'Is La Roche-Posay actually fragrance-free?',
        a: 'The Toleriane line is fragrance-free. Many other La Roche-Posay products do contain fragrance (Effaclar, Cicaplast, Anthelios sunscreens vary). Always check the specific product\'s ingredient list — La Roche-Posay\'s lineup is large and not uniformly PD-safe.',
      },
      {
        q: 'Where can I buy La Roche-Posay Toleriane?',
        a: 'Major pharmacies in Europe, UK, US (Target, CVS, Walgreens), Canada, Australia, and online via Amazon, Sephora, Boots, and the La Roche-Posay website. Pricing varies significantly by region — UK/EU is usually cheaper than US.',
      },
      {
        q: 'Toleriane vs CeraVe — which for PD?',
        a: 'Toleriane wins for active flares — fragrance-free with ceramides. CeraVe Moisturizing Cream contains fragrance, which makes it riskier during a flare. CeraVe Healing Ointment (the petrolatum-based one) is comparable to Toleriane but heavier; choose by texture preference.',
      },
      {
        q: 'Is the Toleriane sunscreen also PD-safe?',
        a: 'Mixed. Anthelios Toleriane sunscreens are designed for sensitive skin but contain chemical filters (avobenzone, octocrylene). For PD, prefer mineral zinc-oxide options. La Roche-Posay does make mineral SPF (Anthelios Mineral One), which is the safer choice.',
      },
    ],
    related: ['vanicream-moisturizing-cream', 'cerave-moisturizing-cream', 'eucerin-aquaphor'],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'product',
    slug: 'eucerin-aquaphor',
    name: 'Aquaphor Healing Ointment',
    brand: 'Aquaphor (Eucerin)',
    category: 'moisturizers',
    verdict: 'Caution',
    tone: 'caution',
    metaTitle: 'Is Aquaphor Safe for Perioral Dermatitis? Use With Caution',
    metaDescription: 'Aquaphor Healing Ointment is petrolatum-based but contains lanolin alcohol — a known PD trigger for some. Patch-test before regular use.',
    h1: 'Aquaphor Healing Ointment and perioral dermatitis',
    directAnswer:
      'Aquaphor Healing Ointment is petrolatum-based and tolerated by some PD sufferers as an overnight barrier sealant. However, it contains lanolin alcohol — a documented PD trigger for a meaningful subset — and the heavy occlusion of the formula can trap bacteria and worsen flares for many. Patch-test for three days on the inner forearm before applying to the face. If you have any known wool or lanolin sensitivity, skip it and reach for pure Vaseline instead.',
    sections: [
      {
        heading: 'What’s in it, and why the caution',
        body: 'Aquaphor is 41% petrolatum plus mineral oil, ceresin (mineral wax), lanolin alcohol, panthenol, glycerin, and bisabolol. Lanolin alcohol is the meaningful PD-relevant ingredient — it is a documented contact allergen and a frequently reported PD trigger. The heavy occlusion of the overall formula also traps heat, sweat, and bacteria against an inflamed barrier, which can prolong flares even when no specific allergen is at play.',
      },
      {
        heading: 'If you choose to use it',
        body: 'Apply only as an overnight occlusive on a thoroughly cleansed face, after a bland moisturizer. Use a pea-sized amount for the entire perioral area — over-application is the most common cause of an Aquaphor-related flare. Sleep on a clean pillowcase, and remove residue at the next morning’s wash. Never layer under makeup or sunscreen. Stop immediately if you see new redness, papules, or itching.',
      },
      {
        heading: 'When NOT to use it',
        body: 'Skip Aquaphor entirely if you have any known wool/lanolin sensitivity, an oozing or weeping flare (occlusion can worsen secondary infection), or no clear baseline because you started multiple new products at once. Pure Vaseline (100% petrolatum) is the gentler alternative — same occlusive function without the lanolin allergen.',
      },
      {
        heading: 'Aquaphor variants and what to know',
        body: 'Aquaphor Healing Ointment (the original blue-and-white tub) is what most PD sufferers mean. Aquaphor Lip Repair is the same formula in a stick. Aquaphor Baby Healing Ointment is identical to the original. Avoid Aquaphor "Soothing Skin Balm" with marigold and any flavoured variants — botanical extracts and flavourings add additional PD risk on top of the existing lanolin caution.',
      },
    ],
    keyIngredients: [
      { name: 'Petrolatum (41%)', verdict: 'Caution', slug: 'petrolatum' },
      { name: 'Mineral Oil', verdict: 'Safe' },
      { name: 'Lanolin Alcohol', verdict: 'Avoid' },
      { name: 'Panthenol (Pro-Vitamin B5)', verdict: 'Safe' },
      { name: 'Bisabolol', verdict: 'Safe' },
    ],
    faqs: [
      {
        q: 'Is Aquaphor the same as Vaseline?',
        a: 'Related but not identical. Vaseline is 100% petrolatum. Aquaphor is 41% petrolatum plus mineral oil, lanolin alcohol, panthenol, glycerin, and bisabolol. Aquaphor is more emollient; Vaseline is purer and cheaper. For PD-prone skin, Vaseline is the safer first choice — Aquaphor adds the lanolin alcohol risk.',
      },
      {
        q: 'Can I use Aquaphor on my lips?',
        a: 'Lip use is the most-tolerated application — the lip vermilion is not the perioral skin where PD flares. Aquaphor Lip Repair (same formula in a stick) is widely accepted on the lips themselves. Avoid spreading it onto the perioral skin around the lips, especially during an active flare.',
      },
      {
        q: 'Is the lanolin in Aquaphor really a problem?',
        a: 'For a meaningful subset of PD sufferers, yes. Lanolin and lanolin alcohol are documented contact allergens and frequent PD triggers. If your PD persists or worsens after starting Aquaphor, swap to pure Vaseline for two weeks as a diagnostic test. If your PD clears, lanolin is in your trigger profile.',
      },
      {
        q: 'Should I use Aquaphor under makeup?',
        a: 'No — its slick, tacky finish disrupts foundation adhesion and traps it against the skin, which compounds the occlusion problem. Save it for overnight use only. During the day, use Vanicream or La Roche-Posay Toleriane as your moisturizer base.',
      },
      {
        q: 'How much Aquaphor per application?',
        a: 'A pea-sized amount for the entire perioral area is plenty — possibly less. Over-application is the single biggest contributor to Aquaphor-related flares: the heavy, sticky layer traps heat and bacteria. A thin slick is the right amount; if you can see a visible film, you used too much.',
      },
    ],
    related: ['vanicream-moisturizing-cream', 'la-roche-posay-toleriane', 'cerave-moisturizing-cream'],
    updatedAt: '2026-04-26',
  },

  {
    kind: 'product',
    slug: 'colgate-total',
    name: 'Colgate Total',
    brand: 'Colgate',
    category: 'toothpaste',
    verdict: 'Avoid',
    tone: 'tertiary',
    metaTitle: 'Is Colgate Total Safe for Perioral Dermatitis?',
    metaDescription: 'Colgate Total contains SLS and fluoride — two of the strongest PD triggers. Why to switch and what SLS-free alternatives to use instead.',
    h1: 'Colgate Total and perioral dermatitis',
    directAnswer:
      'Colgate Total is not a good choice for active perioral dermatitis. It contains sodium lauryl sulfate (SLS), fluoride, and fragrance flavouring — three of the most consistently reported PD triggers. For PD sufferers, switching to an SLS-free toothpaste like Sensodyne Pronamel or Hello Naturally for two weeks is one of the highest-yield single changes you can make.',
    sections: [
      {
        heading: 'What\'s in Colgate Total that affects PD',
        body: 'Colgate Total contains sodium lauryl sulfate (the main foaming agent and a documented PD trigger), sodium fluoride or stannous fluoride (an additional trigger for a subset), flavour (typically a mint blend that can include peppermint or spearmint oil), and historically triclosan analogues (now reformulated, but check the label). The combination affects perioral skin twice daily for years.',
      },
      {
        heading: 'Why toothpaste is the highest-yield swap',
        body: 'Toothpaste foam contacts perioral skin twice a day with every brush. The combination of SLS (barrier disruption) and fluoride (inflammatory trigger for some) deposits directly on the most PD-vulnerable area of the face. For sufferers where Colgate Total is the trigger, switching alone clears the rash within two weeks — no other intervention needed.',
      },
      {
        heading: 'SLS-free alternatives that actually work',
        body: 'Sensodyne Pronamel (SLS-free, fluoride included), Hello Naturally Whitening (SLS-free, fluoride options), Tom\'s of Maine SLS-free range, Marvis (Italian, SLS-free), and Davids Premium Natural. All are widely available and similar in price. If you also suspect fluoride, try Tom\'s of Maine Fluoride-Free or Hello Antiplaque Fluoride-Free for two weeks.',
      },
      {
        heading: 'Brushing habits that reduce contact',
        body: 'Use a small amount — pea-sized, not the long toothpaste-strip from adverts. Wipe perioral skin with a clean damp cloth immediately after brushing to remove foam residue. Do not let toothpaste sit on the skin between brush strokes. These habits alone reduce PD trigger exposure even if you cannot switch toothpaste.',
      },
    ],
    keyIngredients: [
      { name: 'Sodium Lauryl Sulfate', verdict: 'Avoid', slug: 'sodium-lauryl-sulfate' },
      { name: 'Sodium Fluoride', verdict: 'Caution', slug: 'fluoride' },
      { name: 'Flavor (mint blend)', verdict: 'Caution' },
      { name: 'PVM/MA Copolymer', verdict: 'Caution' },
    ],
    faqs: [
      {
        q: 'Will switching from Colgate Total really clear my PD?',
        a: 'For toothpaste-driven PD, yes — often within two weeks. For PD with multiple triggers (toothpaste plus skincare plus laundry), the toothpaste swap alone may improve but not clear. Run the swap as a two-week diagnostic; you will quickly know whether toothpaste is your primary trigger.',
      },
      {
        q: 'Are all Colgate products bad for PD?',
        a: 'Most contain SLS. Colgate Sensitive Pro-Relief Whitening is one variant that is SLS-free in some markets — check the local label. The general rule: any toothpaste that produces a lot of foam contains SLS or a similar surfactant, and is risky for PD-prone skin.',
      },
      {
        q: 'Does Colgate cause cavities at higher rates?',
        a: 'No — Colgate Total is effective at cavity prevention. The PD verdict is purely about perioral skin reaction, not dental health. SLS-free toothpaste with fluoride (Sensodyne Pronamel) protects teeth equally well while removing the perioral skin trigger.',
      },
      {
        q: 'Is Colgate triclosan-free now?',
        a: 'Yes, in most markets. Colgate reformulated Total to remove triclosan in 2019 in the US and earlier in some other markets. The current formula is triclosan-free, though it retains SLS and fluoride. Check your local label as formulations vary by region.',
      },
      {
        q: 'How long should I run the toothpaste swap test?',
        a: 'Two weeks minimum — long enough to see clear directional change, short enough to be practical. If you see improvement by day seven and substantial clearing by day fourteen, toothpaste is your trigger. If no change by day fourteen, look elsewhere.',
      },
    ],
    related: ['vanicream-moisturizing-cream', 'cetaphil-gentle-cleanser'],
    updatedAt: '2026-04-26',
  },
]

export const PRODUCTS_BY_SLUG: Record<string, ProductEntry> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
)
