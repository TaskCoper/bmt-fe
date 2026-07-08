'use client'

import { useTranslations } from 'next-intl'

import { HOUSE_STYLE_LIST } from '../constants/studio.constants'
import { useCurrentProject } from '../store/wizard.store'

/**
 * Live "architectural sketch" card for step 2 — a frosted preview that reflects
 * the current style / storeys / area choices, giving the form a spatial partner
 * (and something warm behind the glass). Purely presentational.
 */
export function RequirementsPreview() {
  const t = useTranslations('studio.preview')
  const tStyle = useTranslations('studio.style')
  const project = useCurrentProject()
  const data = project?.data

  const storeys = (data?.floors ?? 0) + 1
  const area = data?.area ?? 0
  const floorArea = Math.round(area * storeys)
  const styleOption = HOUSE_STYLE_LIST.find((o) => o.id === data?.style)
  const showTum = !!styleOption?.hasTumOption && !!data?.hasTum

  return (
    <div className="glass-panel flex flex-col overflow-hidden lg:sticky lg:top-24">
      <div className="text-primary/80 flex items-center justify-between px-6 pt-6 text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
        <span>{t('title')}</span>
      </div>

      {/* Blueprint stage */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-8">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 120%, oklch(0.77 0.155 65 / 0.2), transparent 62%)',
          }}
        />
        <svg
          viewBox="0 0 240 200"
          fill="none"
          className="relative w-full max-w-[300px] drop-shadow-[0_22px_30px_oklch(0.3_0.03_60_/_0.35)]"
          aria-hidden
        >
          <line
            x1="20"
            y1="182"
            x2="220"
            y2="182"
            stroke="var(--primary)"
            strokeWidth="1.5"
            opacity="0.55"
          />
          <rect
            x="60"
            y="96"
            width="120"
            height="86"
            rx="3"
            fill="var(--glass-bg-strong)"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground"
          />
          <line
            x1="60"
            y1="124"
            x2="180"
            y2="124"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
            className="text-foreground"
          />
          <line
            x1="60"
            y1="152"
            x2="180"
            y2="152"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
            className="text-foreground"
          />
          <rect
            x="54"
            y="84"
            width="132"
            height="12"
            rx="2"
            fill="var(--primary)"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground"
          />
          {showTum ? (
            <rect
              x="150"
              y="60"
              width="30"
              height="24"
              rx="2"
              fill="var(--chart-2)"
              stroke="currentColor"
              strokeWidth="2"
              className="text-foreground"
            />
          ) : null}
          <rect
            x="74"
            y="106"
            width="16"
            height="12"
            fill="var(--primary)"
            opacity="0.55"
          />
          <rect
            x="100"
            y="106"
            width="16"
            height="12"
            fill="var(--primary)"
            opacity="0.55"
          />
          <rect
            x="74"
            y="132"
            width="16"
            height="12"
            fill="var(--primary)"
            opacity="0.55"
          />
          <rect
            x="100"
            y="132"
            width="16"
            height="12"
            fill="var(--primary)"
            opacity="0.55"
          />
          <rect
            x="140"
            y="154"
            width="20"
            height="28"
            fill="currentColor"
            opacity="0.75"
            className="text-foreground"
          />
        </svg>
      </div>

      {/* Meta pills */}
      <div className="border-glass-border flex flex-wrap gap-2 border-t px-6 py-5">
        {styleOption ? (
          <span className="border-primary/40 bg-primary/15 text-primary rounded-xl border px-3 py-1.5 text-xs font-medium">
            {tStyle(`name.${styleOption.id}`)}
          </span>
        ) : null}
        <span className="glass-inset rounded-xl px-3 py-1.5 text-xs font-medium tabular-nums">
          {t('storeys', { count: storeys })}
        </span>
        {area > 0 ? (
          <span className="glass-inset rounded-xl px-3 py-1.5 text-xs font-medium tabular-nums">
            {t('floorArea', { area: floorArea })}
          </span>
        ) : null}
        {showTum ? (
          <span className="glass-inset rounded-xl px-3 py-1.5 text-xs font-medium">
            {t('tum')}
          </span>
        ) : null}
      </div>
    </div>
  )
}
