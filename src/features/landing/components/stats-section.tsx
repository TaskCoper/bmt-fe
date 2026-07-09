'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

import { RevealStagger, revealItemScale } from '@/shared/components/common'
import { LANDING_SECTIONS } from '../constants/landing.constants'

type StatKey = 'projects' | 'clients' | 'materials' | 'accuracy'

const STATS: StatKey[] = ['projects', 'clients', 'materials', 'accuracy']

/** Trust/stats band — doubles as the "About" anchor. Numbers pop in staggered. */
export function StatsSection() {
  const t = useTranslations('landing.stats')

  return (
    <section id={LANDING_SECTIONS.about} className='relative py-16 lg:py-20'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-8'>
        <RevealStagger className='glass-panel grid grid-cols-2 gap-y-10 p-8 lg:grid-cols-4 lg:p-10' amount={0.3}>
          {STATS.map((key) => (
            <motion.div
              key={key}
              variants={revealItemScale}
              className='border-glass-border px-4 text-center lg:[&:not(:last-child)]:border-r'
            >
              <dt className='from-primary to-chart-2 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent tabular-nums lg:text-4xl'>
                {t(`${key}.value`)}
              </dt>
              <dd className='text-muted-foreground mt-2 text-sm'>{t(`${key}.label`)}</dd>
            </motion.div>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
