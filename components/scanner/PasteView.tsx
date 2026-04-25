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
      <div className="rounded-3xl bg-surface-lowest border border-outline-variant/40 p-1 shadow-card">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Aqua, Glycerin, Niacinamide, Sodium Lauryl Sulfate, Phenoxyethanol&hellip;"
          rows={8}
          className="w-full resize-none rounded-3xl bg-transparent p-4 text-sm font-sans leading-relaxed placeholder:text-outline focus:outline-none"
        />
      </div>

      <p className="text-xs text-ink-variant px-1">
        Paste from a website, manufacturer&rsquo;s page, or type it out. Commas, semicolons, and bullets all work.
      </p>

      <button
        type="button"
        onClick={() => onText(text)}
        disabled={!ready || busy}
        className="w-full rounded-2xl bg-primary text-primary-on font-medium py-4 disabled:opacity-40 transition-opacity"
      >
        {busy ? 'Analyzing…' : 'Analyze Safety'}
      </button>
    </div>
  )
}
