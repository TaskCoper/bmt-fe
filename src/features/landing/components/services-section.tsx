import { cn } from '@/shared/lib/utils'
import { Bot, Building2, Calculator, Images, LayoutTemplate, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LANDING_SECTIONS } from '../constants/landing.constants'
import { SectionHeading } from './section-heading'

type FeatureKey = 'studio' | 'estimate' | 'gallery' | 'portfolio' | 'chatbot'

/** The flagship studio card spans two columns; the rest fill a clean 3×2 bento. */
const FEATURES: { key: FeatureKey; icon: LucideIcon; featured?: boolean }[] = [
  { key: 'studio', icon: LayoutTemplate, featured: true },
  { key: 'estimate', icon: Calculator },
  { key: 'gallery', icon: Images },
  { key: 'portfolio', icon: Building2 },
  { key: 'chatbot', icon: Bot }
]

/**
 * "What the platform does" — a bento of the platform's capabilities (design
 * studio, quick estimate, design gallery, portfolio, AI assistant). The flagship
 * studio card is featured with a small cost-split visual so the value is shown,
 * not just told.
 */
export function ServicesSection() {
  const t = useTranslations('landing.features')

  return (
    <section id={LANDING_SECTIONS.services} className='relative py-20 lg:py-28'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-8'>
        <SectionHeading badge={t('badge')} title={t('title')} subtitle={t('subtitle')} />

        <div className='mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {FEATURES.map(({ key, icon: Icon, featured }) => (
            <article
              key={key}
              className={cn('glass-card flex flex-col p-6 sm:p-7', featured && 'sm:col-span-2 lg:col-span-2')}
            >
              <div className='flex items-center gap-3'>
                <span className='border-primary/25 from-primary/20 to-primary/5 text-primary flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br'>
                  <Icon className='size-5' />
                </span>
                <span className='glass-inset text-muted-foreground rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide'>
                  {t(`${key}.tag`)}
                </span>
              </div>

              <h3 className='mt-5 text-lg font-semibold tracking-tight'>{t(`${key}.title`)}</h3>
              <p className='text-muted-foreground mt-2 max-w-xl text-sm text-pretty'>{t(`${key}.description`)}</p>

              {featured ? (
                <div className='mt-6 flex flex-1 items-end'>
                  <CostBar />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Mini 3-category cost split for the studio card. */
function CostBar() {
  return (
    <div className='w-full'>
      <div className='glass-inset flex h-3 overflow-hidden rounded-full'>
        <span className='bg-primary' style={{ width: '52%' }} />
        <span className='bg-chart-2' style={{ width: '30%' }} />
        <span className='bg-chart-3' style={{ width: '18%' }} />
      </div>
      <div className='mt-3 flex flex-wrap gap-4 text-xs'>
        {(
          [
            ['bg-primary', '52%'],
            ['bg-chart-2', '30%'],
            ['bg-chart-3', '18%']
          ] as const
        ).map(([color, pct]) => (
          <span key={pct} className='text-muted-foreground flex items-center gap-1.5'>
            <span className={cn('size-2.5 rounded-[4px]', color)} />
            <b className='text-foreground tabular-nums'>{pct}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
