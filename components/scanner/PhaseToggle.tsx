'use client'

import { Phase } from '@/lib/scanner/types'

interface PhaseToggleProps {
  value: Phase
  onChange: (phase: Phase) => void
}

const OPTIONS: { value: Phase; label: string; sublabel: string }[] = [
  { value: 'active', label: 'Active flare', sublabel: 'Currently broken out' },
  { value: 'maintenance', label: 'Maintenance', sublabel: 'Skin clear, preventing' },
  { value: 'any', label: 'Any', sublabel: 'Show all data' },
]

export function PhaseToggle({ value, onChange }: PhaseToggleProps) {
  return (
    <div className="px-5">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-outline mb-2">
        Your phase
      </div>
      <div
        className="grid grid-cols-3 gap-1 rounded-full bg-surface-container/70 p-1"
        role="radiogroup"
        aria-label="Perioral dermatitis phase"
      >
        {OPTIONS.map(opt => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={[
                'rounded-full py-2 px-2 text-[12px] font-medium tracking-wide transition-colors',
                active
                  ? 'bg-surface-lowest text-ink shadow-card'
                  : 'text-ink-variant hover:text-ink',
              ].join(' ')}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
