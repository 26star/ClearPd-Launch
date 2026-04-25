'use client'

import { useState } from 'react'
import { MatchedIngredient } from '@/lib/scanner/types'

interface IngredientListProps {
  ingredients: MatchedIngredient[]
}

export function IngredientList({ ingredients }: IngredientListProps) {
  const [expanded, setExpanded] = useState(false)

  if (ingredients.length === 0) return null

  return (
    <div className="rounded-3xl bg-surface-lowest border border-outline-variant/40 shadow-card">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4"
        aria-expanded={expanded}
      >
        <div className="text-left">
          <div className="font-serif text-lg text-ink">All ingredients</div>
          <div className="text-xs text-ink-variant mt-0.5">
            {ingredients.length} detected
          </div>
        </div>
        <span
          className="material-symbols-outlined text-ink-variant"
          style={{ fontSize: 24 }}
        >
          {expanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-1.5">
          {ingredients.map((ing, i) => (
            <IngredientRow key={i} ingredient={ing} />
          ))}
        </div>
      )}
    </div>
  )
}

function IngredientRow({ ingredient }: { ingredient: MatchedIngredient }) {
  const matched = ingredient.ingredient_id !== null
  const confPct = Math.round(ingredient.confidence * 100)

  return (
    <div className="flex items-center justify-between py-2 border-b border-outline-variant/30 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-ink truncate">
          {matched ? ingredient.display_name : ingredient.raw_token}
        </div>
        {matched && ingredient.method !== 'exact' && (
          <div className="text-[10px] text-outline mt-0.5">
            matched as &ldquo;{ingredient.raw_token}&rdquo;
          </div>
        )}
      </div>
      <div className="ml-3 shrink-0">
        {matched ? (
          <span className="text-[10px] font-medium uppercase tracking-wider text-safe">
            {confPct}% match
          </span>
        ) : (
          <span className="text-[10px] font-medium uppercase tracking-wider text-outline">
            unrecognized
          </span>
        )}
      </div>
    </div>
  )
}
