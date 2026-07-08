'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Loader2, Sparkles } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const LINES = ['line1', 'line2', 'line3', 'line4'] as const

/** Full-screen overlay shown while the mock AI "generates" the result. */
export function AIGeneratingOverlay() {
  const t = useTranslations('studio.ai')
  const [active, setActive] = useState(0)

  // Advance the status lines on a timer for a sense of progress.
  useEffect(() => {
    const id = setInterval(
      () => setActive((n) => Math.min(n + 1, LINES.length - 1)),
      420,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-background/60 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md space-y-6 overflow-hidden p-8 text-center">
        {/* Sheen sweep across the card */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -skew-x-12"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 [animation:glass-sheen_2.4s_var(--ease-out-soft)_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </span>
        <div className="border-primary/25 from-primary/25 to-primary/5 relative mx-auto flex size-16 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-sm">
          <Sparkles className="text-primary size-8" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold">{t('title')}</p>
          <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
        </div>
        <ul className="space-y-2 text-left">
          {LINES.map((line, i) => {
            const done = i < active
            const current = i === active
            return (
              <li
                key={line}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  done || current
                    ? 'text-foreground'
                    : 'text-muted-foreground/50',
                )}
              >
                {done ? (
                  <Check className="text-primary size-4" />
                ) : current ? (
                  <Loader2 className="text-primary size-4 animate-spin" />
                ) : (
                  <span className="border-border size-4 rounded-full border" />
                )}
                {t(line)}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
