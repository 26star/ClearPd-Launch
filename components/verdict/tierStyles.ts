import { VerdictTier } from '@/lib/scanner/types'

export interface TierStyle {
  label: string
  dot: string                     // Tailwind bg-* for the 6px status dot
  card: string                    // Card surface variant
  cardText: string
}

export const TIER_STYLES: Record<VerdictTier, TierStyle> = {
  helpful: {
    label: 'Helpful',
    dot: 'bg-safe',
    card: 'bg-safe-bg',
    cardText: 'text-safe',
  },
  safe: {
    label: 'Safe',
    dot: 'bg-safe',
    card: 'bg-surface-lowest',
    cardText: 'text-ink',
  },
  caution: {
    label: 'Caution',
    dot: 'bg-tertiary/70',
    card: 'bg-surface-lowest',
    cardText: 'text-ink',
  },
  avoid: {
    label: 'Avoid',
    dot: 'bg-tertiary',
    card: 'bg-primary',
    cardText: 'text-primary-on',
  },
  insufficient_data: {
    label: 'Not enough data',
    dot: 'bg-outline',
    card: 'bg-surface-low',
    cardText: 'text-ink',
  },
}
