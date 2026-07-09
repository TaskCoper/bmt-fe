'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

import { RevealStagger, revealItemLeft, revealSpring } from '@/shared/components/common'
import { LANDING_SECTIONS } from '../constants/landing.constants'
import { SectionHeading } from './section-heading'

type StepKey = 'step1' | 'step2' | 'step3' | 'step4'

const STEPS: StepKey[] = ['step1', 'step2', 'step3', 'step4']

/** "How it works" — the 4-step reference-estimate flow, staggered on scroll. */
export function ProcessSection() {
  const t = useTranslations('landing.process')

  return (
    <section id={LANDING_SECTIONS.process} className='relative py-20 lg:py-28'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-8'>
        <SectionHeading badge={t('badge')} title={t('title')} subtitle={t('subtitle')} />

        <RevealStagger className='mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4' amount={0.15}>
          {STEPS.map((step, index) => (
            <motion.div
              key={step}
              variants={revealItemLeft}
              whileHover={{ y: -6 }}
              transition={revealSpring}
              className='glass-card group p-6'
            >
              <div className='from-primary/90 to-primary flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-[#241705] tabular-nums shadow-[0_6px_16px_-6px_oklch(0.77_0.155_65_/_0.7)] transition-transform duration-300 group-hover:scale-110'>
                {index + 1}
              </div>
              <h3 className='mt-5 text-base font-semibold tracking-tight'>{t(`${step}.title`)}</h3>
              <p className='text-muted-foreground mt-2 text-sm'>{t(`${step}.description`)}</p>
            </motion.div>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
