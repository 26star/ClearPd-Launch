'use client'

import { IngredientVerdict } from '@/lib/scanner/types'
import { TIER_STYLES } from './tierStyles'

interface FlaggedIngredientsProps {
  flagged: IngredientVerdict[]
  helpful: IngredientVerdict[]
}

export function FlaggedIngredients({ flagged, helpful }: FlaggedIngredientsProps) {
  if (flagged.length === 0 && helpful.length === 0) return null

  return (
    <div className="space-y-3">
      {flagged.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-outline px-1 mb-2">
            Flagged
          </div>
          <div className="space-y-2">
            {flagged.map(ing => (
              <Row key={ing.ingredient_id} ingredient={ing} />
            ))}
          </div>
        </div>
      )}

      {helpful.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-outline px-1 mb-2">
            Helpful for PD
          </div>
          <div className="space-y-2">
            {helpful.map(ing => (
              <Row key={ing.ingredient_id} ingredient={ing} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ ingredient }: { ingredient: IngredientVerdict }) {
  const style = TIER_STYLES[ingredient.tier]

  return (
    <div className="rounded-2xl bg-surface-lowest border border-outline-variant/40 p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div
          className={[
            'shrink-0 w-9 h-9 rounded-full flex items-center justify-center',
            style.bg,
          ].join(' ')}
        >
          <span
            className={['material-symbols-outlined', style.text].join(' ')}
            style={{ fontSize: 20 }}
          >
            {style.icon}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="font-medium text-ink truncate">
              {ingredient.display_name}
            </div>
            <span
              className={[
                'shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full',
                style.pill,
              ].join(' ')}
            >
              {style.label}
            </span>
          </div>
          <p className="text-xs text-ink-variant mt-1 leading-relaxed">
            {ingredient.why}
          </p>
          <div className="text-[10px] text-outline mt-2 uppercase tracking-wider font-medium">
            {ingredient.observations_count} community observation
            {ingredient.observations_count === 1 ? '' : 's'}
          </div>
        </div>
      </div>
    </div>
  )
}
