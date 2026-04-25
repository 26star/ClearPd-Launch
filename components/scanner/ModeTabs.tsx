'use client'

export type ScanMode = 'camera' | 'upload' | 'paste'

interface ModeTabsProps {
  value: ScanMode
  onChange: (mode: ScanMode) => void
}

const TABS: { value: ScanMode; icon: string; label: string }[] = [
  { value: 'camera', icon: 'photo_camera', label: 'Camera' },
  { value: 'upload', icon: 'image', label: 'Upload' },
  { value: 'paste', icon: 'content_paste', label: 'Paste' },
]

export function ModeTabs({ value, onChange }: ModeTabsProps) {
  return (
    <div
      className="flex gap-1 rounded-2xl p-1 mx-5"
      style={{ background: '#edeeef' }}
      role="tablist"
    >
      {TABS.map(t => {
        const active = value === t.value
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={[
              'flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-medium transition-colors',
              active
                ? 'bg-surface-lowest text-ink shadow-card'
                : 'text-ink-variant',
            ].join(' ')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {t.icon}
            </span>
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
