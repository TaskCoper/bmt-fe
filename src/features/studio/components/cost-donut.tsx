'use client'

import { useTranslations } from 'next-intl'
import { budgetShares } from '../services/studio.service'
import type { BudgetBreakdown } from '../types/studio.types'

/** Color per cost portion (semantic chart tokens defined in globals.css). */
const SEGMENTS = [
  { key: 'rough', color: 'var(--chart-1)' },
  { key: 'finishing', color: 'var(--chart-2)' },
  { key: 'interior', color: 'var(--chart-3)' }
] as const

/** Hand-rolled SVG donut showing the 3-portion cost structure (step 4E). */
export function CostDonut({ budget }: { budget: BudgetBreakdown }) {
  const t = useTranslations('studio.budget')
  const shares = budgetShares(budget)

  const radius = 60
  const circumference = 2 * Math.PI * radius

  // Precompute each segment's dash + cumulative offset (no mutation in render).
  const arcs = SEGMENTS.map((seg, i) => {
    const dash = shares[seg.key] * circumference
    const offset = SEGMENTS.slice(0, i).reduce((sum, p) => sum + shares[p.key], 0) * circumference
    return { ...seg, dash, offset }
  })

  return (
    <div className='flex flex-col items-center gap-4 sm:flex-row'>
      <svg viewBox='0 0 160 160' className='size-40 -rotate-90' role='img' aria-label={t('donutLabel')}>
        {arcs.map((arc) => (
          <circle
            key={arc.key}
            cx={80}
            cy={80}
            r={radius}
            fill='none'
            stroke={arc.color}
            strokeWidth={20}
            strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
            strokeDashoffset={-arc.offset}
          />
        ))}
      </svg>

      <ul className='space-y-2'>
        {SEGMENTS.map((seg) => (
          <li
            key={seg.key}
            className='border-glass-border bg-background/40 flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm backdrop-blur-sm'
          >
            <span
              className='size-3 shrink-0 rounded-full ring-1 ring-black/5 ring-inset'
              style={{ backgroundColor: seg.color }}
            />
            <span className='font-medium'>{t(`portion.${seg.key}`)}</span>
            <span className='text-muted-foreground tracking-tight tabular-nums'>
              {Math.round(shares[seg.key] * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
