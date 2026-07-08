import { Link } from '@/i18n/navigation'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LANDING_SECTIONS } from '../constants/landing.constants'

/**
 * Marketing hero — a split layout that pairs the value proposition with a live
 * glass "result console" so visitors instantly see what the platform produces
 * (a personalised estimate + 2D drawing), over the cinematic ambient canvas.
 */
export function LandingHero() {
  const t = useTranslations('landing.hero')
  const chips = [t('chip1'), t('chip2'), t('chip3')]

  return (
    <section id={LANDING_SECTIONS.home} className='relative'>
      <div className='relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-20 lg:grid-cols-[1.04fr_1fr] lg:gap-10 lg:px-8 lg:py-28'>
        {/* Value proposition */}
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
            <Button asChild size='lg' className='shadow-[0_14px_30px_-10px_oklch(0.77_0.155_65_/_0.75)]'>
              <Link href={ROUTES.LOGIN}>
                {t('primaryCta')}
                <ArrowRight className='size-4' />
              </Link>
            </Button>
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

        {/* Live result console */}
        <HeroPreview />
      </div>
    </section>
  )
}

/** Frosted "estimate dossier" preview — shows a real deliverable, not chrome. */
function HeroPreview() {
  const t = useTranslations('landing.hero')

  return (
    <div className='glass-panel relative p-5 sm:p-6 lg:rotate-1 lg:transition-transform lg:duration-500 lg:ease-[var(--ease-out-soft)] lg:hover:rotate-0'>
      {/* header */}
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2.5'>
          <span
            aria-hidden
            className='from-primary/90 to-primary flex size-8 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-[#241705]'
          >
            B
          </span>
          <span className='text-sm font-semibold tracking-tight'>{t('previewProject')}</span>
        </div>
        <span className='bg-primary/12 text-primary inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.68rem] font-semibold'>
          <Sparkles className='size-3' />
          AI
        </span>
      </div>

      {/* total */}
      <div className='mt-5'>
        <p className='text-muted-foreground text-xs font-medium'>{t('previewTotalLabel')}</p>
        <p className='mt-1 text-3xl font-bold tracking-[-0.03em] tabular-nums'>{t('previewTotal')}</p>
        <span className='text-success bg-success/12 mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold'>
          <Check className='size-3.5' />
          {t('previewFit')}
        </span>
      </div>

      {/* cost bar (rough / finishing / interior) */}
      <div className='mt-5'>
        <div className='glass-inset flex h-3 overflow-hidden rounded-full p-0'>
          <span className='bg-primary h-full' style={{ width: '52%' }} />
          <span className='bg-chart-2 h-full' style={{ width: '30%' }} />
          <span className='bg-chart-3 h-full' style={{ width: '18%' }} />
        </div>
        <div className='mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs'>
          <Legend color='bg-primary' label={t('previewRough')} value='52%' />
          <Legend color='bg-chart-2' label={t('previewFinishing')} value='30%' />
          <Legend color='bg-chart-3' label={t('previewInterior')} value='18%' />
        </div>
      </div>

      {/* mini 2D drawing */}
      <div className='border-glass-border bg-background/40 relative mt-5 overflow-hidden rounded-2xl border p-4 backdrop-blur-sm'>
        <p className='text-muted-foreground mb-2 text-[0.7rem] font-semibold tracking-wide uppercase'>
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
