import { ArrowRight, Check, Heart, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import { Link } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'

/**
 * Alternating full-width feature spotlights (tamagui-style rhythm): a big
 * value statement + bullet list on one side, a live glass visual of the actual
 * deliverable on the other, flipping sides section to section.
 */
export function FeatureSpotlights() {
  const t = useTranslations('landing.spotlight')

  return (
    <div className="relative">
      <Spotlight
        eyebrow={t('estimate.eyebrow')}
        title={t('estimate.title')}
        description={t('estimate.description')}
        bullets={[
          t('estimate.bullet1'),
          t('estimate.bullet2'),
          t('estimate.bullet3'),
        ]}
        cta={t('cta')}
        visual={<EstimateVisual />}
      />
      <Spotlight
        reverse
        eyebrow={t('visuals.eyebrow')}
        title={t('visuals.title')}
        description={t('visuals.description')}
        bullets={[
          t('visuals.bullet1'),
          t('visuals.bullet2'),
          t('visuals.bullet3'),
        ]}
        cta={t('cta')}
        visual={<RenderVisual />}
      />
    </div>
  )
}

function Spotlight({
  reverse,
  eyebrow,
  title,
  description,
  bullets,
  cta,
  visual,
}: {
  reverse?: boolean
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  cta: string
  visual: ReactNode
}) {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className={cn(reverse && 'lg:order-2')}>
          <span className="text-primary/85 border-primary/25 bg-primary/5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
            <Sparkles className="size-3.5" />
            {eyebrow}
          </span>
          <h2 className="font-display mt-5 text-3xl leading-[1.08] font-bold tracking-[-0.03em] text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl text-base text-pretty">
            {description}
          </p>
          <ul className="mt-7 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="bg-primary/15 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                  <Check className="size-3" />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-9">
            <Link href={ROUTES.LOGIN}>
              {cta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className={cn(reverse && 'lg:order-1')}>{visual}</div>
      </div>
    </section>
  )
}

/** Estimate dossier visual — total, 3-category split, package selection. */
function EstimateVisual() {
  const t = useTranslations('landing.hero')
  const ts = useTranslations('landing.spotlight')
  const packages = [
    { name: ts('pkgBasic'), price: '1,44 tỷ', on: false },
    { name: ts('pkgStandard'), price: '2,18 tỷ', on: true },
    { name: ts('pkgVip'), price: '3,05 tỷ', on: false },
  ]

  return (
    <div className="glass-panel p-6 lg:p-7">
      <div className="flex items-baseline justify-between">
        <p className="text-muted-foreground text-xs font-medium">
          {t('previewTotalLabel')}
        </p>
        <span className="text-success bg-success/12 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.7rem] font-semibold">
          <Check className="size-3" />
          {t('previewFit')}
        </span>
      </div>
      <p className="mt-1 text-4xl font-bold tracking-[-0.03em] tabular-nums">
        {t('previewTotal')}
      </p>

      <div className="glass-inset mt-5 flex h-3 overflow-hidden rounded-full">
        <span className="bg-primary" style={{ width: '52%' }} />
        <span className="bg-chart-2" style={{ width: '30%' }} />
        <span className="bg-chart-3" style={{ width: '18%' }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {(
          [
            ['bg-primary', t('previewRough'), '52%'],
            ['bg-chart-2', t('previewFinishing'), '30%'],
            ['bg-chart-3', t('previewInterior'), '18%'],
          ] as const
        ).map(([color, label, pct]) => (
          <span
            key={label}
            className="text-muted-foreground flex items-center gap-1.5"
          >
            <span className={cn('size-2.5 rounded-[4px]', color)} />
            {label}
            <b className="text-foreground tabular-nums">{pct}</b>
          </span>
        ))}
      </div>

      <div className="mt-6 space-y-2.5">
        {packages.map((p) => (
          <div
            key={p.name}
            className={cn(
              'flex items-center gap-3 rounded-2xl p-3.5',
              p.on ? 'glass-selected' : 'glass-inset',
            )}
          >
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full',
                p.on
                  ? 'bg-primary text-primary-foreground'
                  : 'border-glass-border border',
              )}
            >
              {p.on ? <Check className="size-3" /> : null}
            </span>
            <span className="flex-1 text-sm font-medium">{p.name}</span>
            <span className="text-sm font-bold tabular-nums">{p.price}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Drawings + renders visual — a 2D plan over a small render gallery. */
function RenderVisual() {
  const t = useTranslations('landing.hero')
  const renders = [24, 190, 320]

  return (
    <div className="glass-panel p-6 lg:p-7">
      <p className="text-muted-foreground mb-2 text-[0.7rem] font-semibold tracking-wide uppercase">
        {t('previewDrawing')}
      </p>
      <div className="border-glass-border bg-background/40 overflow-hidden rounded-2xl border p-4 backdrop-blur-sm">
        <svg viewBox="0 0 320 130" fill="none" className="w-full" aria-hidden>
          <rect
            x="8"
            y="8"
            width="304"
            height="114"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/70"
          />
          <line
            x1="150"
            y1="8"
            x2="150"
            y2="122"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/35"
          />
          <line
            x1="150"
            y1="66"
            x2="312"
            y2="66"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/35"
          />
          <rect
            x="26"
            y="26"
            width="26"
            height="26"
            className="fill-primary/40"
          />
          <path
            d="M186 122 v-18 a18 18 0 0 1 18 -18"
            stroke="var(--chart-2)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {renders.map((hue, i) => (
          <div
            key={hue}
            className="border-glass-border relative aspect-[4/3] overflow-hidden rounded-xl border"
          >
            <span
              className="block size-full"
              style={{
                background: `linear-gradient(135deg, hsl(${hue} 65% 58%), hsl(${(hue + 40) % 360} 55% 38%))`,
              }}
            />
            {i === 1 ? (
              <span className="absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm">
                <Heart className="fill-primary text-primary size-3.5" />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
