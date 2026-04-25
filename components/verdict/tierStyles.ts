import { VerdictTier } from '@/lib/scanner/types'

export interface TierStyle {
  label: string
  icon: string                    // Material Symbols name
  bg: string                      // Tailwind classes
  text: string                    // Tailwind classes
  card: string                    // Card surface variant
  cardText: string
  pill: string
}

export const TIER_STYLES: Record<VerdictTier, TierStyle> = {
  helpful: {
    label: 'Helpful',
    icon: 'verified',
    bg: 'bg-safe-bg',
    text: 'text-safe',
    card: 'bg-safe-bg',
    cardText: 'text-safe',
    pill: 'bg-safe text-white',
  },
  safe: {
    label: 'Safe',
    icon: 'check_circle',
    bg: 'bg-safe-bg',
    text: 'text-safe',
    card: 'bg-surface-lowest',
    cardText: 'text-ink',
    pill: 'bg-safe-bg text-safe',
  },
  caution: {
    label: 'Caution',
    icon: 'warning',
    bg: 'bg-tertiary/10',
    text: 'text-tertiary',
    card: 'bg-surface-lowest',
    cardText: 'text-ink',
    pill: 'bg-tertiary/10 text-tertiary',
  },
  avoid: {
    label: 'Avoid',
    icon: 'block',
    bg: 'bg-primary',
    text: 'text-primary-on',
    card: 'bg-primary',
    cardText: 'text-primary-on',
    pill: 'bg-tertiary text-white',
  },
  insufficient_data: {
    label: 'Not enough data',
    icon: 'help',
    bg: 'bg-surface-container',
    text: 'text-ink-variant',
    card: 'bg-surface-low',
    cardText: 'text-ink',
    pill: 'bg-surface-container text-ink-variant',
  },
}
