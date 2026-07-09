import { Button } from '@/shared/components/ui/button'
import { AuthCta } from '@/shared/components/auth-cta'
import { ArrowRight, Box, Check, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LANDING_SECTIONS } from '../constants/landing.constants'

/**
 * Marketing hero — an asymmetric split: the value proposition on the left, a
 * glass "app window" mock of the Studio (a 3D render beside the live estimate)
 * on the right, so visitors instantly see the product.
 */
export function LandingHero() {
  const t = useTranslations('landing.hero')
  const chips = [t('chip1'), t('chip2'), t('chip3')]

  return (
    <section id={LANDING_SECTIONS.home} className='relative'>
      <div className='relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:px-8 lg:py-28'>
        {/* Value proposition — left */}
        <div>
          <span className='text-primary/85 border-primary/25 bg-primary/5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur'>
            <Sparkles className='size-3.5' />
            {t('badge')}
          </span>

          <h1 className='font-display mt-6 text-4xl leading-[1.04] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.4rem]'>
            {t('title')}
          </h1>

          <p className='text-muted-foreground mt-6 max-w-xl text-lg text-pretty'>{t('subtitle')}</p>

          <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
            <AuthCta size='lg' className='shadow-[0_14px_30px_-10px_oklch(0.77_0.155_65_/_0.75)]'>
              {t('primaryCta')}
              <ArrowRight className='size-4' />
            </AuthCta>
            <Button asChild size='lg' variant='ghost' className='glass-inset rounded-xl'>
              <a href={`#${LANDING_SECTIONS.projects}`}>{t('secondaryCta')}</a>
            </Button>
          </div>

          <ul className='mt-9 flex flex-wrap gap-x-6 gap-y-3'>
            {chips.map((chip) => (
              <li key={chip} className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
                <span className='bg-primary/15 text-primary flex size-5 items-center justify-center rounded-full'>
                  <Check className='size-3' />
                </span>
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* Product window — a glass "app shot" of the Studio, on the right */}
        <div className='w-full'>
          <HeroPreview />
        </div>
      </div>
    </section>
  )
}

/** Glass "app window" mock of the Studio — a 3D render beside the live estimate. */
function HeroPreview() {
  const t = useTranslations('landing.hero')

  return (
    <div className='glass-panel overflow-hidden p-0'>
      {/* window title bar */}
      <div className='border-glass-border/70 flex items-center gap-3 border-b px-4 py-3'>
        <div className='flex items-center gap-1.5' aria-hidden>
          <span className='bg-destructive/70 size-3 rounded-full' />
          <span className='bg-primary/80 size-3 rounded-full' />
          <span className='bg-success/70 size-3 rounded-full' />
        </div>
        <div className='ml-1 flex items-center gap-2'>
          <span
            aria-hidden
            className='from-primary/90 to-primary flex size-6 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-extrabold text-[#241705]'
          >
            B
          </span>
          <span className='text-sm font-semibold tracking-tight'>{t('previewApp')}</span>
        </div>
        <span className='bg-primary/12 text-primary ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.68rem] font-semibold'>
          <Sparkles className='size-3' />
          AI
        </span>
      </div>

      {/* window body: 3D render + estimate panel */}
      <div className='grid gap-3 p-3 lg:grid-cols-[1.6fr_1fr]'>
        <RenderCanvas />
        <EstimatePanel />
      </div>
    </div>
  )
}

/** Faux 3D render viewport — a warm-lit modern house, not a stock photo. */
function RenderCanvas() {
  const t = useTranslations('landing.hero')

  return (
    <div className='border-glass-border relative min-h-[240px] overflow-hidden rounded-2xl border'>
      <div className='from-primary/25 to-chart-2/25 absolute inset-0 bg-gradient-to-br via-transparent' aria-hidden />
      <div
        className='from-foreground/12 absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t to-transparent'
        aria-hidden
      />

      <svg
        viewBox='0 0 320 200'
        className='absolute inset-0 h-full w-full'
        preserveAspectRatio='xMidYMax slice'
        aria-hidden
      >
        <circle cx='264' cy='44' r='20' className='fill-primary/30' />
        <line x1='0' y1='168' x2='320' y2='168' className='stroke-foreground/25' strokeWidth='1.5' />
        {/* lower wing */}
        <rect
          x='40'
          y='120'
          width='96'
          height='48'
          className='fill-background/50 stroke-foreground/40'
          strokeWidth='1.5'
        />
        <rect x='58' y='134' width='24' height='34' className='fill-primary/30' />
        <rect x='96' y='132' width='28' height='24' className='fill-foreground/10' />
        {/* main block */}
        <rect
          x='128'
          y='78'
          width='120'
          height='90'
          className='fill-background/60 stroke-foreground/45'
          strokeWidth='1.5'
        />
        <rect x='128' y='72' width='120' height='8' className='fill-primary/40' />
        <rect x='150' y='96' width='30' height='30' className='fill-primary/45' />
        <rect x='196' y='96' width='30' height='30' className='fill-primary/45' />
        <rect x='150' y='134' width='76' height='30' className='fill-primary/20' />
        {/* tree */}
        <rect x='284' y='150' width='4' height='18' className='fill-foreground/30' />
        <circle cx='286' cy='150' r='14' className='fill-chart-2/40' />
      </svg>

      <span className='glass-inset absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold'>
        <Box className='size-3.5' />
        {t('previewRender')}
      </span>
      <span className='glass-inset absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-xs font-medium'>
        {t('previewProject')}
      </span>
    </div>
  )
}

/** Live estimate side panel — total, cost split and a mini 2D drawing. */
function EstimatePanel() {
  const t = useTranslations('landing.hero')

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <p className='text-muted-foreground text-xs font-medium'>{t('previewTotalLabel')}</p>
        <p className='mt-1 text-2xl font-bold tracking-[-0.03em] tabular-nums sm:text-3xl'>{t('previewTotal')}</p>
        <span className='text-success bg-success/12 mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold'>
          <Check className='size-3.5' />
          {t('previewFit')}
        </span>
      </div>

      <div>
        <div className='glass-inset flex h-3 overflow-hidden rounded-full p-0'>
          <span className='bg-primary h-full' style={{ width: '52%' }} />
          <span className='bg-chart-2 h-full' style={{ width: '30%' }} />
          <span className='bg-chart-3 h-full' style={{ width: '18%' }} />
        </div>
        <div className='mt-3 flex flex-col gap-1.5 text-xs'>
          <Legend color='bg-primary' label={t('previewRough')} value='52%' />
          <Legend color='bg-chart-2' label={t('previewFinishing')} value='30%' />
          <Legend color='bg-chart-3' label={t('previewInterior')} value='18%' />
        </div>
      </div>

      <div className='border-glass-border bg-background/40 mt-auto overflow-hidden rounded-xl border p-3'>
        <p className='text-muted-foreground mb-1.5 text-[0.7rem] font-semibold tracking-wide uppercase'>
          {t('previewDrawing')}
        </p>
        <svg viewBox='0 0 260 96' fill='none' className='w-full' aria-hidden>
          <rect
            x='6'
            y='6'
            width='248'
            height='84'
            rx='4'
            stroke='currentColor'
            strokeWidth='1.5'
            className='text-foreground/70'
          />
          <line
            x1='120'
            y1='6'
            x2='120'
            y2='90'
            stroke='currentColor'
            strokeWidth='1.5'
            className='text-foreground/40'
          />
          <line
            x1='120'
            y1='50'
            x2='254'
            y2='50'
            stroke='currentColor'
            strokeWidth='1.5'
            className='text-foreground/40'
          />
          <rect x='20' y='20' width='20' height='20' className='fill-primary/40' />
          <path d='M150 90 v-16 a16 16 0 0 1 16 -16' stroke='var(--chart-2)' strokeWidth='1.5' />
        </svg>
      </div>
    </div>
  )
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <span className='text-muted-foreground flex items-center gap-1.5'>
      <span className={`size-2.5 rounded-[4px] ${color}`} />
      {label}
      <b className='text-foreground tabular-nums'>{value}</b>
    </span>
  )
}
