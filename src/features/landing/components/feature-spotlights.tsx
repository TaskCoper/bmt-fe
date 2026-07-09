import { ArrowRight, Check, Heart, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'
import { AuthCta } from '@/shared/components/auth-cta'
import { Reveal, StockImage } from '@/shared/components/common'

/**
 * Alternating full-width feature spotlights (tamagui-style rhythm): a big
 * value statement + bullet list on one side, a live glass visual of the actual
 * deliverable on the other, flipping sides section to section.
 */
export function FeatureSpotlights() {
  const t = useTranslations('landing.spotlight')

  return (
    <div className='relative'>
      <Spotlight
        reverse
        eyebrow={t('visuals.eyebrow')}
        title={t('visuals.title')}
        description={t('visuals.description')}
        bullets={[t('visuals.bullet1'), t('visuals.bullet2'), t('visuals.bullet3')]}
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
  visual
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
    <section className='relative py-16 lg:py-24'>
      <div className='mx-auto grid w-full max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8'>
        <Reveal direction={reverse ? 'right' : 'left'} className={cn(reverse && 'lg:order-2')}>
          <span className='text-primary/85 border-primary/25 bg-primary/5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur'>
            <Sparkles className='size-3.5' />
            {eyebrow}
          </span>
          <h2 className='font-display mt-5 text-3xl leading-[1.08] font-bold tracking-[-0.03em] text-balance sm:text-4xl'>
            {title}
          </h2>
          <p className='text-muted-foreground mt-5 max-w-xl text-base text-pretty'>{description}</p>
          <ul className='mt-7 space-y-3'>
            {bullets.map((b) => (
              <li key={b} className='flex items-start gap-3 text-sm'>
                <span className='bg-primary/15 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full'>
                  <Check className='size-3' />
                </span>
                <span className='font-medium'>{b}</span>
              </li>
            ))}
          </ul>
          <AuthCta size='lg' className='mt-9'>
            {cta}
            <ArrowRight className='size-4' />
          </AuthCta>
        </Reveal>
        <Reveal direction={reverse ? 'left' : 'right'} delay={0.1} className={cn(reverse && 'lg:order-1')}>
          {visual}
        </Reveal>
      </div>
    </section>
  )
}

/** Drawings + renders visual — a 2D plan over a small render gallery. */
function RenderVisual() {
  const t = useTranslations('landing.hero')

  return (
    <div className='glass-panel p-6 lg:p-7'>
      <p className='text-muted-foreground mb-2 text-[0.7rem] font-semibold tracking-wide uppercase'>
        {t('previewDrawing')}
      </p>
      <div className='border-glass-border bg-background/40 overflow-hidden rounded-2xl border p-4 backdrop-blur-sm'>
        <svg viewBox='0 0 320 130' fill='none' className='w-full' aria-hidden>
          <rect
            x='8'
            y='8'
            width='304'
            height='114'
            rx='4'
            stroke='currentColor'
            strokeWidth='1.5'
            className='text-foreground/70'
          />
          <line
            x1='150'
            y1='8'
            x2='150'
            y2='122'
            stroke='currentColor'
            strokeWidth='1.5'
            className='text-foreground/35'
          />
          <line
            x1='150'
            y1='66'
            x2='312'
            y2='66'
            stroke='currentColor'
            strokeWidth='1.5'
            className='text-foreground/35'
          />
          <rect x='26' y='26' width='26' height='26' className='fill-primary/40' />
          <path d='M186 122 v-18 a18 18 0 0 1 18 -18' stroke='var(--chart-2)' strokeWidth='1.5' />
        </svg>
      </div>

      <div className='mt-4 grid grid-cols-3 gap-3'>
        {[0, 1, 2].map((i) => (
          <div key={i} className='border-glass-border relative aspect-[4/3] overflow-hidden rounded-xl border'>
            <StockImage
              seed={`spotlight-render-${i}`}
              alt={t('previewRender')}
              width={320}
              className='size-full transition-transform duration-500 ease-out hover:scale-110'
            />
            {i === 1 ? (
              <span className='absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm'>
                <Heart className='fill-primary text-primary size-3.5' />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
