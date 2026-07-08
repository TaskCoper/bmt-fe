import { useTranslations } from 'next-intl'
import { LANDING_SECTIONS } from '../constants/landing.constants'

type StatKey = 'projects' | 'clients' | 'materials' | 'accuracy'

const STATS: StatKey[] = ['projects', 'clients', 'materials', 'accuracy']

/** Trust/stats band — doubles as the "About" anchor. */
export function StatsSection() {
  const t = useTranslations('landing.stats')

  return (
    <section id={LANDING_SECTIONS.about} className='relative py-16 lg:py-20'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-8'>
        <dl className='glass-panel grid grid-cols-2 gap-y-10 p-8 lg:grid-cols-4 lg:p-10'>
          {STATS.map((key) => (
            <div key={key} className='border-glass-border px-4 text-center lg:[&:not(:last-child)]:border-r'>
              <dt className='from-primary to-chart-2 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent tabular-nums lg:text-4xl'>
                {t(`${key}.value`)}
              </dt>
              <dd className='text-muted-foreground mt-2 text-sm'>{t(`${key}.label`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
