'use client'

import { useTranslations } from 'next-intl'
import type { Budget } from '../../types/ai-design-result.types'

const SEGMENTS = [
  { key: 'rough', color: 'var(--chart-1)' },
  { key: 'finishing', color: 'var(--chart-2)' },
  { key: 'interior', color: 'var(--chart-3)' }
] as const

interface AIDesignResultDonutProps {
  budget: Budget
}

/**
 * Hand-rolled SVG donut for the 3-portion cost breakdown.
 * Uses semantic chart tokens so light/dark modes work automatically.
 */
export function AIDesignResultDonut({ budget }: AIDesignResultDonutProps) {
  const t = useTranslations('project.form.aiDesignResult.donut')
  const total = budget.total || 1
  const shares: Record<(typeof SEGMENTS)[number]['key'], number> = {
    rough: budget.rough / total,
    finishing: budget.finishing / total,
    interior: budget.interior / total
  }

  const radius = 60
  const circumference = 2 * Math.PI * radius

  const arcs = SEGMENTS.map((seg, i) => {
    const dash = shares[seg.key] * circumference
    const offset = SEGMENTS.slice(0, i).reduce((sum, p) => sum + shares[p.key], 0) * circumference
    return { ...seg, dash, offset }
  })

  return (
    <div className='flex flex-col items-center gap-4 sm:flex-row'>
      <svg viewBox='0 0 160 160' className='size-40 -rotate-90' role='img' aria-label={t('label')}>
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
          <li key={seg.key} className='flex items-center gap-2 text-sm'>
            <span className='size-3 shrink-0 rounded-full' style={{ backgroundColor: seg.color }} />
            <span className='font-medium'>{t(`portion.${seg.key}`)}</span>
            <span className='text-muted-foreground tabular-nums'>{Math.round(shares[seg.key] * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
