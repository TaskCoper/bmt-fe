'use client'

import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'
import { Reveal, RevealStagger, StockImage, revealItemVariants, revealSpring } from '@/shared/components/common'
import { LANDING_SECTIONS } from '../constants/landing.constants'
import { SectionHeading } from './section-heading'

type ProjectKey = 'item1' | 'item2' | 'item3'

const PROJECTS: ProjectKey[] = ['item1', 'item2', 'item3']

/** Featured reference projects — staggered reveal + springy hover. */
export function FeaturedProjects() {
  const t = useTranslations('landing.projects')

  return (
    <section id={LANDING_SECTIONS.projects} className='relative py-20 lg:py-28'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-8'>
        <SectionHeading badge={t('badge')} title={t('title')} subtitle={t('subtitle')} />

        <RevealStagger className='mt-14 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {PROJECTS.map((key) => (
            <motion.article
              key={key}
              variants={revealItemVariants}
              whileHover={{ y: -6 }}
              transition={revealSpring}
              className='glass-card group overflow-hidden'
            >
              <div className='relative aspect-[4/3] overflow-hidden'>
                <StockImage
                  seed={`featured-${key}`}
                  alt={t(`${key}.name`)}
                  width={600}
                  className='size-full transition-transform duration-500 ease-out group-hover:scale-105'
                />
              </div>
              <div className='border-glass-border flex items-start justify-between gap-3 border-t p-5'>
                <div>
                  <Badge variant='outline' className='mb-2'>
                    {t(`${key}.category`)}
                  </Badge>
                  <h3 className='text-sm font-semibold'>{t(`${key}.name`)}</h3>
                </div>
                <ArrowUpRight className='text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
              </div>
            </motion.article>
          ))}
        </RevealStagger>

        <Reveal className='mt-10 flex justify-center' delay={0.1}>
          <Button asChild variant='outline'>
            <Link href={ROUTES.PORTFOLIO}>{t('viewAll')}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
