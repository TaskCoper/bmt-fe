import { Link } from '@/i18n/navigation'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'
import { ArrowUpRight, ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LANDING_SECTIONS } from '../constants/landing.constants'
import { SectionHeading } from './section-heading'

type ProjectKey = 'item1' | 'item2' | 'item3'

const PROJECTS: ProjectKey[] = ['item1', 'item2', 'item3']

/**
 * Featured reference projects. Uses a neutral image placeholder so the layout
 * is correct before real assets exist (swap the placeholder for <Image/>).
 */
export function FeaturedProjects() {
  const t = useTranslations('landing.projects')

  return (
    <section id={LANDING_SECTIONS.projects} className='relative py-20 lg:py-28'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-8'>
        <SectionHeading badge={t('badge')} title={t('title')} subtitle={t('subtitle')} />
        <div className='mt-14 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {PROJECTS.map((key) => (
            <article key={key} className='glass-card group overflow-hidden'>
              <div className='text-muted-foreground/60 relative flex aspect-[4/3] items-center justify-center'>
                <div
                  aria-hidden
                  className='absolute inset-0'
                  style={{
                    background:
                      'radial-gradient(120% 90% at 50% 0%, oklch(0.77 0.155 65 / 0.16), transparent 60%), repeating-linear-gradient(0deg, var(--grid-line) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, var(--grid-line) 0 1px, transparent 1px 24px)'
                  }}
                />
                <ImageIcon className='relative size-8' />
              </div>
              <div className='border-glass-border flex items-start justify-between gap-3 border-t p-5'>
                <div>
                  <Badge variant='outline' className='mb-2'>
                    {t(`${key}.category`)}
                  </Badge>
                  <h3 className='text-sm font-semibold'>{t(`${key}.name`)}</h3>
                </div>
                <ArrowUpRight className='text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors' />
              </div>
            </article>
          ))}
        </div>
        <div className='mt-10 flex justify-center'>
          <Button asChild variant='outline'>
            <Link href={ROUTES.PROJECTS}>{t('viewAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
