'use client'

import { useState } from 'react'

interface PasteViewProps {
  onText: (rawText: string) => void
  busy: boolean
}

export function PasteView({ onText, busy }: PasteViewProps) {
  const [text, setText] = useState('')

  const ready = text.trim().length >= 5

  return (
    <div className="px-5 space-y-3">
      <div className="rounded-3xl bg-surface-lowest ring-1 ring-outline-variant/30 px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste ingredients or search a product"
          rows={5}
          className="w-full resize-none bg-transparent border-0 outline-none text-[18px] sm:text-[20px] tracking-[-0.01em] text-ink placeholder:text-outline-variant placeholder:font-light caret-secondary leading-relaxed"
        />

        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-outline">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }} aria-hidden>
              info
            </span>
            Commas, semicolons, or bullets all work
          </span>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => onText(text)}
            disabled={!ready || busy}
            className={[
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium tracking-wide transition',
              ready && !busy
                ? 'bg-primary text-primary-on hover:opacity-90'
                : 'bg-surface-container text-outline cursor-not-allowed',
            ].join(' ')}
          >
            {busy ? 'Analyzing…' : 'Analyze Safety'}
            {!busy && (
              <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
                arrow_forward
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
