import { Tone, Verdict } from '@/lib/content/types'

const DOT: Record<Tone, string> = {
  safe: 'bg-safe',
  caution: 'bg-tertiary/70',
  tertiary: 'bg-tertiary',
}

export function VerdictPill({
  verdict,
  tone,
}: {
  verdict: Verdict
  tone: Tone
  size?: 'sm' | 'md'
}) {
  return (
    <span className="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-variant">
      <span
        className={`block w-1.5 h-1.5 rounded-full ${DOT[tone]}`}
        aria-hidden
      />
      {verdict}
    </span>
  )
}
